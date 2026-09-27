/**
 * Client layer for Cherry AI.
 *
 * Tries the secure /api/chat server endpoint first (which uses a real
 * LLM when CHERRY_AI_API_KEY is configured on the server). If the
 * endpoint is unreachable — e.g. static hosting or local dev — the
 * identical local engine answers instantly, so the assistant always
 * works. No API key ever reaches the browser.
 */

import { runEngine } from './engine';
import type { EngineReply, HistoryTurn } from './types';

export type AskResult =
  | { ok: true; reply: EngineReply }
  | { ok: false; rateLimited: true };

const API_TIMEOUT_MS = 10_000;

export async function askCherryAI(history: HistoryTurn[]): Promise<AskResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-12) }),
      signal: controller.signal,
    });

    if (res.status === 429) return { ok: false, rateLimited: true };
    if (!res.ok) throw new Error(`chat api ${res.status}`);

    const data: unknown = await res.json();
    const payload = data as {
      reply?: unknown;
      cards?: unknown;
      suggestions?: unknown;
    };
    if (typeof payload?.reply !== 'string' || !payload.reply.trim()) {
      throw new Error('chat api bad payload');
    }

    return {
      ok: true,
      reply: {
        text: payload.reply,
        cards: Array.isArray(payload.cards) ? (payload.cards as EngineReply['cards']) : [],
        suggestions: Array.isArray(payload.suggestions)
          ? (payload.suggestions as string[])
          : [],
        lang: 'en',
      },
    };
  } catch {
    // Endpoint missing (static hosting / dev server) or failed →
    // the built-in offline engine keeps the assistant fully working.
    return { ok: true, reply: runEngine(history) };
  } finally {
    clearTimeout(timer);
  }
}
