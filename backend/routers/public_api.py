"""
Public versioned XaaS API — /api/v1/...

This layer exposes the Adaptive Learning engine as a clean, versioned,
cloud-callable service — the "as-a-service" contract that any LMS, EdTech
tool, or third-party application can consume without understanding internal
implementation details.

Design principle
----------------
Every endpoint is stateless from the caller's perspective: pass student data
in, get analytics/plans back.  Internally the engine maintains state (BKT
posteriors, forgetting curves) so repeated calls correctly reflect learning
history.

Workflows served
----------------
Workflow A — individual learner (commercial / institutional)
    POST /api/v1/mastery/update          ingest quiz/session data → update BKT
    GET  /api/v1/mastery/{sid}/{subj}    current mastery snapshot
    GET  /api/v1/mastery/{sid}/{subj}/priorities   ranked study priority list
    POST /api/v1/schedule/generate       generate personalised Pomodoro plan
    GET  /api/v1/insights/{sid}/{subj}   AI prescriptive text insight

Workflow B — curriculum researcher / institution (societal)
    See /research/* endpoints (research.py)
"""

from __future__ import annotations

import os
import sys
from datetime import date, timedelta
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel, Field

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "src"))

router = APIRouter(prefix="/api/v1", tags=["public-api-v1"])


# ── Request / Response schemas ──────────────────────────────────────────────

class QuizAttempt(BaseModel):
    concept_id: str
    correct: bool
    response_time_seconds: float = 60.0
    error_depth: float = Field(default=0.0, ge=0.0, le=1.0,
                               description="0 = shallow mistake, 1 = fundamental gap")


class MasteryUpdateRequest(BaseModel):
    student_id: str
    subject: str
    attempts: List[QuizAttempt]


class ScheduleRequest(BaseModel):
    student_id: str
    subject: str
    days_until_exam: int = Field(default=14, ge=1, le=365)
    weekly_study_hours: float = Field(default=4.0, ge=0.5, le=16.0)
    availability: Optional[List[Dict[str, Any]]] = None


# ── Helpers ─────────────────────────────────────────────────────────────────

def _get_engine():
    try:
        from engine_state import get_shared_engine
        engine, kg = get_shared_engine()
        return engine, kg
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Learning engine not ready: {exc}")


def _load_weights() -> Dict[str, float]:
    try:
        from bridge import load_exam_weights
        return load_exam_weights()
    except Exception:
        return {}


# ── Endpoints ───────────────────────────────────────────────────────────────

@router.post("/mastery/update")
async def update_mastery(body: MasteryUpdateRequest) -> Dict[str, Any]:
    """
    Ingest a batch of quiz/session attempts for a student and update their
    Bayesian Knowledge Tracing (BKT) mastery posteriors.

    This is the primary data ingestion endpoint — call it after every quiz
    session, exercise, or interactive activity.
    """
    engine, _ = _get_engine()

    from learning_model.models import QuizResponse
    responses = [
        QuizResponse(
            student_id=body.student_id,
            concept_id=a.concept_id,
            subject=body.subject,
            correct=a.correct,
            response_time_seconds=a.response_time_seconds,
            error_depth=a.error_depth,
        )
        for a in body.attempts
    ]

    engine.update_from_quiz(responses)
    state = engine.get_mastery_state(body.student_id, body.subject)

    return {
        "status": "updated",
        "student_id": body.student_id,
        "subject": body.subject,
        "overall_mastery": round(state.overall_mastery(), 3),
        "concepts_updated": len(responses),
        "weak_concepts": engine.get_weak_concepts(body.student_id, body.subject),
    }


