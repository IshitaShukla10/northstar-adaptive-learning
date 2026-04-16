"""
engine_state.py — module-level singleton for KnowledgeGraph + MasteryEngine.

Import get_shared_engine() anywhere in the process to get the same engine
instance, preserving student mastery state across HTTP requests.

Usage:
    from engine_state import get_shared_engine
    engine, kg = get_shared_engine()
"""
from __future__ import annotations

import csv
import logging
import os
import sys
from typing import Optional

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "src"))

from learning_model import MasteryEngine  # type: ignore

_engine: Optional[MasteryEngine] = None
_kg = None
_logger = logging.getLogger(__name__)


def _seed_engine_from_csv(engine: MasteryEngine) -> None:
    """
    Pre-populate the MasteryEngine from bridge_data CSVs so that the
    research/population-insights and mastery endpoints return real data
    immediately on first boot (cold-start fix).

    Two passes:
      1. topic_mastery.csv  — bulk mastery snapshot per (student, concept)
      2. session_events.csv — granular per-attempt BKT updates (more accurate)

    Errors are swallowed so a missing/malformed CSV never prevents startup.
    """
    base = os.path.dirname(os.path.abspath(__file__))

    # ── Pass 1: topic_mastery.csv ──────────────────────────────────────────
    mastery_path = os.path.join(base, "bridge_data", "topic_mastery.csv")
    if os.path.exists(mastery_path):
        try:
            from bridge import grade_to_quiz_responses

            # Collect unique (student_id, subject) pairs
            student_subjects: dict[tuple[str, str], dict[str, float]] = {}
            with open(mastery_path, newline="", encoding="utf-8") as f:
                for row in csv.DictReader(f):
                    key = (row["student_id"].strip(), row["subject"].strip())
                    student_subjects.setdefault(key, {})[
                        row["concept_id"].strip()
                    ] = float(row["mastery_score"])

            for (student_id, subject), mastery_map in student_subjects.items():
                responses = grade_to_quiz_responses(mastery_map, student_id, subject)
                if responses:
                    engine.update_from_quiz(responses)

            _logger.info(
                "engine_state: seeded %d student-subject pairs from topic_mastery.csv",
                len(student_subjects),
            )
        except Exception as exc:
            _logger.warning("engine_state: topic_mastery seed skipped — %s", exc)

    # ── Pass 2: session_events.csv (finer-grained BKT signal) ─────────────
    events_path = os.path.join(base, "bridge_data", "session_events.csv")
    if os.path.exists(events_path):
        try:
            from bridge import load_session_events, session_event_to_quiz_responses

            events = load_session_events(path="bridge_data/session_events.csv")
            responses = session_event_to_quiz_responses(events)
            if responses:
                engine.update_from_quiz(responses)
            _logger.info(
                "engine_state: replayed %d session events from session_events.csv",
                len(responses),
            )
        except Exception as exc:
            _logger.warning("engine_state: session_events seed skipped — %s", exc)


def get_shared_engine() -> tuple[MasteryEngine, object]:
    """Return the process-level MasteryEngine + KnowledgeGraph singleton.

    Creates them on first call by loading bridge_data/curriculum_meta.csv,
    then seeds historical mastery data from the bridge_data CSVs so that
    population-insight endpoints work immediately (cold-start fix).

    Subsequent calls return the cached instances (preserving all mastery state).
    """
    global _engine, _kg
    if _engine is None or _kg is None:
        from bridge import build_knowledge_graph

        _kg = build_knowledge_graph()

        _engine = MasteryEngine(
            knowledge_graph=_kg,
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            openai_model="gpt-4o-mini",
        )

        # Warm the engine with existing CSV data so research endpoints
        # have real population data from the very first request.
        _seed_engine_from_csv(_engine)

    return _engine, _kg
