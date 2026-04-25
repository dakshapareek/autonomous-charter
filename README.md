# 🛡️ TPM Co-Pilot — Autonomous Program Charter Generator

An AI-powered agentic web application that automates the **Program Chartering** phase of enterprise projects by orchestrating three adversarial AI agents — a **Sceptic**, a **Historian**, and a **Mediator** — that debate a project goal before generating a structured Program Charter.

> Built for **MSIS 549 — AI Application Development**

📺 **[Demo Video](https://drive.google.com/file/d/1KZ4u4GMMN39DwIQlNnbFvl27XHOeioAP/view?usp=sharing)** &nbsp;|&nbsp; 🧠 **Powered by Google Gemini 1.5 Flash**

---

## 🎯 The Problem

Technical Program Managers spend the first **2–4 weeks** of every new project in what practitioners call *"discovery hell"* — chasing stakeholders, identifying risks, and negotiating scope. This manual process is:

- **Slow** — bottlenecked by calendar availability
- **Optimism-biased** — risks get minimized to secure approval
- **Forgetful** — past lessons are buried in shared drives, never consulted

A naive *"write me a charter"* prompt to an LLM fails because models default to being *helpful* rather than *critical*. Realistic planning requires **friction**.

---

## 💡 The Solution: Adversarial Multi-Agent Architecture

Instead of one helpful assistant, the TPM Co-Pilot models a real-world **Architecture Review Board** — three specialized agents that argue before agreeing.

| Agent | Role | Behavior |
|---|---|---|
| 🚨 **The Sceptic** | Chief Risk Officer | Identifies "Kill Criteria" — budget, legal, technical reasons the project will fail. Offers no solutions. |
| 📚 **The Historian** | Pattern Analyst | Surfaces comparable past projects and failure modes from industry precedent. |
| ⚖️ **The Mediator** | Senior Program Manager | Synthesizes both prior outputs into a Negotiated Agreement and structured Program Charter. |

The Mediator receives the Sceptic's risk log and the Historian's case studies as **injected context**, forcing the final charter to address adversarial input rather than ignore it.

---

## 🏗️ System Architecture

```
┌─────────────────┐
│  User Input     │  Project goal entered in Streamlit UI
│  (Streamlit)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Orchestration   │  Validates API key, selects active Gemini model,
│ Layer (Python)  │  dispatches three sequential API calls
└────────┬────────┘
         │
         ├──► Call 1: Sceptic    ──► Risk log
         ├──► Call 2: Historian  ──► Case studies
         └──► Call 3: Mediator   ──► Receives outputs of Calls 1 & 2
                                     as context, produces final charter
         │
         ▼
┌─────────────────┐
│  Presentation   │  Three-column agent panel + structured charter
│  Layer          │  (Scope • Risks • Mitigations • Milestones • KPIs)
└─────────────────┘
```

---

## ✨ Key Features

- **Adversarial debate** — three distinct AI personas with conflicting incentives
- **Context injection** — Mediator reasons over Sceptic + Historian outputs, not just the original goal
- **Dynamic model selection** — queries the Gemini API at runtime to populate a model dropdown (no hardcoded model names)
- **Graceful rate-limit handling** — `try/except` around all API calls; 429 errors surface as friendly warnings instead of crashes
- **Structured charter output** — Scope Definition, Key Risks, Mitigation Strategies, Timeline with Milestones, Success Criteria

---

## 🔧 Tech Stack

| Component | Technology | Why |
|---|---|---|
| Language | Python 3.12 | Industry standard for AI/ML |
| Frontend | Streamlit | Rapid UI prototyping with minimal boilerplate |
| LLM Provider | Google Generative AI | 1M-token context window, generous free tier |
| Model | `gemini-1.5-flash` | Low latency and cost — critical for 3 sequential calls |
| IDE | Kiro (AI-powered) | Accelerated prompt engineering and the OpenAI→Gemini migration |

---

## 📊 Evaluation Results

The system was scored against a **single-prompt baseline** (same goal, no multi-agent orchestration) on a 1–5 rubric across two test cases.

### Test Case 1 — *"Launch a mobile fitness app for college students in 3 months with a $5,000 budget"*

| Metric | Single LLM | TPM Co-Pilot |
|---|---|---|
| Risk Coverage | 2/5 (generic) | **5/5** |
| Specificity | 2/5 | **5/5** |
| Feasibility Check | 1/5 (agreed to $5K) | **5/5** |
| Actionability | 2/5 (vague) | **5/5** |
| Hallucination Rate | High | **Low** |

The Sceptic surfaced **7 specific risks**. The Mediator refused to fabricate a viable path, instead proposing a structured pivot: single core feature, Android-only, low-code stack (FlutterFlow + Firebase), grassroots campus marketing, with a $500 contingency reserve.

### Test Case 2 — *"Replace Customer Support with AI Chatbot in 2 weeks"*

The Sceptic flagged **6 kill criteria** including GDPR/CCPA exposure and CRM integration risk. The Historian cited the Air Canada chatbot liability case and banking sector rollout timelines (3–6 months for limited scope, 12–24 months for full integration). The Mediator recalibrated the goal to a **2-week phased pilot** of 3–5 well-defined FAQ types with mandatory human fallback.

**Headline finding:** the adversarial design consistently identified **5–7 specific risks per scenario** vs. **1–2 generic risks** from the single-prompt baseline.

---

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- A Google Generative AI API key — [get one here](https://makersuite.google.com/app/apikey)

### Setup

```bash
# Clone the repo
git clone https://github.com/dakshapareek/autonomous-charter.git
cd autonomous-charter

# Install dependencies
pip install -r requirements.txt

# Set your API key
cp .env.example .env
# Then edit .env and add: GOOGLE_API_KEY=your_key_here

# Run the app
streamlit run streamlit_app.py
```

The app will open at `http://localhost:8501`.

---

## ⚠️ Known Limitations

- **No internal context** — the Historian draws from pre-trained LLM knowledge, not verified internal retrospectives. Case studies are plausible but unverified.
- **Session amnesia** — refreshing the browser loses the generated charter (no persistence layer).
- **Sequential API calls** — three calls run in sequence, adding ~6–15s latency.
- **Free-form output** — agent outputs are enforced by prompting, not JSON schema, so formatting can vary across runs.
- **Free-tier rate limits** — rapid consecutive runs trigger 429 quota errors.

---

## 🗺️ Roadmap

| Phase | Feature | Impact |
|---|---|---|
| Phase 2 | **RAG integration** — upload internal PDFs; Historian searches and cites them | Eliminates hallucinated case studies |
| Phase 2 | **PDF export** via `fpdf` | Stakeholder distribution without copy-paste |
| Phase 3 | **Parallel agent execution** (async/await) | ~12s → ~4s generation time |
| Phase 3 | **Structured output via function calling** | Enforces JSON schema on charter |
| Phase 4 | **Auth & persistence** — login + saved charters per user | Team collaboration and history |

---

## 🧭 Ethical Considerations

- **Augmentation, not automation** — the tool is named *"Co-Pilot"* deliberately. The UI surfaces the Sceptic/Historian debate *before* revealing the Mediator's synthesis, forcing engagement with tension rather than skipping to the conclusion.
- **Bias in historical data** — the Historian may underrepresent projects from under-resourced teams or non-Western contexts. The Mediator prompt prioritizes objective constraints (budget, timeline, regulatory) over anecdotal precedent.
- **Privacy** — project goals are sent to Google's Gemini API. Future enterprise versions should support on-premise or private-cloud deployment.

---

## 📚 References

- [Google AI Studio & Gemini API](https://aistudio.google.com)
- [Streamlit Documentation](https://docs.streamlit.io)
- [Google GenerativeAI Python Library](https://github.com/google/generative-ai-python)
- [Kiro AI-Powered IDE](https://kiro.dev) — used for code generation, refactoring, and the OpenAI→Gemini migration

---

## 👤 Author

**Daksha Pareek** — built as coursework for *MSIS 549 — AI Application Development* under the guidance of **Prof. Leo**.

## 📝 AI Disclosure

Code was developed using **Kiro** (AI-powered IDE) for generation, refactoring, and debugging. The accompanying technical report was drafted with assistance from **Claude (Anthropic)** for structural organization and prose refinement. All architecture decisions, agent prompt design, evaluation rubric, and test case analysis are the author's independent work.
