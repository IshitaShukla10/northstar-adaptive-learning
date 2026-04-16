"""
Chat router: context-aware Q&A over a notebook's note blocks.
"""
from __future__ import annotations

import json
from typing import Any
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import NoteBlock, Notebook, get_db
from backend.llm import MODEL, client

router = APIRouter(prefix="/chat", tags=["chat"])

CHAT_SYSTEM = (
    "You are a concise visual-learning tutor. Keep ALL answers SHORT — max 4-5 sentences or 4 bullet points. "
    "Prefer bullet points over paragraphs. Use bold for key terms. "
    "If you need to explain a process, use numbered steps. "
    "Never write walls of text. If the question has a yes/no answer, give it first then explain briefly. "
    "You have context from the student's AI study notes — use it to give specific, grounded answers."
)


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    notebook_id: Optional[int] = None
    course_id: Optional[int] = None   # if set, context spans all course notebooks
    messages: list[ChatMessage]    # conversation history


class ChatResponse(BaseModel):
    reply: str


@router.post("/", response_model=ChatResponse)
async def chat(payload: ChatRequest, db: AsyncSession = Depends(get_db)):
    # Build context from note blocks
    context_blocks: list[str] = []

    if payload.notebook_id:
        result = await db.execute(
            select(NoteBlock)
            .where(NoteBlock.notebook_id == payload.notebook_id)
            .order_by(NoteBlock.page_num)
        )
        blocks = result.scalars().all()
        for b in blocks[:10]:  # cap at 10 slides to stay within token budget
            try:
                d = json.loads(b.block_json)
                cb = d.get("concept_box", {})
                if cb:
                    context_blocks.append(
                        f"[Slide {b.page_num}] {cb.get('term', '')}: {cb.get('definition', '')}. "
                        f"Intuition: {cb.get('intuition', '')}."
                    )
                for sb in (d.get("semantic_blocks") or [])[:3]:
                    context_blocks.append(f"  • [{sb.get('tag')}] {sb.get('text', '')}")
            except Exception:
                pass

    elif payload.course_id:
        from backend.database import Notebook as NB
        nb_result = await db.execute(
            select(NB).where(
                NB.course_id == payload.course_id,
                NB.source_type.in_(["slides", "article"])
            ).order_by(NB.section_order, NB.id)
        )
        for nb in nb_result.scalars().all():
            blocks_result = await db.execute(
                select(NoteBlock).where(NoteBlock.notebook_id == nb.id)
                .order_by(NoteBlock.page_num).limit(5)
            )
            for b in blocks_result.scalars().all():
                try:
                    d = json.loads(b.block_json)
                    cb = d.get("concept_box", {})
                    if cb:
                        context_blocks.append(
                            f"[{nb.title} – Slide {b.page_num}] {cb.get('term', '')}: {cb.get('definition', '')}"
                        )
                except Exception:
                    pass

    context_str = "\n".join(context_blocks[:40]) if context_blocks else "No specific context loaded."

    system_msg = f"{CHAT_SYSTEM}\n\n--- COURSE NOTES CONTEXT ---\n{context_str}\n---"

    messages = [{"role": "system", "content": system_msg}]
    for m in payload.messages[-12:]:  # keep last 12 turns
        messages.append({"role": m.role, "content": m.content})

    response = await client.chat.completions.create(
        model=MODEL,
        messages=messages,  # type: ignore
        temperature=0.4,
        max_tokens=800,
    )

    return ChatResponse(reply=response.choices[0].message.content or "")


# ── Study Coach ────────────────────────────────────────────────────────────────

