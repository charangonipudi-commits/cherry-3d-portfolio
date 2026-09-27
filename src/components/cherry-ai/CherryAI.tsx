import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingButton from './FloatingButton';
import ChatWindow from './ChatWindow';
import { askCherryAI } from '../../lib/cherry-ai/api';
import {
  detectLanguageFromText,
  rateLimitReply,
} from '../../lib/cherry-ai/engine';
import {
  WELCOME_TEXT,
  type ChatMessage,
  type HistoryTurn,
  type Lang,
} from '../../lib/cherry-ai/types';
import './cherry-ai.css';

const STORAGE_KEY = 'cherry-ai-session';
const SCROLL_LIFT_PX = 140;

function uid(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeWelcome(): ChatMessage {
  return { id: 'welcome', role: 'assistant', text: WELCOME_TEXT };
}

function loadMessages(): ChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((m) => ({ ...m, animated: false }));
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return [makeWelcome()];
}

function saveMessages(messages: ChatMessage[]) {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-40)),
    );
  } catch {
    /* storage full / unavailable — session only anyway */
  }
}

/**
 * Cherry AI — the site assistant. Floating button + chat window,
 * wired to /api/chat with an offline fallback engine.
 */
export default function CherryAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<Lang>('en');
  const [lifted, setLifted] = useState(true);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  /* Lift the FAB above the hero's contact button near the top of the page. */
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY < SCROLL_LIFT_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('cherry-lock');
    return () => document.body.classList.remove('cherry-lock');
  }, [isOpen]);

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim().slice(0, 500);
      if (!text || isLoading) return;

      const current = messagesRef.current;
      const userMsg: ChatMessage = { id: uid(), role: 'user', text };
      const history: HistoryTurn[] = [...current, userMsg]
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.text }));

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);
      setLang(detectLanguageFromText(text));

      const startedAt = Date.now();
      const result = await askCherryAI(history);

      let reply;
      if (result.ok) {
        reply = result.reply;
      } else {
        reply = rateLimitReply(detectLanguageFromText(text));
      }

      // Natural typing pause so the indicator is visible.
      const minWait = 700 + Math.random() * 500;
      const elapsed = Date.now() - startedAt;
      const delay = Math.max(0, minWait - elapsed);

      window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'assistant',
            text: reply.text,
            cards: reply.cards,
            animated: true,
          },
        ]);
        setLang(reply.lang === 'en' ? detectLanguageFromText(text) : reply.lang);
        setIsLoading(false);
      }, delay);
    },
    [isLoading],
  );

  const handleMinimize = useCallback(() => setIsOpen(false), []);

  /* Close ends the session: the next open starts fresh with the welcome. */
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setMessages([makeWelcome()]);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <FloatingButton lifted={lifted} onOpen={() => setIsOpen(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            key="cherry-chat-window"
            open={isOpen}
            messages={messages}
            isLoading={isLoading}
            lang={lang}
            input={input}
            onInputChange={setInput}
            onSend={send}
            onMinimize={handleMinimize}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}
