'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating "back to top" button. Appears after user scrolls past first
 * viewport, hides when at top. Sits opposite the chat launcher.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    function check() {
      setShow(window.scrollY > window.innerHeight * 1.2);
    }
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Прокрутити вгору"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 left-5 md:bottom-8 md:left-8 z-30 w-11 h-11 rounded-full bg-[var(--color-cream)] border border-[var(--color-border)] flex items-center justify-center shadow-[var(--shadow-card)] hover:bg-[var(--color-deep-forest)] hover:text-[var(--color-cream)] hover:border-[var(--color-deep-forest)] transition-colors group"
        >
          <svg
            viewBox="0 0 16 16"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M8 12 L8 4 M4 8 L8 4 L12 8" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
