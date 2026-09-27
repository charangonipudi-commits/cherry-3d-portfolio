export type ChatRole = 'user' | 'assistant';

export type Lang = 'en' | 'te' | 'tenglish';

/** Rich card the assistant can attach to a reply. */
export type CardPayload =
  | { kind: 'pricing'; product: 'website' | 'app' }
  | { kind: 'projects' }
  | { kind: 'roadmap' }
  | { kind: 'contact' };

/** A message as rendered inside the chat. */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  cards?: CardPayload[];
  /** Wheter the text should play the typewriter reveal (only fresh replies). */
  animated?: boolean;
}

/** Compact turn sent to the engine / server API. */
export interface HistoryTurn {
  role: ChatRole;
  content: string;
}

/** What the AI engine produces for one visitor message. */
export interface EngineReply {
  text: string;
  cards: CardPayload[];
  suggestions: string[];
  lang: Lang;
}

export const WELCOME_TEXT =
  "Hi! 👋 I'm Cherry AI.\nI can help you with websites, Android apps, pricing, projects and services. What would you like to know?";
