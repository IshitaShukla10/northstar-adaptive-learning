"""
VARK content generation router.
Generates Visual / Auditory / Reading / Kinesthetic learning content
using OpenAI GPT-4o with the course PDF as primary source material.
"""
from __future__ import annotations

import json
import logging
from pathlib import Path

from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.llm import MODEL, client

log = logging.getLogger(__name__)

router = APIRouter(prefix="/vark", tags=["vark"])

SAMPLE_DATA_DIR = Path(__file__).parent.parent.parent / "sample_data"


# ── PDF helper ─────────────────────────────────────────────────────────────

def _extract_pdf_text(filename: str, max_chars: int = 8000) -> str:
    """Extract plain text from a PDF in sample_data/. Returns '' on any error."""
    path = SAMPLE_DATA_DIR / filename
    if not path.exists():
        log.warning("PDF not found: %s", path)
        return ""
    try:
        import pypdf  # type: ignore
        reader = pypdf.PdfReader(str(path))
        pages = []
        for page in reader.pages:
            t = page.extract_text() or ""
            if t.strip():
                pages.append(t)
        full_text = "\n\n".join(pages)
        return full_text[:max_chars]
    except Exception as exc:
        log.warning("PDF extraction failed for %s: %s", filename, exc)
        return ""


# ── Request / Response models ───────────────────────────────────────────────

class VARKRequest(BaseModel):
    course_code: str
    course_name: str
    concept_name: str
    mode: str               # visual | auditory | reading | kinesthetic
    pdf_source: Optional[str] = None   # filename in sample_data/, e.g. "OOP-Workbook.pdf"


# ── Main endpoint ───────────────────────────────────────────────────────────

@router.post("/generate")
async def generate_vark_content(payload: VARKRequest):
    """
    Generate VARK learning content for a single concept using OpenAI + PDF context.
    Returns structured JSON whose schema varies by mode:
      visual       → { key_terms, extended, concept_connections }
      auditory     → { segments: [{title, text, question, options, correct, explanation}] }
      reading      → { lecture_html }
      kinesthetic  → { activities: [{type, title, prompt, options, correct, explanation}] }
    """
    pdf_text = ""
    if payload.pdf_source:
        pdf_text = _extract_pdf_text(payload.pdf_source, max_chars=7000)

    if payload.mode == "visual":
        return await _generate_visual(payload, pdf_text)
    elif payload.mode == "auditory":
        return await _generate_auditory(payload, pdf_text)
    elif payload.mode == "reading":
        return await _generate_reading(payload, pdf_text)
    elif payload.mode == "kinesthetic":
        return await _generate_kinesthetic(payload, pdf_text)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown mode: {payload.mode}")


# ── Visual ──────────────────────────────────────────────────────────────────

async def _generate_visual(p: VARKRequest, pdf_text: str) -> dict:
    pdf_block = (
        f"PDF / Lecture Content (use this as your PRIMARY source):\n---\n{pdf_text}\n---"
        if pdf_text
        else "No PDF attached — use your expert knowledge of the course material."
    )
    prompt = f"""You are an expert visual-learning curriculum designer creating comprehensive study notes for university students.

Course: {p.course_name} ({p.course_code})
Concept to cover: {p.concept_name}

{pdf_block}

Generate COMPREHENSIVE visual study notes. Be thorough — these are the student's primary reference.

Return ONLY valid JSON (no markdown, no code fences) with this EXACT structure:
{{
  "key_terms": [
    {{
      "term": "exact term from the material",
      "color": "one of: #4F46E5 | #10B981 | #F59E0B | #EC4899 | #8B5CF6 | #EF4444",
      "definition": "2-3 precise sentences. Include how the term appears in the PDF/lectures and a concrete example."
    }}
  ],
  "extended": "8-10 detailed paragraphs (500+ words). Structure as: (1) Core definition and context from the PDF, (2) Why this concept exists / problem it solves, (3) Detailed mechanics / how it works step-by-step, (4) Worked example directly from the PDF material, (5) Common exam mistakes and misconceptions, (6) Connection to other course topics, (7) Real-world application, (8) Key formulas or rules if applicable, (9) Exam-focused summary. Use newlines between paragraphs.",
  "concept_connections": [
    {{"name": "related concept", "relationship": "how they connect (e.g. prerequisite, builds on, contrasts with)"}}
  ]
}}

Requirements:
- key_terms: 5-6 terms, each color distinct, definitions drawn directly from the PDF
- extended: MINIMUM 500 words, covering every angle a student needs for the exam
- concept_connections: 3-5 connections to concepts in the same course
- All content must be specific to {p.course_name}, not generic"""

    resp = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=2500,
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)


# ── Auditory ────────────────────────────────────────────────────────────────

