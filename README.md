# NorthStar — Adaptive Learning Engine for Blackboard Study Mode

> **Microsoft Track Hackathon · Topic 8 (X-as-a-Service)**

NorthStar is an AI-driven adaptive learning engine designed to plug into any Learning Management System (LMS). It models each student's evolving knowledge state and outputs personalised study plans, priority rankings, and prescriptive coaching — all through a clean REST API.

This repo ships with a **mock of NTU Learn** (NTU's Blackboard instance) as the LMS front-end, so you can see the full end-to-end flow without needing a real Blackboard integration.

---

## How It Looks

```
NTU Learn (LMS mock)  ──── click the ★ star ────▶  NorthStar Study Dashboard
 index.html                                           study.html
 (course list)                                        (AI-powered study mode)
```

1. Open the app at `http://localhost:3000` — you land on the **NTU Learn** course list page.
2. Click the **star icon (★)** in the top-right header.
3. A cinematic transition takes you into **NorthStar** — the AI study dashboard.
4. From there: My Courses, AI Study Coach, Exam Readiness, VARK sessions, and Analytics.

---

## The Problem

Expert adaptive tutoring is expensive, slow, and inaccessible at scale. A human tutor who can:

- Track each student's evolving knowledge state across dozens of concepts
- Identify *why* a student is struggling (a prerequisite was never mastered)
- Predict which gaps will cost the most marks on the exam
- Generate a day-by-day study plan respecting forgetting curves

...costs $50–200/hour and cannot serve 500 students at once.

**NorthStar solves this.** The algorithmic core of expert tutoring — Bayesian knowledge-state modelling + prerequisite causal reasoning — exposed as a cloud API any LMS can call.

---

## Core Algorithms

| Algorithm | Formula | What It Does |
|-----------|---------|--------------|
| **Bayesian Knowledge Tracing** | Posterior update per quiz attempt | Models whether a student has latently mastered a concept |
| **Forgetting Curve** | `R(t) = e^(-t/S)`, S ∈ [1, 30] days | Predicts knowledge decay since last practice |
| **Priority Score** | `ExamWeight × (1 − Mastery) × ForgettingRisk` | Ranks which concept to study next |
| **Predicted Exam Score** | `Σ (ExamWeight × MasteryProbability)` | Forecasts current and recommended-plan score |
| **Causal Weakness Tracing** | Graph traversal on prerequisite DAG | Explains *why* a student is weak (root-cause prereqs) |

---

## Architecture

```
NorthStar
│
├── src/learning_model/         ← Core AI engine (BKT + graph + forgetting)
│   ├── bkt.py                     4-param Bayesian Knowledge Tracing
│   ├── knowledge_graph.py         networkx prerequisite DAG, causal tracing
│   ├── forgetting.py              Ebbinghaus decay model
│   └── mastery_engine.py          Main API — combines all of the above
│
├── src/scheduler/              ← Timetable engine
│   ├── timetable.py               14-day adaptive Pomodoro plan generator
│   └── cognitive_load.py          Burnout detection from session events
│
├── backend/                    ← FastAPI server (port 8000)
│   ├── routers/
│   │   ├── public_api.py          /api/v1/*  — versioned public LMS API
│   │   ├── research.py            /research/* — population-level analytics
│   │   ├── analytics.py           /analytics/* — per-student dashboard
│   │   ├── quiz.py                /quiz/* — generation & grading
│   │   ├── notebook.py            /notebooks/* — PDF → visual notes
│   │   ├── chat.py                /chat/* — RAG chatbot
│   │   ├── tutorial.py            /tutorial/* — solution flows
│   │   ├── audio.py               /audio/* — TTS generation
│   │   └── recall.py              /recall/* — free-recall grading
│   ├── main.py                    App setup, CORS, seed pipeline
│   ├── database.py                SQLAlchemy async ORM
│   ├── models.py                  Pydantic schemas
│   └── llm.py                     OpenAI client wrapper
│
├── frontend/                   ← Next.js app (port 3000)
│   ├── app/                       Pages (home, notebook, study, calendar…)
│   ├── components/                React components (ConceptMap, QuizPanel, ChatPanel…)
│   └── public/ntulearn/           NTU Learn mock UI (static HTML/JS/CSS)
│
├── ntulearn_clone/             ← Standalone NTU Learn mock (no Node needed)
│
├── bridge.py                   ← MasteryEngine ↔ analytics ↔ timetable transforms
├── engine_state.py             ← Singleton engine instance for HTTP requests
├── insights.py                 ← Weekly analytics report generator
├── kinesthetics.py             ← Kinesthetic activity planner
├── lecture.py                  ← PDF → lecture script → TTS audio
│
├── bridge_data/                ← CSV seed data (curriculum, mastery, quiz results)
├── sample_data/                ← Sample PDFs for demo
└── data/sample_curriculum.json ← Concept graph with prerequisites
```

---

## Dual-Workflow Design

Every student interaction generates value twice:

```
┌──────────────────────────────────────────────────────────┐
│  WORKFLOW A — Students & Institutions                    │
│                                                          │
│  POST /api/v1/mastery/update      ← quiz results        │
│  GET  /api/v1/mastery/{id}/priorities ← ranked plan     │
│  POST /api/v1/schedule/generate   ← Pomodoro timetable  │
│  GET  /api/v1/insights/{id}       ← AI coaching text    │
└───────────────────┬──────────────────────────────────────┘
                    │  same data, anonymised
                    ▼
┌──────────────────────────────────────────────────────────┐
│  WORKFLOW B — Educators & Curriculum Researchers         │
│                                                          │
│  GET /research/population-insights  ← concept difficulty │
│  GET /research/curriculum-health    ← health score       │
└──────────────────────────────────────────────────────────┘
```

---

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- An OpenAI API key (`sk-...`)

### 1. Clone and create the environment

```bash
git clone <repo-url>
cd dlw-2026-main

python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
OPENAI_API_KEY=sk-your-key-here
```

### 3. Start the backend (port 8000)

```bash
source .venv/bin/activate
uvicorn backend.main:app --reload --port 8000
```

On first boot, the server automatically seeds the database from `sample_data/` PDFs and `bridge_data/` CSVs. This takes **2–4 minutes**. Watch the console or poll:

```bash
curl http://localhost:8000/ready
# {"ready": true} when done
```

### 4. Start the frontend (port 3000)

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app

Go to **[http://localhost:3000](http://localhost:3000)**.

You'll land on the **NTU Learn** course list (the LMS mock). To enter NorthStar:

> Click the **★ star icon** in the top-right corner of the NTU Learn header.

A cinematic transition reveals the NorthStar AI study dashboard.

---

### Alternative: Run the NTU Learn mock standalone (no Node required)

If you just want to see the NTU Learn + NorthStar UI without the Next.js server:

```bash
cd ntulearn_clone
python3 -m http.server 8080
# Open http://localhost:8080
```

---

## API Reference

### Public API (LMS Integration)

Base URL: `http://localhost:8000`

#### Mastery

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/mastery/update` | Ingest quiz attempts, update BKT posteriors |
| GET | `/api/v1/mastery/{student_id}/{subject}` | Current mastery snapshot (forgetting applied) |
| GET | `/api/v1/mastery/{student_id}/{subject}/priorities` | Concepts ranked by study urgency |

#### Scheduling

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/schedule/generate` | Generate personalised Pomodoro weekly plan |

#### AI Coaching

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/insights/{student_id}/{subject}` | Prescriptive AI coaching text |
| GET | `/api/v1/service-info` | Service metadata + endpoint catalogue |

### Research API (Population Analytics)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/research/population-insights` | Concept difficulty, prerequisite cascade failures, co-failure pairs |
| GET | `/research/curriculum-health` | Single curriculum health score (0–100) + tier breakdown |

### Study Mode API (Visual Backend)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/ready` | Seed pipeline status — poll on first boot |
| GET | `/courses/` | List all courses |
| GET | `/notebooks/` | List all notebooks |
| GET | `/notebooks/{id}` | Notebook + all visual note blocks |
| GET | `/concept-map/{id}` | Concept nodes + edges |
| POST | `/concept-map/{id}/generate` | (Re)generate concept map |
| POST | `/quiz/{id}/generate` | Generate quiz for a notebook |
| POST | `/quiz/grade` | Grade quiz responses |
| POST | `/chat/` | Chat with notebook context (RAG) |
| GET | `/analytics/{student_id}/{subject}` | Full analytics dashboard data |
| POST | `/audio/{id}/generate` | Generate TTS audio for a notebook |

Full interactive docs at: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## Demos (run from project root)

These scripts exercise the core algorithms end-to-end without the web server:

```bash
source .venv/bin/activate

# 1. BKT mastery engine demo — simulates quiz sessions + priority ranking
python demo_learning_model.py

# 2. Scheduler demo — mastery state → 14-day Pomodoro timetable
python demo_scheduler.py

# 3. Full integration demo — quiz → mastery → analytics → schedule
python demo_integration.py
```

---

## NorthStar Dashboard Screens

| View | What It Shows |
|------|---------------|
| **My Courses** | Readiness score, predicted score, focus time, course progress cards with attention flags |
| **AI Study Coach** | GPT-4o powered chat loaded with live mastery context — ask anything about your studies |
| **Exam Readiness** | Predicted exam scores per course based on current mastery state |
| **Course Analytics** | Per-course deep dive: flagged concepts, prescriptive plan, mastery gauges |
| **VARK Session** | Visual / Auditory / Reading+Writing / Kinesthetic — personalised study mode |

---

## LMS Integration Guide

To wire NorthStar into a real Blackboard (or any LMS):

1. **After each quiz** — POST results to `/api/v1/mastery/update`:
   ```json
   {
     "student_id": "s1234",
     "subject": "computer_security",
     "responses": [
       { "concept_id": "buffer_overflow", "correct": true, "response_time_seconds": 45 }
     ]
   }
   ```

2. **To drive study recommendations** — GET priorities:
   ```
   GET /api/v1/mastery/s1234/computer_security/priorities?days_until_exam=14
   ```

3. **To generate a study schedule** — POST to schedule:
   ```
   POST /api/v1/schedule/generate
   ```

4. **For AI coaching text** — GET insights:
   ```
   GET /api/v1/insights/s1234/computer_security
   ```

5. **For curriculum research** — GET population data (no student ID needed):
   ```
   GET /research/population-insights?subject=computer_security
   ```

---

## Extending

### Add a new subject / curriculum

Edit `data/sample_curriculum.json` — add an object with `subject` and `concepts`. Each concept needs an `id`, `label`, and `prerequisites` list with edge `weight` values.

### Calibrate BKT parameters per subject

In `src/learning_model/bkt.py`, add an entry to `SUBJECT_PARAMS`:

```python
SUBJECT_PARAMS["your_subject"] = {
    "p_l0": 0.3,   # initial probability of mastery
    "p_t":  0.1,   # probability of learning from one attempt
    "p_s":  0.1,   # slip: P(wrong | mastered)
    "p_g":  0.2,   # guess: P(right | not mastered)
}
```

### Add a new PDF course

Drop the PDF into `sample_data/` and restart the backend. The seed pipeline will extract, chunk, and build visual note blocks automatically.

---

## Accessibility

- **Dyslexia Mode** — toggle in the top nav bar. Applies Arial font, wider letter/word spacing, increased line height. Persisted to `localStorage`.
- **Audio playback** — every notebook page can be read aloud via TTS. Click the audio icon in the notebook viewer.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | FastAPI (Python 3.11+), SQLAlchemy (async), Uvicorn |
| Database | SQLite (dev) via aiosqlite |
| AI / LLM | OpenAI API (GPT-4o-mini for notebooks, GPT-4o for coaching) |
| Core ML | Bayesian Knowledge Tracing, networkx graphs, NumPy |
| Frontend | Next.js 16 (TypeScript), React 19 |
| Visualisation | ReactFlow (concept maps), D3.js |
| LMS Mock | Vanilla HTML/CSS/JS (no framework) |

---

## Team

| Person | Module | Responsibility |
|--------|--------|----------------|
| Yajie | `src/learning_model/` | BKT engine, knowledge graph, forgetting curves, MasteryEngine API |
| Ishita | `ntulearn_clone/`, platform wiring | LMS UI, NorthStar dashboard, data pipeline integration |
| Chavi | `src/scheduler/` | Timetable + cognitive-load engine |
| Sia | `insights.py` | Weekly analytics report, predicted score simulation |
| P2 | VARK / Content | Visual notebooks, chatbot, kinesthetic activities |

---

## Troubleshooting

**Backend shows "seeding" for more than 5 minutes**
Check that your `OPENAI_API_KEY` in `.env` is valid and has quota. The seed pipeline makes LLM calls to generate note blocks.

**`ModuleNotFoundError` when starting the backend**
Run uvicorn from the project root (not from inside `backend/`):
```bash
# Correct ✓
uvicorn backend.main:app --reload --port 8000

# Wrong ✗
cd backend && uvicorn main:app
```

**Frontend shows blank page / can't connect**
Make sure the backend is running on port 8000 and has finished seeding (`/ready` returns `true`).

**NTU Learn mock doesn't redirect to NorthStar**
Serve the files over HTTP (not by opening index.html directly as a file). Either use the Next.js dev server (`npm run dev`) or `python3 -m http.server 8080` from inside `ntulearn_clone/`.
