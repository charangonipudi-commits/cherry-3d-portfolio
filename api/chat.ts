/**
 * Cherry AI — secure chat endpoint (Vercel Serverless Function).
 *
 * Security model:
 *  - All provider credentials live in environment variables
 *    (CHERRY_AI_API_KEY etc.) and NEVER reach the browser.
 *  - Basic in-memory rate limiting per IP (best effort per warm instance).
 *  - Input length caps, history caps and prompt-injection scrubbing.
 *  - No conversation content is logged or persisted; only anonymous
 *    request counters live in memory for the rate window.
 *  - Falls back to the same offline knowledge engine the client uses,
 *    so the endpoint answers even without an LLM configured.
 *
 * Environment variables (all optional):
 *  - CHERRY_AI_API_KEY    → enables the LLM (OpenAI-compatible API)
 *  - CHERRY_AI_API_URL    → default https://api.openai.com/v1/chat/completions
 *                           (works with Groq / OpenRouter / Gemini OpenAI-compat)
 *  - CHERRY_AI_MODEL      → default gpt-4o-mini
 *  - CHERRY_AI_RATE_MAX   → requests per IP per 5 minutes (default 20)
 */

import { runEngine } from '../src/lib/cherry-ai/engine.js';
import { buildSystemPrompt } from '../src/lib/cherry-ai/knowledge.js';
import type { CardPayload, HistoryTurn } from '../src/lib/cherry-ai/types';

interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

// Local fetch typing so the function compiles without DOM libs.
declare const fetch: (url: string, init?: Record<string, unknown>) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_TURNS = 12;
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX = Number(process.env.CHERRY_AI_RATE_MAX || 20);
const LLM_TIMEOUT_MS = 20_000;

/* ----------------------------- rate limiting ---------------------------- */

const rateHits = new Map<string, number[]>();

function allowRequest(ip: string): boolean {
  const now = Date.now();
  if (rateHits.size > 10_000) rateHits.clear(); // crude memory guard
  const recent = (rateHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    rateHits.set(ip, recent);
    return false;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  return true;
}

/* ----------------------------- sanitisation ----------------------------- */

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+|any\s+|the\s+|your\s+)?(previous|prior|above|earlier|initial)/gi,
  /disregard\s+(all\s+|any\s+|the\s+|your\s+)?(previous|prior|above|earlier)/gi,
  /(reveal|show|print|repeat|output|export)\s+(your|the|this|these)\s+(system\s+)?(prompt|instructions|rules)/gi,
  /you\s+are\s+now\s+(a|an|the)\s+/gi,
  /(developer|god|dan|admin)\s+mode/gi,
  /jailbreak/gi,
  /\bsystem\s*:/gi,
  /\bassistant\s*:/gi,
];

function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  let out = value.replace(CONTROL_CHARS, ' ').slice(0, MAX_MESSAGE_CHARS).trim();
  for (const pattern of INJECTION_PATTERNS) {
    out = out.replace(pattern, '[filtered]');
  }
  return out;
}

function parseHistory(body: unknown): HistoryTurn[] {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw)) return [];
  const turns: HistoryTurn[] = [];
  for (const entry of raw.slice(-MAX_HISTORY_TURNS)) {
    const role = (entry as HistoryTurn)?.role;
    if (role !== 'user' && role !== 'assistant') continue;
    const content = sanitizeText((entry as HistoryTurn)?.content);
    if (!content) continue;
    turns.push({ role, content });
  }
  return turns;
}

/* ----------------------------- card tokens ------------------------------ */

const CARD_TOKENS: Record<string, CardPayload> = {
  '[card:website-pricing]': { kind: 'pricing', product: 'website' },
  '[card:app-pricing]': { kind: 'pricing', product: 'app' },
  '[card:projects]': { kind: 'projects' },
  '[card:roadmap]': { kind: 'roadmap' },
  '[card:contact]': { kind: 'contact' },
};

function extractCards(text: string): { text: string; cards: CardPayload[] } {
  const cards: CardPayload[] = [];
  let out = text;
  for (const [token, payload] of Object.entries(CARD_TOKENS)) {
    const tokenRe = new RegExp(`\\[\\s*${token.slice(1, -1)}\\s*\\]`, 'gi');
    if (tokenRe.test(out)) {
      cards.push(payload);
      out = out.replace(tokenRe, '');
    }
  }
  return { text: out.replace(/\n{3,}/g, '\n\n').trim(), cards };
}

/* ------------------------------- LLM call ------------------------------- */

async function callLLM(history: HistoryTurn[]): Promise<string | null> {
  const apiKey = process.env.CHERRY_AI_API_KEY;
  if (!apiKey) return null;

  const apiUrl =
    process.env.CHERRY_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.CHERRY_AI_MODEL || 'gpt-4o-mini';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

  try {
    const response = (await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 320,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...history.slice(-8),
        ],
      }),
      signal: controller.signal,
    })) as { ok: boolean; json: () => Promise<unknown> };

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const content = data?.choices?.[0]?.message?.content;
    return typeof content === 'string' && content.trim() ? content.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------- handler -------------------------------- */

function clientIp(headers: ApiRequest['headers']): string {
  const fwd = headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
  const real = headers['x-real-ip'];
  return (typeof real === 'string' ? real : 'unknown').trim() || 'unknown';
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  if (!allowRequest(clientIp(req.headers))) {
    res.status(429).json({ error: 'rate_limited' });
    return;
  }

  const history = parseHistory(req.body);
  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    res.status(400).json({ error: 'bad_request' });
    return;
  }

  // Prefer a configured LLM; silently fall back to the offline engine.
  const llmText = await callLLM(history);
  if (llmText) {
    const { text, cards } = extractCards(llmText);
    if (text) {
      res.status(200).json({ reply: text, cards, suggestions: [], source: 'llm' });
      return;
    }
  }

  const engineReply = runEngine(history);
  res.status(200).json({
    reply: engineReply.text,
    cards: engineReply.cards,
    suggestions: engineReply.suggestions,
    source: 'engine',
  });
}