async def _generate_auditory(p: VARKRequest, pdf_text: str) -> dict:
    pdf_block = (
        f"PDF / Lecture Content (your PRIMARY source — reference specific examples and terminology):\n---\n{pdf_text}\n---"
        if pdf_text
        else "No PDF attached — use your expert knowledge of the course material."
    )
    prompt = f"""You are creating detailed AUDIO learning content for university students — think of an engaging, knowledgeable tutor explaining concepts out loud.

Course: {p.course_name} ({p.course_code})
Concept: {p.concept_name}

{pdf_block}

Create 3 audio learning segments. Each segment must be DETAILED and EXPLANATORY — not brief summaries.
The text field should read like a tutor speaking, with:
- Rich explanations (8-12 sentences per segment)
- Specific references to content from the PDF (actual examples, terminology, or problems)
- Analogies and real-world connections to aid understanding
- A progressive structure: Segment 1 = foundations, Segment 2 = mechanics/details, Segment 3 = application/advanced

Each segment ends with a comprehension check MCQ tied DIRECTLY to that segment's content.

Return ONLY valid JSON:
{{
  "segments": [
    {{
      "title": "Clear, specific title for this segment",
      "text": "8-12 sentences of rich, conversational explanation. Reference the PDF material. Use analogies. Walk through reasoning step by step. Explain WHY, not just WHAT. Make it engaging and thorough.",
      "question": "A specific comprehension question that can only be answered by someone who understood this segment",
      "options": [
        "Option A — plausible but wrong",
        "Option B — plausible but wrong",
        "Option C — correct answer",
        "Option D — common misconception"
      ],
      "correct": 2,
      "explanation": "2-3 sentences explaining why C is correct and why the others are wrong. Reference the segment content."
    }},
    {{...second segment, deeper...}},
    {{...third segment, application/advanced...}}
  ]
}}

IMPORTANT: The text fields must be long and detailed. Each should take 45-60 seconds to read aloud."""

    resp = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=3000,
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)


# ── Reading ─────────────────────────────────────────────────────────────────

async def _generate_reading(p: VARKRequest, pdf_text: str) -> dict:
    pdf_block = (
        f"PDF / Lecture Content (transform this into structured lecture notes):\n---\n{pdf_text}\n---"
        if pdf_text
        else "No PDF attached — use your expert knowledge of the course material."
    )
    prompt = f"""You are creating structured HTML lecture notes for a reading/writing learner.

Course: {p.course_name} ({p.course_code})
Concept: {p.concept_name}

{pdf_block}

Create comprehensive, well-organised HTML lecture notes based on the PDF content.

Requirements:
- Use <h3> for main sections, <h4> for subsections
- Use <ul> / <ol> for lists with meaningful content
- Include code examples inside <div class="vark-code-block"> tags (use actual code/pseudocode from the PDF where present)
- Reference specific content, examples, and terminology from the PDF material
- Include at minimum these sections: Overview, Core Concepts, Detailed Explanation, Examples from the Material, Key Rules & Formulas, Exam Tips
- Be comprehensive — this is the student's primary reading reference
- Highlight important terms with <strong> tags
- Add a "⚠️ Common Mistakes" section

Return ONLY valid JSON:
{{"lecture_html": "... complete HTML string with all sections ..."}}

The HTML should be detailed enough that a student reading it for the first time can understand the concept fully without any other resources."""

    resp = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=3000,
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)


# ── Kinesthetic ─────────────────────────────────────────────────────────────

async def _generate_kinesthetic(p: VARKRequest, pdf_text: str) -> dict:
    pdf_block = (
        f"PDF / Lecture Content (ALL activities must be DIRECTLY derived from this material):\n---\n{pdf_text}\n---"
        if pdf_text
        else "No PDF attached — use your expert knowledge of the course material."
    )
    prompt = f"""You are creating hands-on learning activities for university students. EVERY activity must be DIRECTLY tied to the specific content in the PDF/lectures — not generic.

Course: {p.course_name} ({p.course_code})
Concept: {p.concept_name}

{pdf_block}

Create exactly 4 activities. Each activity must reference SPECIFIC content from the PDF:
- Activity 1 (type: "mcq"): Test recall of a specific definition, rule, or fact directly from the PDF
- Activity 2 (type: "code_trace" or "fill_blank"): Use actual code, pseudocode, or examples from the PDF material
- Activity 3 (type: "scenario"): A realistic scenario using terminology and context from the course
- Activity 4 (type: "reflection"): Connect the concept to other topics from the course (set correct: -1)

Return ONLY valid JSON:
{{
  "activities": [
    {{
      "type": "mcq",
      "title": "Specific activity title (not generic)",
      "prompt": "Question that references specific content from the PDF — include actual examples, terms, or scenarios from the material. Make it clear this is about {p.concept_name} in the context of {p.course_name}.",
      "options": [
        "Option A — specific, plausible distractor",
        "Option B — correct answer (detailed)",
        "Option C — common misconception from this topic",
        "Option D — partially correct but missing key point"
      ],
      "correct": 1,
      "explanation": "2-3 sentences explaining the correct answer with reference to the PDF content. Why are the other options wrong?"
    }},
    {{
      "type": "code_trace",
      "title": "Trace/Apply from Course Material",
      "prompt": "Show actual code or a step-by-step problem based on examples in the PDF. Ask the student to trace it, identify output, or spot an error.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "..."
    }},
    {{
      "type": "scenario",
      "title": "Real-World Application",
      "prompt": "A realistic scenario from professional practice that directly involves {p.concept_name}. Use terminology from the course. Ask what the correct approach is.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 2,
      "explanation": "..."
    }},
    {{
      "type": "reflection",
      "title": "Connect the Dots",
      "prompt": "How does {p.concept_name} connect to the other topics you have studied in {p.course_name}? What would break if this concept didn't exist?",
      "options": [
        "I can see clear connections to multiple other course topics",
        "I understand this concept in isolation but struggle to connect it",
        "I need to revisit this before I can see the connections",
        "I'm not sure how this fits into the bigger picture"
      ],
      "correct": -1,
      "explanation": "Self-reflection: connecting concepts shows deep understanding beyond memorisation. If you chose option 2 or 3, revisit how {p.concept_name} relates to prerequisite topics in {p.course_name}."
    }}
  ]
}}

CRITICAL: The prompts must be SPECIFIC to the PDF content, not generic placeholders."""

    resp = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=2500,
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)
