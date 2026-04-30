'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { LiyaChat } from './LiyaChat';

export function LiyaChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-[var(--color-deep-forest)] text-[var(--color-cream)] shadow-[var(--shadow-card)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.95 : 1, pointerEvents: open ? 'none' : 'auto' }}
        transition={{ duration: 0.3 }}
        aria-label="Написати в чат"
      >
        <MessageCircle size={18} />
        <span className="text-sm">Написати</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 md:inset-auto md:right-6 md:bottom-6 md:w-[420px] md:max-w-[calc(100vw-3rem)] md:h-[640px] md:max-h-[calc(100vh-3rem)] bg-[var(--color-bg-elevated)] z-40 flex flex-col md:rounded-2xl md:shadow-[var(--shadow-hover)] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-soft)]">
              <div>
                <p className="font-[var(--font-display)] text-lg leading-tight text-[var(--color-deep-forest)]">
                  Florenza
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Зазвичай відповідаємо за хвилину
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-[var(--color-text-secondary)]"
                aria-label="Закрити чат"
              >
                <X size={20} />
              </button>
            </header>
            <LiyaChat />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