@router.get("/mastery/{student_id}/{subject}")
async def get_mastery(student_id: str, subject: str) -> Dict[str, Any]:
    """
    Retrieve the current mastery snapshot for a student in a subject.
    Forgetting decay (Ebbinghaus) is applied automatically before responding.
    """
    engine, _ = _get_engine()
    state = engine.get_mastery_state(student_id, subject, apply_decay=True)
    exam_weights = _load_weights()
    scores = engine.predict_exam_score(student_id, subject, exam_weights)

    concepts_out = [
        {
            "concept_id": cid,
            "mastery": round(cm.p_mastery, 3),
            "stability_index": round(cm.stability_index, 3),
            "attempts": cm.attempts,
            "correct_streak": cm.correct_streak,
            "last_seen": cm.last_seen.isoformat() if cm.last_seen else None,
        }
        for cid, cm in state.concepts.items()
    ]
    concepts_out.sort(key=lambda x: x["mastery"])

    return {
        "student_id": student_id,
        "subject": subject,
        "overall_mastery": round(state.overall_mastery(), 3),
        "predicted_exam_score": scores,
        "weak_concepts": engine.get_weak_concepts(student_id, subject),
        "concepts": concepts_out,
        "causal_weaknesses": state.causal_weaknesses,
    }


@router.get("/mastery/{student_id}/{subject}/priorities")
async def get_priorities(
    student_id: str,
    subject: str,
    days_until_exam: int = 14,
) -> Dict[str, Any]:
    """
    Return concepts ranked by study urgency:
        PriorityScore = ExamWeightage × (1 − Mastery) × ForgettingRisk

    Higher score → study this first.  Used by the scheduler and timetable
    engine to allocate Pomodoro blocks.
    """
    engine, _ = _get_engine()
    exam_weights = _load_weights()
    priorities = engine.get_priority_ranking(
        student_id, subject, exam_weights, days_until_exam=days_until_exam
    )

    return {
        "student_id": student_id,
        "subject": subject,
        "days_until_exam": days_until_exam,
        "formula": "PriorityScore = ExamWeightage × (1 − Mastery) × ForgettingRisk",
        "priorities": [
            {
                "rank": i + 1,
                "concept_id": p.concept_id,
                "score": round(float(p.score), 4),
                "mastery": round(float(p.mastery), 3),
                "forgetting_risk": round(float(p.forgetting_risk), 3),
                "exam_weightage": round(float(p.exam_weightage), 3),
                "reason": p.reason,
            }
            for i, p in enumerate(priorities)
        ],
    }


@router.post("/schedule/generate")
async def generate_schedule(body: ScheduleRequest) -> Dict[str, Any]:
    """
    Generate a personalised Pomodoro-based weekly study plan for a student.

    The plan:
      - Allocates study blocks proportional to concept priority scores
      - Respects availability windows (defaults to 4h/day if not provided)
      - Detects cognitive load / burnout risk and inserts breaks
      - Returns a day-by-day schedule up to the exam date
    """
    engine, kg = _get_engine()
    exam_weights = _load_weights()

    api_key = os.getenv("OPENAI_API_KEY")

    try:
        from scheduler import TimetableEngine, AvailabilityWindow
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Scheduler not available: {exc}")

    if body.availability:
        availability = [
            AvailabilityWindow(
                day_of_week=int(a["day_of_week"]),
                available_hours=float(a["available_hours"]),
            )
            for a in body.availability
        ]
    else:
        daily_hours = min(body.weekly_study_hours / 5, 4.0)
        weekend_hours = min(body.weekly_study_hours / 2, 5.0)
        availability = [
            AvailabilityWindow(day_of_week=d, available_hours=daily_hours)
            for d in range(5)
        ] + [
            AvailabilityWindow(day_of_week=d, available_hours=weekend_hours)
            for d in range(5, 7)
        ]

    timetable = TimetableEngine(
        mastery_engine=engine,
        knowledge_graph=kg,
        openai_api_key=api_key,
    )

    exam_date = date.today() + timedelta(days=body.days_until_exam)
    plan = timetable.generate_plan(
        student_id=body.student_id,
        subjects=[body.subject],
        exam_weights_by_subject={body.subject: exam_weights},
        exam_date=exam_date,
        availability=availability,
    )

    todays_sched = timetable.get_todays_schedule(body.student_id, plan)

    def _block(b) -> dict:
        return {
            "block_type": b.block_type,
            "duration_minutes": b.duration_minutes,
            "concept_ids": list(b.concept_ids),
            "priority_score": round(float(b.priority_score), 4),
            "difficulty": round(float(b.difficulty), 3),
        }

    def _day(d) -> dict:
        return {
            "date": str(d.date),
            "day_of_week": d.date.strftime("%A"),
            "total_study_minutes": d.total_study_minutes,
            "blocks": [_block(b) for b in d.blocks],
        }

    return {
        "student_id": body.student_id,
        "subject": body.subject,
        "exam_date": str(exam_date),
        "days_until_exam": body.days_until_exam,
        "schedule": [_day(d) for d in plan.days],
        "todays_schedule": _day(todays_sched) if todays_sched else None,
    }


