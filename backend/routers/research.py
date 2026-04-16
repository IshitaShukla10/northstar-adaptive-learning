"""
Research population-insights router — the "societal" workflow of ALaaS.

Every student interaction with the platform contributes anonymized data to
a population-level research dataset.  This router exposes that aggregate
view so educators, curriculum designers, and ed-tech researchers can see:

  - Which concepts are hardest across the full student population
  - Average mastery trajectories per subject
  - Prerequisite bottlenecks: concepts whose weaknesses cascade (X fails
    because prerequisite Y was never mastered)
  - Concept co-failure patterns: pairs of concepts that are systematically
    failed together, suggesting hidden curriculum dependencies

This is the second utility of the "two birds, one stone" dual-utility design:
  Workflow 1 (commercial): individual students receive personalised study plans
  Workflow 2 (research):   aggregate, anonymised data surfaces curriculum
                           bottlenecks that benefit the broader research community

All data returned here is aggregated and anonymised — no student_id is exposed.
"""

from __future__ import annotations

import os
import sys
from collections import defaultdict
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "src"))

router = APIRouter(prefix="/research", tags=["research-insights"])


def _get_engine_store() -> Dict:
    """
    Pull the raw in-memory mastery store from the shared MasteryEngine.
    Returns dict keyed by (student_id, subject) -> MasteryState.
    Raises HTTPException 503 if engine is not yet initialised.
    """
    try:
        from integration.engine_state import get_shared_engine
        engine, _ = get_shared_engine()
        return engine._store
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Engine not ready: {exc}")


# ---------------------------------------------------------------------------
# GET /research/population-insights
# ---------------------------------------------------------------------------

@router.get("/population-insights")
async def population_insights(subject: Optional[str] = None) -> Dict[str, Any]:
    """
    Aggregate anonymised mastery data across all students to surface
    curriculum-level bottlenecks and difficulty patterns.

    Query params:
        subject  (optional) — filter to one subject, e.g. "computer_security"

    Returns:
        concept_difficulty_ranking  — concepts ordered by average population weakness
        prerequisite_bottlenecks    — concepts whose weakness co-occurs most with
                                      students who have weak prerequisites
        co_failure_pairs            — concept pairs that are weak together (top 10)
        population_summary          — high-level stats (num_students, subjects, etc.)
    """
    store = _get_engine_store()

    if not store:
        return {
            "concept_difficulty_ranking": [],
            "prerequisite_bottlenecks": [],
            "co_failure_pairs": [],
            "population_summary": {
                "num_students": 0,
                "num_subjects": 0,
                "message": "No student data yet — population insights populate as students use the platform."
            }
        }

    # ── Aggregate mastery scores per concept (anonymised) ──────────────────
    concept_scores: Dict[str, List[float]] = defaultdict(list)
    concept_attempts: Dict[str, int] = defaultdict(int)
    subject_student_sets: Dict[str, set] = defaultdict(set)

    for (student_id, subj), state in store.items():
        if subject and subj != subject:
            continue
        subject_student_sets[subj].add(student_id)
        for concept_id, cm in state.concepts.items():
            concept_scores[concept_id].append(cm.p_mastery)
            concept_attempts[concept_id] += cm.attempts

    if not concept_scores:
        return {
            "concept_difficulty_ranking": [],
            "prerequisite_bottlenecks": [],
            "co_failure_pairs": [],
            "population_summary": {
                "num_students": sum(len(s) for s in subject_student_sets.values()),
                "num_subjects": len(subject_student_sets),
                "filter_subject": subject,
                "message": "No concepts tracked for the selected subject yet."
            }
        }

    # ── 1. Concept difficulty ranking ─────────────────────────────────────
    # "difficulty" here means population-average mastery is LOW
    difficulty_ranking = []
    for concept_id, scores in concept_scores.items():
        avg_mastery = sum(scores) / len(scores)
        pct_struggling = sum(1 for s in scores if s < 0.6) / len(scores)
        difficulty_ranking.append({
            "concept_id": concept_id,
            "avg_mastery": round(avg_mastery, 3),
            "pct_students_struggling": round(pct_struggling * 100, 1),
            "num_students_tracked": len(scores),
            "total_attempts": concept_attempts[concept_id],
            "difficulty_tier": (
                "critical" if avg_mastery < 0.35 else
                "hard" if avg_mastery < 0.55 else
                "moderate" if avg_mastery < 0.75 else
                "well_mastered"
            )
        })
    difficulty_ranking.sort(key=lambda x: x["avg_mastery"])

    # ── 2. Prerequisite bottlenecks ────────────────────────────────────────
    # Identify concepts whose weakness strongly co-occurs with weak prerequisites.
    # We load curriculum metadata to know the prerequisite graph.
    try:
        from integration.bridge import load_curriculum_meta
        curriculum_meta = load_curriculum_meta()
    except Exception:
        curriculum_meta = {}

    bottlenecks = []
    concept_avg = {c["concept_id"]: c["avg_mastery"] for c in difficulty_ranking}

    for concept_id, meta in curriculum_meta.items():
        if subject:
            if meta.get("subject", "") != subject:
                continue
        prereqs = meta.get("prerequisites", [])
        if not prereqs:
            continue

        weak_prereq_count = sum(
            1 for p in prereqs
            if concept_avg.get(p, 1.0) < 0.55
        )
        if weak_prereq_count == 0:
            continue

        own_mastery = concept_avg.get(concept_id)
        if own_mastery is None:
            continue

        bottlenecks.append({
            "concept_id": concept_id,
            "concept_name": meta.get("name", concept_id),
            "avg_mastery": round(own_mastery, 3),
            "weak_prerequisites": [
                p for p in prereqs if concept_avg.get(p, 1.0) < 0.55
            ],
            "num_weak_prerequisites": weak_prereq_count,
            "cascade_risk": round(weak_prereq_count / max(1, len(prereqs)), 2),
        })
    bottlenecks.sort(key=lambda x: x["cascade_risk"], reverse=True)

    # ── 3. Co-failure pairs ────────────────────────────────────────────────
    # Concepts that tend to be weak together in the same student
    weak_sets: List[set] = []
    for (student_id, subj), state in store.items():
        if subject and subj != subject:
            continue
        weak = {cid for cid, cm in state.concepts.items() if cm.p_mastery < 0.6}
        if len(weak) >= 2:
            weak_sets.append(weak)

    pair_counts: Dict[tuple, int] = defaultdict(int)
    for ws in weak_sets:
        concepts_list = sorted(ws)
        for i in range(len(concepts_list)):
            for j in range(i + 1, len(concepts_list)):
                pair_counts[(concepts_list[i], concepts_list[j])] += 1

    co_failure_pairs = [
        {
            "concept_a": a,
            "concept_b": b,
            "co_occurrence_count": count,
            "insight": (
                f"Students who struggle with '{a}' also tend to struggle with '{b}'. "
                "Consider reviewing curriculum sequencing between these concepts."
            )
        }
        for (a, b), count in sorted(pair_counts.items(), key=lambda x: -x[1])[:10]
    ]

    # ── 4. Population summary ──────────────────────────────────────────────
    num_students = len({sid for (sid, _) in store.keys()
                        if not subject or any(s == subject for (si, s) in store.keys() if si == sid)})
    summary = {
        "num_students": num_students,
        "num_subjects": len(subject_student_sets),
        "subjects_tracked": sorted(subject_student_sets.keys()),
        "num_concepts_tracked": len(concept_scores),
        "filter_subject": subject,
        "data_note": (
            "All data is aggregated and anonymised. "
            "No individual student identifiers are included in this response."
        )
    }

    return {
        "concept_difficulty_ranking": difficulty_ranking,
        "prerequisite_bottlenecks": bottlenecks[:15],
        "co_failure_pairs": co_failure_pairs,
        "population_summary": summary,
    }


