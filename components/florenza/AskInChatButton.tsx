'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { openLiya } from '@/lib/liya-bridge';

const TELEGRAM_BOT_URL = 'https://t.me/FLORENZA_irpin_bot';

type Props = {
  bouquetSlug: string;
  bouquetId: string;
  bouquetName: string;
  variant?: 'primary' | 'outline' | 'ghost';
  children?: ReactNode;
  className?: string;
};

export function AskInChatButton({
  bouquetSlug,
  bouquetId,
  bouquetName,
  variant = 'outline',
  children,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MagneticButton
        data-testid="ask-in-chat-button"
        onClick={() => setOpen(true)}
        variant={variant}
        className={className}
      >
        {children ?? 'Запитати в чаті'}
      </MagneticButton>

      <AnimatePresence>
        {open && (
          <motion.div
            data-overlay="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 flex items-end md:items-center justify-center p-0 md:p-6"
          >
            <motion.div
              role="dialog"
              aria-label="Як зв'язатись"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[var(--color-cream)] rounded-t-2xl md:rounded-2xl shadow-[var(--shadow-hover)] overflow-hidden"
            >
              <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-soft)]">
                <h3 className="font-[var(--font-display)] text-lg text-[var(--color-deep-forest)]">
                  Як з нами зв&apos;язатись?
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1 -mr-1 text-[var(--color-text-secondary)]"
                  aria-label="Закрити"
                >
                  <X size={20} />
                </button>
              </header>

              <div className="p-5 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openLiya({
                      intent: 'question',
                      source: 'web_card',
                      bouquetSlug,
                      bouquetId,
                      bouquetName,
                    });
                  }}
                  className="w-full text-left flex items-start gap-4 rounded-md border border-[var(--color-border-soft)] hover:border-[var(--color-deep-forest)] bg-white px-4 py-3.5 transition-colors"
                >
                  <span className="shrink-0 mt-0.5 w-9 h-9 rounded-full bg-[var(--color-cream-soft)] flex items-center justify-center text-[var(--color-deep-forest)]">
                    <MessageCircle size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium text-[var(--color-deep-forest)]">
                      Чат на сайті
                    </span>
                    <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">
                      AI-консультант відповість одразу. Контекст букета — «{bouquetName}».
                    </span>
                  </span>
                </button>

                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="w-full text-left flex items-start gap-4 rounded-md border border-[var(--color-border-soft)] hover:border-[var(--color-deep-forest)] bg-white px-4 py-3.5 transition-colors"
                >
                  <span className="shrink-0 mt-0.5 w-9 h-9 rounded-full bg-[var(--color-cream-soft)] flex items-center justify-center text-[var(--color-deep-forest)]">
                    <Send size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium text-[var(--color-deep-forest)]">
                      Telegram
                    </span>
                    <span className="block text-xs text-[var(--color-text-muted)] mt-0.5">
                      @FLORENZA_irpin_bot — 24/7, відповідь у Telegram.
                    </span>
                  </span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
