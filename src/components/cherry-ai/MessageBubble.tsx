import { useEffect, useState } from 'react';
import RobotAvatar from './RobotAvatar';
import ChatCards from './ChatCards';
import type { ChatMessage } from '../../lib/cherry-ai/types';

/** Fast typewriter reveal — finishes in ~1s regardless of length. */
function useTypewriter(text: string, enabled: boolean) {
  const [count, setCount] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return;
    }
    let current = 0;
    const step = Math.max(2, Math.ceil(text.length / 55));
    const id = window.setInterval(() => {
      current = Math.min(current + step, text.length);
      setCount(current);
      if (current >= text.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [text, enabled]);

  return { shown: text.slice(0, count), done: count >= text.length };
}

interface MessageBubbleProps {
  message: ChatMessage;
  onTypeTick: () => void;
}

export default function MessageBubble({ message, onTypeTick }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const { shown, done } = useTypewriter(message.text, message.role === 'assistant' && message.animated === true);

  useEffect(() => {
    if (!done) onTypeTick();
  }, [shown, done, onTypeTick]);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[85%] whitespace-pre-line break-words rounded-2xl rounded-br-md px-4 py-2.5 text-[0.85rem] leading-relaxed text-white shadow-[0_4px_18px_rgba(76,111,255,0.35)] sm:text-sm"
          style={{ background: 'linear-gradient(135deg, #4C6FFF, #B600A8)' }}
        >
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
        <RobotAvatar size={19} />
      </span>
      <div className="min-w-0 max-w-[85%]">
        <div
          className={`whitespace-pre-line break-words rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[0.85rem] leading-relaxed text-[#D7E2EA] sm:text-sm ${
            !done ? 'cherry-caret' : ''
          }`}
        >
          {shown}
        </div>
        {done && <ChatCards cards={message.cards} />}
      </div>
    </div>
  );
}