# ---------------------------------------------------------------------------
# GET /research/curriculum-health
# ---------------------------------------------------------------------------

@router.get("/curriculum-health")
async def curriculum_health(subject: Optional[str] = None) -> Dict[str, Any]:
    """
    Returns a single curriculum health score (0-100) and a breakdown by
    difficulty tier — useful for course coordinators to monitor how well
    the student cohort is tracking against exam requirements.

    Query params:
        subject  (optional) — filter to one subject
    """
    insights = await population_insights(subject=subject)
    ranking = insights["concept_difficulty_ranking"]

    if not ranking:
        return {
            "health_score": None,
            "tier_breakdown": {},
            "message": "No data yet — health score populates as students interact with the platform."
        }

    total = len(ranking)
    tiers: Dict[str, int] = defaultdict(int)
    for item in ranking:
        tiers[item["difficulty_tier"]] += 1

    avg_mastery = sum(r["avg_mastery"] for r in ranking) / total
    health_score = round(avg_mastery * 100, 1)

    tier_pct = {tier: round(100 * count / total, 1) for tier, count in tiers.items()}

    verdict = (
        "Critical — majority of concepts need urgent curriculum review." if health_score < 40 else
        "At risk — several concepts show population-wide difficulty." if health_score < 60 else
        "Fair — most concepts tracked but some bottlenecks remain." if health_score < 75 else
        "Healthy — cohort is tracking well against expected mastery."
    )

    return {
        "health_score": health_score,
        "verdict": verdict,
        "tier_breakdown": tier_pct,
        "avg_population_mastery": round(avg_mastery, 3),
        "concepts_evaluated": total,
        "subject": subject,
        "interpretation": {
            "critical": "avg mastery < 35% — fundamental teaching or sequencing issue",
            "hard": "avg mastery 35–55% — concept needs more practice scaffolding",
            "moderate": "avg mastery 55–75% — approaching target, light reinforcement needed",
            "well_mastered": "avg mastery > 75% — cohort has a strong grasp of this concept",
        }
    }