@router.get("/insights/{student_id}/{subject}")
async def get_ai_insight(
    student_id: str,
    subject: str,
    days_until_exam: int = 14,
) -> Dict[str, Any]:
    """
    Generate a prescriptive AI insight for the student using the LLM.

    Returns a natural-language explanation of:
      - What the student's biggest weaknesses are and WHY (causal reasoning
        from the knowledge graph)
      - What to study next and in what order
    """
    engine, _ = _get_engine()
    exam_weights = _load_weights()

    insight_text = engine.get_insight(
        student_id,
        subject,
        exam_weights=exam_weights,
        days_until_exam=days_until_exam,
    )

    state = engine.get_mastery_state(student_id, subject)

    return {
        "student_id": student_id,
        "subject": subject,
        "days_until_exam": days_until_exam,
        "overall_mastery": round(state.overall_mastery(), 3),
        "insight": insight_text,
    }


@router.get("/service-info")
async def service_info() -> Dict[str, Any]:
    """
    Returns metadata about the ALaaS service — its capabilities, the
    dual-utility design, and endpoint catalogue.  Useful for onboarding
    new institutions or third-party integrators.
    """
    return {
        "service": "Adaptive Learning-as-a-Service (ALaaS)",
        "version": "1.0.0",
        "description": (
            "A cloud-native adaptive learning engine that models each student's "
            "evolving knowledge state using Bayesian Knowledge Tracing, Ebbinghaus "
            "forgetting curves, and prerequisite knowledge graphs.  Any LMS or "
            "EdTech platform can call this API to deliver expert-quality, "
            "personalised study plans without building the AI infrastructure themselves."
        ),
        "dual_utility_design": {
            "workflow_a_commercial": (
                "Individual students and institutions receive personalised mastery "
                "tracking, priority rankings, Pomodoro study schedules, and AI "
                "prescriptive coaching — all via REST API."
            ),
            "workflow_b_research": (
                "Every student interaction contributes anonymised data to a "
                "population-level research dataset.  Curriculum designers and "
                "education researchers access this via /research/* endpoints to "
                "identify concept bottlenecks, prerequisite cascade failures, and "
                "co-failure patterns across the full student cohort — surfacing "
                "insights that benefit the broader educational community."
            ),
        },
        "core_algorithms": {
            "bkt": "4-parameter Bayesian Knowledge Tracing (L0, T, S, G)",
            "forgetting": "Ebbinghaus exponential decay R(t) = e^(-t/S)",
            "priority": "PriorityScore = ExamWeightage × (1−Mastery) × ForgettingRisk",
            "expected_score": "Σ(ExamWeightage × MasteryProbability)",
        },
        "endpoints": {
            "mastery_update": "POST /api/v1/mastery/update",
            "mastery_snapshot": "GET  /api/v1/mastery/{student_id}/{subject}",
            "priority_ranking": "GET  /api/v1/mastery/{student_id}/{subject}/priorities",
            "schedule_generate": "POST /api/v1/schedule/generate",
            "ai_insight": "GET  /api/v1/insights/{student_id}/{subject}",
            "population_insights": "GET  /research/population-insights",
            "curriculum_health": "GET  /research/curriculum-health",
        },
    }
