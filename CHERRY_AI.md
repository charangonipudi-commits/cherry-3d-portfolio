# 🍒 Cherry AI — Website Assistant

Cherry AI is the built-in AI assistant for the Cherry 3D portfolio. A premium
floating button ("Ask Cherry AI") opens a glassmorphic chat window that
answers visitor questions about **services, pricing, projects, the App
Building Roadmap and contact options** — in English, Telugu or
Telugu-English mix.

Nothing about the existing website was changed — the assistant is a purely
additive layer (`src/components/cherry-ai/`, `src/lib/cherry-ai/`, `api/chat.ts`).

## Features

| Area | What it does |
| --- | --- |
| Floating button | Bottom-right, always visible while scrolling, lifts itself above the hero's contact button so nothing is covered, neon glow, glass, online dot, "Ask Cherry AI" tooltip. Never opens by itself. |
| Chat window | Desktop: rounded glass panel on the right. Mobile: full-screen sheet with safe-area padding. Header with robot avatar, "Cherry AI — AI Assistant • Online", minimize + close. |
| Replies | Typing indicator + typewriter reveal. Quick-question chips (Services, Website Price, App Price, My Projects, About Charan, How to Order?, Contact on WhatsApp). |
| Pricing cards | Website: ₹2,000 → **₹1,000** (50% OFF). App: ₹5,000 → **₹2,500** (50% OFF). Each card has an **Order Website / Order App** button that opens WhatsApp with a pre-filled message (site's real number only). |
| Languages | Understands English, Telugu script and Tenglish ("website price entha?", "app kavali", "website create chesthara?", "మీరు ఏ services చేస్తారు?") and replies in the same style. |
| Context | Follow-ups like "Can you add Firebase?" resolve against the last discussed product (from the spec example). |
| Unknown questions | Never invents facts — answers exactly: *"I don't have that information yet. Please contact Charan on WhatsApp for the exact details."* |

## How it works

```
Visitor message
   │
   ▼
POST /api/chat  (Vercel serverless function — api/chat.ts)
   │
   ├─ CHERRY_AI_API_KEY set?  → LLM (OpenAI-compatible) with the site
   │    knowledge as system prompt; reply post-processed for [card:*] tokens.
   │
   ├─ no key / LLM failure    → built-in offline engine
   │    (src/lib/cherry-ai/engine.ts — same module, runs server-side)
   │
   └─ endpoint unreachable (static hosting / npm run dev)
        → the client runs the same offline engine in the browser
```

So the assistant **always works** — with zero configuration — and becomes
LLM-powered automatically as soon as you add an API key on the server.

## Enabling the real AI (optional)

The LLM runs **only** server-side; the key never ships to the browser.

```bash
# local (.env.local — already git-ignored)
CHERRY_AI_API_KEY=sk-...
# optional overrides:
CHERRY_AI_API_URL=https://api.openai.com/v1/chat/completions
CHERRY_AI_MODEL=gpt-4o-mini

# production (Vercel)
vercel env add CHERRY_AI_API_KEY
vercel env add CHERRY_AI_API_URL   # optional
vercel env add CHERRY_AI_MODEL     # optional
vercel --prod
```

Any OpenAI-compatible provider works: OpenAI, Groq, OpenRouter, or Gemini's
OpenAI-compatible endpoint. See `.env.example`.

## Security

- **No secrets in frontend** — keys live in server env vars only; the client
  bundle contains just the public site knowledge.
- **Rate limiting** — 20 requests / 5 min / IP (tunable via
  `CHERRY_AI_RATE_MAX`), plus a client-side request timeout.
- **Prompt-injection hardening** — user input is length-capped, control-char
  stripped, and scrubbed for classic injection patterns; the system prompt
  instructs the model to treat visitor text as data and never reveal rules.
- **Privacy** — conversations are not logged or persisted server-side; the
  chat history lives only in the visitor's `sessionStorage` and is cleared
  when they close the chat.
- **Same-origin** — the endpoint sets no CORS headers, so browsers block
  cross-site use of the API.

## Local development

```bash
npm run dev        # assistant runs fully on the offline engine (no /api/chat needed)
vercel dev         # also runs the serverless function locally
```

## Customising

- **Content / pricing / WhatsApp number** — edit
  `src/lib/cherry-ai/knowledge.ts` (single source of truth for the engine
  *and* the LLM system prompt; the number is the one already used by the
  site: `wa.me/919951880181`).
- **Reply style & keywords** — `src/lib/cherry-ai/engine.ts`.
- **Look & feel** — `src/components/cherry-ai/cherry-ai.css` + component
  files; all classes are `cherry-` prefixed to avoid collisions.
