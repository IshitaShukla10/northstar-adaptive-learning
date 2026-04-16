"""
demo_integration.py — Full end-to-end integration demo.
Run from the project root: python scripts/demo_integration.py

Shows the complete study loop:
  1. Student completes kinesthetic activities   (Sia's /generate-kinesthetic + /grade-kinesthetic)
  2. topic_mastery scores fed back into MasteryEngine via bridge  (P1 ← P4)
  3. MasteryEngine outputs mastery state                          (P1)
  4. Bridge converts mastery → Sia's Concept payload              (bridge)
  5. generate_weekly_report() produces analytics + score forecast (P4)
"""

import os
import sys

# Add project root and src/ to path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)
sys.path.insert(0, os.path.join(ROOT_DIR, "src"))

from learning_model import MasteryEngine
from integration.bridge import (
    build_knowledge_graph,
    grade_to_quiz_responses,
    load_curriculum_meta,
    load_exam_weights,
    load_topic_mastery,
    mastery_to_concepts_payload,
)
from integration.insights import generate_weekly_report

# ─────────────────────────────────────────────────────────────────────────────
# 0. Setup
# ─────────────────────────────────────────────────────────────────────────────
print("=" * 65)
print("INTEGRATION DEMO — Learning Model + Analytics + Scheduler")
print("=" * 65)

kg = build_knowledge_graph()

engine = MasteryEngine(
    knowledge_graph=kg,
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    openai_model="gpt-4o-mini",
)

STUDENT = "stu_001"
SUBJECT = "computer_security"

exam_weights    = load_exam_weights()
curriculum_meta = load_curriculum_meta()

# ─────────────────────────────────────────────────────────────────────────────
# 1. Load Sia's topic mastery from CSV
# ─────────────────────────────────────────────────────────────────────────────
print("\n── Step 1: Topic mastery scores (loaded from topic_mastery.csv) ──")

topic_mastery_from_sia = load_topic_mastery(STUDENT, SUBJECT)

for concept, score in topic_mastery_from_sia.items():
    bar = "█" * int(score * 20)
    print(f"  {concept:<35} {score:.0%}  {bar}")

# ─────────────────────────────────────────────────────────────────────────────
# 2. Bridge: topic_mastery → QuizResponse → MasteryEngine
# ─────────────────────────────────────────────────────────────────────────────
print("\n── Step 2: Feeding kinesthetic results into MasteryEngine ──")

quiz_responses = grade_to_quiz_responses(topic_mastery_from_sia, STUDENT, SUBJECT)
engine.update_from_quiz(quiz_responses)
print(f"  Updated mastery engine with {len(quiz_responses)} responses.")

# ─────────────────────────────────────────────────────────────────────────────
# 3. Get updated mastery state (with forgetting decay)
# ─────────────────────────────────────────────────────────────────────────────
print("\n── Step 3: Mastery state after BKT update ──")

mastery_state = engine.get_mastery_state(STUDENT, SUBJECT)
print(f"  Overall mastery: {mastery_state.overall_mastery():.0%}")
print(f"  Concepts tracked: {len(mastery_state.concepts)}")
print()
for cid, cm in sorted(mastery_state.concepts.items(), key=lambda x: x[1].p_mastery):
    bar = "█" * int(cm.p_mastery * 20)
    flag = "  ← WEAK" if cm.p_mastery < 0.5 else ""
    print(f"  {cid:<35} p_mastery={cm.p_mastery:.3f}  {bar}{flag}")

# ─────────────────────────────────────────────────────────────────────────────
# 4. Bridge: MasteryState → Sia's Concept payload → Weekly report
# ─────────────────────────────────────────────────────────────────────────────
print("\n── Step 4: Generating weekly analytics report (Sia's engine) ──")

concepts_payload = mastery_to_concepts_payload(mastery_state, exam_weights, curriculum_meta)
weekly_report = generate_weekly_report(
    concepts_raw=concepts_payload,
    current_weekly_minutes=240,
)

score_model = weekly_report["predicted_score_model"]
print(f"  Base expected score:      {score_model['base_expected']}%")
print(f"  At current pace (240min): {score_model['simulation_current_pace']['expected_score']}%")
print(f"  With recommended plan:    {score_model['simulation_recommended_plan']['expected_score']}%")

print("\n  Top priority concepts:")
for c in weekly_report["priority_ranking"]["top_concepts"][:5]:
    print(
        f"    {c['concept_name']:<35} "
        f"mastery={c['mastery']:.0%}  "
        f"priority={c['priority_score']:.4f}  "
        f"forgetting_risk={c['forgetting_risk']:.0%}"
    )

print("\n  Prescriptive recommendations:")
for rec in weekly_report["prescriptive_analysis"]["recommendations"][:4]:
    print(f"    [{rec['action_type'].upper():8s}] {rec['concept_name']} — {rec['minutes']} min")
    print(f"             {rec['rationale']}")

# ─────────────────────────────────────────────────────────────────────────────
# 5. Simulate next quiz cycle (loop closes)
# ─────────────────────────────────────────────────────────────────────────────
print("\n── Step 5: After one study session — next quiz cycle ──")
print("  (simulating improved scores after studying buffer_overflow & reference_monitor)")

next_quiz_results = {
    "buffer_overflow":      0.62,
    "reference_monitor":    0.55,
    "integer_overflow":     0.51,
}

new_responses = grade_to_quiz_responses(next_quiz_results, STUDENT, SUBJECT)
engine.update_from_quiz(new_responses)

updated_state = engine.get_mastery_state(STUDENT, SUBJECT)
print(f"  Updated overall mastery: {updated_state.overall_mastery():.0%}  (was {mastery_state.overall_mastery():.0%})")
for cid in ["buffer_overflow", "reference_monitor", "integer_overflow"]:
    if cid in updated_state.concepts:
        print(f"  {cid:<35} new p_mastery = {updated_state.concepts[cid].p_mastery:.3f}")

print("\n" + "=" * 65)
print("Integration demo complete.")
print("=" * 65)
print()
print("API endpoint ready at:  POST /integrated-weekly")
print("Example curl:")
print("""  curl -s -X POST http://localhost:8000/integrated-weekly \\
    -H 'Content-Type: application/json' \\
    -d '{
      "student_id": "stu_001",
      "subject": "computer_security",
      "days_until_exam": 14,
      "current_weekly_minutes": 240
    }' | python -m json.tool""")
