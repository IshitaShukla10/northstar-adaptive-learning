from __future__ import annotations

from fastapi import APIRouter, HTTPException, Body
from typing import Any, Dict, List
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "src"))

router = APIRouter(prefix="/analytics", tags=["analytics"])

# Estimated study time per difficulty tier (minutes)
_STUDY_TIME = {"easy": 20, "medium": 35, "hard": 50}


# ── Specific routes MUST come before wildcard routes ──────────────────────────

@router.post("/generate-course-breakdown")
async def generate_course_breakdown(payload: dict = Body(...)):
    """
    Use AI to break a course into study-ready concepts/subtopics with difficulty
    and estimated study time. Designed for scalability — call this whenever a
    new workbook is added that has no existing analytics data.

    Returns: { course_code, course_name, concepts: [{id, name, difficulty,
               exam_weightage, study_time_minutes, prerequisites}] }
    """
    course_name = payload.get("course_name", "")
    course_code = payload.get("course_code", "")
    if not course_name:
        raise HTTPException(status_code=422, detail="course_name is required")

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set")

    from openai import OpenAI
    import json as _json

    client = OpenAI(api_key=api_key)

    system_prompt = (
        "You are a curriculum designer. Return a JSON object with a 'concepts' array. "
        "Each concept has: 'id' (snake_case string), 'name' (readable string), "
        "'difficulty' (easy|medium|hard), 'exam_weightage' (float 0-1, all sum to ~1), "
        "'study_time_minutes' (integer: easy=20, medium=35, hard=50), "
        "'prerequisites' (array of other concept ids in this list). "
        "Generate 6-10 concepts covering the full course breadth."
    )
    user_prompt = (
        f"Break the university course '{course_name}' ({course_code}) into key concepts "
        "a student needs to master. Order them from foundational to advanced. "
        "Return valid JSON only."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.5,
        )
        result = _json.loads(response.choices[0].message.content)
        concepts = result.get("concepts", [])
        return {
            "course_code": course_code,
            "course_name": course_name,
            "concepts": concepts,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all-weaknesses/{student_id}")
async def get_all_weaknesses(student_id: str):
    """
    Aggregate weak concepts for a student across every subject tracked in the
    engine's mastery store.  Used by the Precision Practice widget to surface
    cross-subject weaknesses without the caller needing to know which subjects
    the student is enrolled in.

    Returns a list of subjects with their flagged/weak concepts, each annotated
    with difficulty, mastery, and estimated study time.
    """
    from engine_state import get_shared_engine
    from bridge import load_exam_weights, load_curriculum_meta, mastery_to_concepts_payload

    try:
        engine, _ = get_shared_engine()

        # Discover all subjects this student has data for
        subjects_seen = {subj for (sid, subj) in engine._store.keys() if sid == student_id}

        if not subjects_seen:
            return {"student_id": student_id, "subjects": [], "total_weak_concepts": 0}

        exam_weights = load_exam_weights()
        curriculum_meta = load_curriculum_meta()

        result_subjects: List[Dict[str, Any]] = []
        total_weak = 0

        for subject in sorted(subjects_seen):
            state = engine.get_mastery_state(student_id, subject, apply_decay=True)
            concepts = mastery_to_concepts_payload(state, exam_weights, curriculum_meta)

            weak: List[Dict[str, Any]] = []
            for c in concepts:
                mastery = float(c.get("mastery", 0.0))
                if mastery >= 0.6:
                    continue
                difficulty = c.get("difficulty", "medium")
                weak.append({
                    "id": c["id"],
                    "name": c["name"],
                    "mastery": round(mastery, 3),
                    "mastery_pct": round(mastery * 100),
                    "difficulty": difficulty,
                    "exam_weightage": round(float(c.get("exam_weightage", 0.1)), 3),
                    "study_time_minutes": _STUDY_TIME.get(difficulty, 35),
                    "last_practiced_at": c.get("last_practiced_at"),
                })

            weak.sort(key=lambda x: (x["mastery"], -x["exam_weightage"]))
            total_weak += len(weak)

            result_subjects.append({
                "subject": subject,
                "subject_display": subject.replace("_", " ").title(),
                "weak_concepts": weak,
                "weak_count": len(weak),
            })

        return {
            "student_id": student_id,
            "subjects": result_subjects,
            "total_weak_concepts": total_weak,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Wildcard route last ────────────────────────────────────────────────────────

@router.get("/{student_id}/{subject}")
async def get_course_analytics(student_id: str, subject: str):
    from engine_state import get_shared_engine
    from bridge import mastery_to_concepts_payload, load_exam_weights, load_curriculum_meta

    try:
        engine, _ = get_shared_engine()

        exam_weights = load_exam_weights()
        curriculum_meta = load_curriculum_meta()

        state = engine.get_mastery_state(student_id, subject)
        concepts = mastery_to_concepts_payload(
            state,
            exam_weights=exam_weights,
            curriculum_meta=curriculum_meta,
        )

        priorities = engine.get_priority_ranking(
            student_id,
            subject,
            exam_weights,
            days_until_exam=14,
        )

        scores = engine.predict_exam_score(student_id, subject, exam_weights)

        weak_concepts = []
        flagged_concepts = []
        roadmap = []

        for c in concepts:
            mastery = float(c.get("mastery", 0.0))
            difficulty = c.get("difficulty", "medium")
            item = {
                "id": c["id"],
                "name": c["name"],
                "mastery": mastery,
                "difficulty": difficulty,
                "exam_weightage": c.get("exam_weightage", 1.0),
                "prerequisites": c.get("prerequisites", []),
                "last_practiced_at": c.get("last_practiced_at"),
                "study_time_minutes": _STUDY_TIME.get(difficulty, 35),
            }

            if mastery < 0.5:
                weak_concepts.append(item)

            if mastery < 0.4:
                flagged_concepts.append(item)

        for i, p in enumerate(priorities, 1):
            roadmap.append({
                "rank": i,
                "concept_id": p.concept_id,
                "score": round(float(p.score), 3),
                "mastery": round(float(p.mastery), 3),
                "forgetting_risk": round(float(p.forgetting_risk), 3),
            })

        readiness_score = round(state.overall_mastery() * 100)

        quick_insights = []
        if weak_concepts:
            weakest = sorted(weak_concepts, key=lambda x: x["mastery"])[:3]
            quick_insights.append(
                "Weakest areas: " + ", ".join(w["name"] for w in weakest)
            )
        if roadmap:
            quick_insights.append(
                f"Start with {roadmap[0]['concept_id']} for maximum score gain."
            )
        if not weak_concepts:
            quick_insights.append("No major weak concepts detected right now.")

        return {
            "readiness_score": readiness_score,
            "predicted_score": scores.get("current_pace", 0),
            "recommended_score": scores.get("recommended_plan", 0),
            "requires_attention": len(flagged_concepts),
            "weak_concepts": weak_concepts,
            "flagged_concepts": flagged_concepts,
            "roadmap": roadmap,
            "concepts": concepts,
            "quick_insights": quick_insights,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
