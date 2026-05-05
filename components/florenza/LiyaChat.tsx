'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import type { LiyaEntryContext } from '@/lib/liya-bridge';
import { LiyaContextChip } from './LiyaContextChip';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  pending?: boolean;
}

interface LiyaChatProps {
  entryContext?: LiyaEntryContext | null;
  onContextConsumed?: () => void;
}

const DISCLOSURE = `Вітаю! Я Лія — AI-консультантка Florenza. Допоможу обрати букет та оформити замовлення. Якщо знадобиться особистий контакт — підключу нашу флористку особисто.

Чим можу допомогти?`;

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'florenza_chat_session';
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

export function LiyaChat({ entryContext, onContextConsumed }: LiyaChatProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: DISCLOSURE },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [openingTurnConsumed, setOpeningTurnConsumed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const showChip = !!entryContext && entryContext.intent !== 'general' && userMessageCount === 0;

  const sendOpeningTurn = useCallback(
    async (ctx: LiyaEntryContext, sid: string) => {
      // Replace the static greeting with a contextual opening turn.
      setMessages([{ role: 'assistant', text: '...', pending: true }]);
      setLoading(true);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sid,
            message: null,
            entryContext: ctx,
          }),
        });
        const data = await res.json();
        setMessages([
          {
            role: 'assistant',
            text: data.text || DISCLOSURE,
          },
        ]);
      } catch {
        setMessages([
          {
            role: 'assistant',
            text: 'Не вдалось зв\'язатись з сервером. Спробуйте через хвилину.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Trigger an opening turn once when we mount with a fresh context.
  useEffect(() => {
    if (!entryContext) return;
    if (!sessionId) return;
    if (openingTurnConsumed) return;
    if (entryContext.intent === 'general') {
      // Nothing contextual to say; consume the context silently.
      setOpeningTurnConsumed(true);
      onContextConsumed?.();
      return;
    }

    setOpeningTurnConsumed(true);
    void sendOpeningTurn(entryContext, sessionId);
    onContextConsumed?.();
  }, [entryContext, sessionId, openingTurnConsumed, sendOpeningTurn, onContextConsumed]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [
      ...m,
      { role: 'user', text },
      { role: 'assistant', text: '...', pending: true },
    ]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
        }),
      });
      const data = await res.json();
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: 'assistant',
          text: data.text || 'На жаль, не вдалось відповісти. Спробуйте ще раз.',
        };
        return copy;
      });
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: 'assistant',
          text: 'Не вдалось зв\'язатись з сервером. Спробуйте через хвилину.',
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            data-testid="liya-message"
            data-role={m.role}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={
              m.role === 'user'
                ? 'flex justify-end'
                : 'flex justify-start'
            }
          >
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[80%] px-4 py-2.5 rounded-2xl bg-[var(--color-deep-forest)] text-[var(--color-cream)] text-sm leading-relaxed'
                  : 'max-w-[85%] px-4 py-2.5 rounded-2xl bg-[var(--color-cream-soft)] text-[var(--color-text-primary)] text-sm leading-relaxed whitespace-pre-wrap'
              }
            >
              {m.pending ? (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
                </span>
              ) : (
                m.text
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {showChip && entryContext ? <LiyaContextChip context={entryContext} /> : null}
      <form
        className="border-t border-[var(--color-border-soft)] p-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напишіть повідомлення..."
          className="flex-1 px-4 py-2.5 rounded-full bg-[var(--color-cream-soft)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-full bg-[var(--color-deep-forest)] text-[var(--color-cream)] flex items-center justify-center disabled:opacity-40"
          aria-label="Надіслати"
        >
          <Send size={16} />
        </button>
      </form>
    </>
  );
}