COACH_SYSTEM = """\
You are NorthStar, Sarah's personal AI study coach. You feel like a knowledgeable, caring friend who happens to have a PhD — not a corporate assistant or a textbook.

PERSONALITY & TONE
- Warm, direct, and genuinely encouraging. You believe in Sarah.
- Use her name occasionally (not every message — that gets weird).
- Sound human: contractions, "let's", "you've got this", occasional emoji ✨ where natural.
- Notice emotional cues: if she sounds stressed or defeated, acknowledge it with empathy FIRST, then advise.
- Celebrate real progress ("your SC2002 mastery jumped — that work is paying off!").

WHAT YOU ALWAYS KNOW (live data is provided below every message)
- Sarah's exact mastery % for every concept in every course.
- Which concepts she hasn't practiced recently (forgetting risk — call these out by name).
- Concepts she may be avoiding: low mastery + not practiced in 14+ days.
- Quick-win concepts: 55–75% mastery that need just one focused session.
- Her strongest areas (acknowledge these to build confidence).
- Priority scores: low mastery × high exam weight × forgetting factor.

HOW TO STRUCTURE RESPONSES
- "What should I study?" → Give a ranked list (1. 2. 3.) with concept name, course, mastery %, and WHY it's urgent. End with one motivating sentence.
- "How am I doing?" → Give an honest, balanced picture: one genuine strength + one clear gap + one actionable step.
- "How ready am I?" → Give exact percentages per course and a predicted grade. Be honest but encouraging.
- "I'm struggling with X" → Acknowledge the difficulty, explain WHY it's hard (prerequisites?), give 2 specific study actions.
- Vague/open question → Ask one focused follow-up OR give a quick insight from the data.
- Stressed/overwhelmed → One sentence of empathy, then ONE thing to do right now (not a list).

RULES
- ALWAYS reference actual course codes (SC3010, SC2002, etc.) and concept names from the data. Never be generic.
- Use **bold** for concept names and course codes.
- Use numbered lists for ranked recommendations. Use bullet points for options/tips.
- Max 120 words per response — quality over quantity.
- NEVER say "I don't have access to your data" — you always have it.
- NEVER be preachy, condescending, or write walls of text.
- End responses with brief encouragement unless the student's message is already positive/confident.
"""


class StudyCoachRequest(BaseModel):
    student_id: str = "stu_001"
    subject: str = "all_courses"
    message: str
    history: List[ChatMessage] = []
    mastery_context: Optional[str] = None   # live mastery snapshot from frontend


@router.post("/study-coach", response_model=ChatResponse)
async def study_coach(payload: StudyCoachRequest):
    """AI Study Coach: answers student questions using live mastery data from frontend."""

    # Priority 1: use mastery_context sent directly from the frontend dashboard
    if payload.mastery_context and payload.mastery_context.strip():
        context_str = payload.mastery_context.strip()
    else:
        # Fallback: try the BKT engine (may be cold / empty)
        context_lines: list[str] = []
        try:
            from integration.engine_state import get_shared_engine
            engine = get_shared_engine()
            mastery_state = engine.get_mastery_state(payload.student_id, payload.subject)
            weak = engine.get_weak_concepts(payload.student_id, payload.subject)
            if mastery_state and hasattr(mastery_state, "concepts"):
                sorted_concepts = sorted(mastery_state.concepts.items(), key=lambda x: x[1])
                context_lines.append(f"Subject: {payload.subject}")
                for concept, mastery in sorted_concepts[:8]:
                    bar = "▓" * int(mastery * 10) + "░" * (10 - int(mastery * 10))
                    context_lines.append(f"  {concept}: {bar} {mastery:.0%}")
                if weak:
                    context_lines.append(f"Weak concepts: {', '.join(weak[:6])}")
            else:
                context_lines.append("Engine not yet initialised — advise based on general best practices.")
        except Exception as exc:
            context_lines.append(f"Engine unavailable: {exc}")
        context_str = "\n".join(context_lines)

    system_msg = f"{COACH_SYSTEM}\n\n--- LIVE MASTERY DATA ---\n{context_str}\n---"

    messages: list[dict] = [{"role": "system", "content": system_msg}]
    for m in payload.history[-8:]:
        messages.append({"role": m.role, "content": m.content})
    messages.append({"role": "user", "content": payload.message})

    response = await client.chat.completions.create(
        model=MODEL,
        messages=messages,  # type: ignore
        temperature=0.7,     # warmer, more natural conversational tone
        max_tokens=350,      # keeps replies tight — coach, not essay
        presence_penalty=0.3,  # discourages repetitive phrasing
    )
    return ChatResponse(reply=response.choices[0].message.content or "")
