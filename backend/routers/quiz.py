"""
Quiz router: generate kinesthetic quiz from a notebook and grade submissions.
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel

router = APIRouter(prefix="/quiz", tags=["quiz"])

SAMPLE_DIR = Path(__file__).parent.parent.parent / "bridge_data"

BASE_DIR = Path(__file__).resolve().parent.parent.parent / "bridge_data"
QUIZ_RESULTS_CSV = BASE_DIR / "quiz_results.csv"
def _get_openai_client():
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set")
    return OpenAI(api_key=api_key)


class GradeRequest(BaseModel):
    plan: dict[str, Any]
    completed_activity_ids: list[str]
    quiz_answers: dict[str, str]
    student_id: str = "student_01"
    subject: str = "computer_security"


@router.post("/{notebook_id}/generate")
async def generate_quiz(notebook_id: int):
    """
    Generate a kinesthetic learning plan (activities + quiz) from a notebook's content.
    Or return existing if already generated.
    """
    from sqlalchemy import select
    from backend.database import AsyncSessionLocal, Notebook, KinestheticPlan
    from backend.pdf_utils import extract_full_text
    from integration.kinesthetics import generate_kinesthetic_plan
    import json

    async with AsyncSessionLocal() as db:
        nb = await db.get(Notebook, notebook_id)
        if not nb:
            raise HTTPException(status_code=404, detail="Notebook not found")

        # Check if plan already exists
        existing = await db.execute(select(KinestheticPlan).where(KinestheticPlan.notebook_id == notebook_id))
        plan_record = existing.scalar_one_or_none()
        if plan_record:
            return json.loads(plan_record.plan_json)

    # Get text from source
    text = ""
    if nb.source_type == "article" and nb.source_ref:
        # For articles, try scraping the URL
        try:
            from backend.scraper import scrape_article
            text = scrape_article(nb.source_ref)
        except Exception:
            pass
    elif nb.source_ref:
        # For slides/PDFs
        pdf_path = SAMPLE_DIR / nb.source_ref
        if not pdf_path.exists():
            pdf_path = SAMPLE_DIR / Path(nb.source_ref).name
        if pdf_path.exists():
            text = extract_full_text(str(pdf_path))

    if not text.strip():
        # Fallback: use the stored note_blocks text
        from backend.database import NoteBlock
        from sqlalchemy import select as sel
        async with AsyncSessionLocal() as db:
            result = await db.execute(sel(NoteBlock).where(NoteBlock.notebook_id == notebook_id))
            blocks = result.scalars().all()
            parts = []
            for b in blocks:
                data = json.loads(b.block_json)
                if data.get("concept_box"):
                    cb = data["concept_box"]
                    parts.append(f"{cb.get('term', '')}: {cb.get('definition', '')}")
                if data.get("semantic_blocks"):
                    for sb in data["semantic_blocks"]:
                        parts.append(sb.get("text", ""))
            text = "\n".join(parts)

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract content for quiz generation")

    client = _get_openai_client()
    plan = generate_kinesthetic_plan(client, text)

    # Save generated plan to DB
    async with AsyncSessionLocal() as db:
        new_plan = KinestheticPlan(notebook_id=notebook_id, plan_json=json.dumps(plan))
        db.add(new_plan)
        await db.commit()

    return plan


# @router.post("/grade")
# async def grade_quiz(payload: GradeRequest = Body(...)):
#     """
#     Grade a completed quiz submission and return scores.
#     Also pushes topic mastery into the MasteryEngine so study schedules update.
#     """
#     from integration.kinesthetics import compute_kms
#     from integration.engine_state import get_shared_engine
#     from integration.bridge import grade_to_quiz_responses

#     result = compute_kms(
#         payload.plan,
#         payload.completed_activity_ids,
#         payload.quiz_answers,
#     )

#     # Push mastery update into the shared engine so the scheduler stays in sync
#     topic_mastery = result.get("topic_mastery", {})
#     if topic_mastery:
#         try:
#             engine, _ = get_shared_engine()
#             responses = grade_to_quiz_responses(
#                 topic_mastery, payload.student_id, payload.subject
#             )
#             engine.update_from_quiz(responses)
#         except Exception:
#             pass  # grading result still returned; engine update is best-effort

#     return result

