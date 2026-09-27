import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Folder,
  Globe,
  HelpCircle,
  MessageCircle,
  Minus,
  Send,
  Smartphone,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import RobotAvatar from './RobotAvatar';
import MessageBubble from './MessageBubble';
import { QUICK_QUESTIONS } from '../../lib/cherry-ai/knowledge';
import type { ChatMessage, Lang } from '../../lib/cherry-ai/types';

const QUICK_ICONS: Record<string, LucideIcon> = {
  Services: Sparkles,
  'Website Price': Globe,
  'App Price': Smartphone,
  'My Projects': Folder,
  'About Charan': User,
  'How to Order?': HelpCircle,
  'Contact on WhatsApp': MessageCircle,
};

const PLACEHOLDER: Record<Lang, string> = {
  en: 'Ask about services, pricing, projects…',
  te: 'Services, pricing గురించి అడగండి…',
  tenglish: 'Services, pricing gurinchi adagandi…',
};

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface ChatWindowProps {
  open: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  lang: Lang;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
  onMinimize: () => void;
  onClose: () => void;
}

export default function ChatWindow({
  open,
  messages,
  isLoading,
  lang,
  input,
  onInputChange,
  onSend,
  onMinimize,
  onClose,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const stickToBottom = () => {
    const el = scrollRef.current;
    if (el && stickRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 350);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (open) stickToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, messages.length, isLoading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMinimize();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onMinimize]);

  const showQuickGrid = messages.length <= 1;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    onSend(text);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="false"
      aria-label="Cherry AI chat"
      className="cherry-window"
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 32, scale: 0.96 }}
      transition={{ duration: 0.32, ease: EASE }}
    >
      <div className="cherry-window-border">
        <div className="cherry-window-inner">
          {/* Header */}
          <header className="cherry-header-safe flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="relative shrink-0">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#4C6FFF]/25 to-[#B600A8]/25">
                <RobotAvatar size={34} />
              </span>
              <span className="cherry-online-dot absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0C0C0C] bg-[#22C55E]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold leading-tight text-white text-[0.95rem]">
                Cherry AI
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#34D399]">
                AI Assistant • Online
              </p>
            </div>
            <button
              type="button"
              onClick={onMinimize}
              aria-label="Minimize chat"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-[#D7E2EA] transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              <Minus className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-[#D7E2EA] transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              stickRef.current =
                el.scrollHeight - el.scrollTop - el.clientHeight < 90;
            }}
            className="cherry-scroll min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-4 py-4"
            aria-live="polite"
          >
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onTypeTick={stickToBottom}
              />
            ))}

            {isLoading && (
              <div className="flex items-start gap-2">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                  <RobotAvatar size={19} />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3">
                  <span className="cherry-typing-dot h-1.5 w-1.5 rounded-full bg-[#8FA0FF]" />
                  <span className="cherry-typing-dot h-1.5 w-1.5 rounded-full bg-[#B600A8]" />
                  <span className="cherry-typing-dot h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
                </div>
              </div>
            )}

            {showQuickGrid && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {QUICK_QUESTIONS.map((question, index) => {
                  const Icon = QUICK_ICONS[question] ?? Sparkles;
                  return (
                    <button
                      key={question}
                      type="button"
                      onClick={() => onSend(question)}
                      className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-[0.72rem] font-medium text-[#D7E2EA] transition-all duration-200 hover:border-[#8FA0FF]/50 hover:bg-[#8FA0FF]/10 hover:shadow-[0_0_18px_rgba(143,160,255,0.2)] active:scale-95 ${
                        index === QUICK_QUESTIONS.length - 1 ? 'col-span-2' : ''
                      }`}
                    >
                      <Icon
                        className="h-3.5 w-3.5 shrink-0 text-[#8FA0FF]"
                        strokeWidth={2}
                      />
                      <span className="min-w-0">{question}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick chips (after the conversation has started) */}
          {!showQuickGrid && (
            <div className="cherry-scroll-x flex gap-2 overflow-x-auto border-t border-white/[0.06] px-3 py-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => onSend(question)}
                  disabled={isLoading}
                  className="shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[#D7E2EA]/80 transition-colors duration-200 hover:border-[#8FA0FF]/50 hover:text-white disabled:opacity-40"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 pt-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              maxLength={500}
              enterKeyHint="send"
              placeholder={PLACEHOLDER[lang]}
              aria-label="Message Cherry AI"
              className="cherry-scroll min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[0.85rem] text-white placeholder:text-[#D7E2EA]/35 focus:border-[#8FA0FF]/60 focus:outline-none focus:ring-2 focus:ring-[#8FA0FF]/20 sm:text-sm"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #4C6FFF, #B600A8)',
                boxShadow: '0 0 18px rgba(118, 33, 176, 0.45)',
              }}
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </motion.button>
          </form>

          <p className="cherry-footer-safe px-4 pt-2 text-center text-[9px] tracking-wide text-[#D7E2EA]/35">
            Cherry AI answers from this website only • Confirm details on
            WhatsApp
          </p>
        </div>
      </div>
    </motion.div>
  );
}