@router.post("/grade")
async def grade_quiz(payload: GradeRequest = Body(...)):
    """
    Grade a completed quiz submission and return scores.
    Also pushes topic mastery into the MasteryEngine so study schedules update.
    Also saves detailed quiz results to CSV.
    """
    from integration.kinesthetics import compute_kms, compute_topic_mastery, save_quiz_results_to_csv
    from integration.engine_state import get_shared_engine
    from integration.bridge import grade_to_quiz_responses

    # 1. Compute scores
    result = compute_kms(
        payload.plan,
        payload.completed_activity_ids,
        payload.quiz_answers,
    )

    # 2. Compute concept-wise mastery
    topic_mastery = compute_topic_mastery(payload.plan, payload.quiz_answers)
    result["topic_mastery"] = topic_mastery

    # 3. Save detailed results to CSV (quiz_results.csv — per-question log)
    save_quiz_results_to_csv(
        plan=payload.plan,
        quiz_answers=payload.quiz_answers,
        csv_file=str(QUIZ_RESULTS_CSV),
        student_id=payload.student_id,
    )

    # 3b. Upsert aggregated mastery into topic_mastery.csv (real-time CSV sync)
    if topic_mastery:
        try:
            from integration.bridge import update_topic_mastery_csv
            update_topic_mastery_csv(
                student_id=payload.student_id,
                subject=payload.subject,
                mastery_updates=topic_mastery,
            )
        except Exception:
            pass  # non-fatal; quiz result is still returned

    # 4. Push mastery update into shared engine
    if topic_mastery:
        try:
            engine, _ = get_shared_engine()
            responses = grade_to_quiz_responses(
                topic_mastery, payload.student_id, payload.subject
            )
            engine.update_from_quiz(responses)
        except Exception:
            pass  # grading result still returned; engine update is best-effort

    return result

class ConceptQuestionsRequest(BaseModel):
    concept_name: str
    subject: str = "computer science"
    difficulty: str = "medium"


@router.post("/generate-concept-questions")
async def generate_concept_questions(payload: ConceptQuestionsRequest = Body(...)):
    """
    Generate 5 targeted MCQ questions for a specific concept using AI.
    Returns a JSON object with a 'questions' array, each item having:
      question, options (A/B/C/D), correct, explanation
    """
    client = _get_openai_client()

    system_prompt = (
        "You are an expert educator creating targeted quiz questions. "
        "Return a JSON object with a 'questions' array. "
        "Each question object must have exactly these fields: "
        "'question' (string), "
        "'options' (object with keys A, B, C, D as strings), "
        "'correct' (one of 'A','B','C','D'), "
        "'explanation' (brief string explaining why the answer is correct)."
    )
    user_prompt = (
        f"Create exactly 5 multiple-choice questions about '{payload.concept_name}' "
        f"in the context of {payload.subject}. "
        f"Difficulty: {payload.difficulty}. "
        "Focus on testing conceptual understanding and practical application. "
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
            temperature=0.7,
        )
        import json as _json
        result = _json.loads(response.choices[0].message.content)
        questions = result.get("questions", [])[:5]
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SessionEventPayload(BaseModel):
    student_id: str
    concept_id: str
    subject: str
    correct: bool
    response_time_seconds: float


class SessionEventsRequest(BaseModel):
    events: list[SessionEventPayload]


@router.post("/session-events")
async def record_session_events(payload: SessionEventsRequest = Body(...)):
    """
    Accept a batch of study-session events, update BKT mastery, and return
    cognitive-load stats so the frontend knows if the student needs a break.
    """
    import sys
    import os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "src"))
    from scheduler import CognitiveLoadTracker
    from scheduler.models import SessionEvent
    from integration.engine_state import get_shared_engine
    from integration.bridge import session_event_to_quiz_responses
    from datetime import datetime

    if not payload.events:
        raise HTTPException(status_code=422, detail="events list is empty")

    # Convert pydantic payloads -> scheduler SessionEvent dataclasses
    events = [
        SessionEvent(
            student_id=e.student_id,
            concept_id=e.concept_id,
            subject=e.subject,
            correct=e.correct,
            response_time_seconds=e.response_time_seconds,
            timestamp=datetime.now(),
        )
        for e in payload.events
    ]

    student_id = events[0].student_id

    # 1. Cognitive load tracking
    tracker = CognitiveLoadTracker(student_id=student_id)
    for ev in events:
        tracker.record_event(ev)
    stats = tracker.compute_stats()

    # 2. Update BKT mastery
    try:
        engine, _ = get_shared_engine()
        responses = session_event_to_quiz_responses(events)
        engine.update_from_quiz(responses)
    except Exception:
        pass  # stats still returned; engine update is best-effort

    return {
        "burnout_detected": stats.burnout_detected,
        "optimal_remaining_minutes": stats.optimal_remaining_minutes,
        "cognitive_efficiency": round(stats.cognitive_efficiency, 3),
        "accuracy_rate": round(stats.accuracy_rate, 3),
        "events_processed": len(events),
    }
