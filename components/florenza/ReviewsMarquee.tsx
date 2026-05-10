'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface Review {
  authorName: string;
  rating: number;
  content: string;
  source?: string;
}

const AVATAR_PALETTE = [
  { bg: '#e8d4cc', fg: '#7a3a2c' },
  { bg: '#dde2c8', fg: '#3a4f24' },
  { bg: '#dad0c0', fg: '#4a3820' },
  { bg: '#e3d6dc', fg: '#5a3050' },
  { bg: '#cbd9d6', fg: '#28484a' },
];

function avatarFor(name: string) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const idx = name.charCodeAt(0) % AVATAR_PALETTE.length;
  return { initials, ...AVATAR_PALETTE[idx] };
}

const AUTO_ADVANCE_MS = 5000;

/**
 * Reviews carousel — one card at a time, auto-advances every 5s, swipeable
 * on touch, prev/next arrows + dot indicators on desktop. Manual interaction
 * (arrow click, dot click, swipe) cancels auto-play permanently for the
 * session, per spec.
 */
export function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [autoOn, setAutoOn] = useState(true);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!autoOn || reduced || reviews.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % reviews.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [autoOn, reduced, reviews.length]);

  if (!reviews.length) return null;

  const stopAuto = () => setAutoOn(false);
  const next = () => {
    stopAuto();
    setIdx((i) => (i + 1) % reviews.length);
  };
  const prev = () => {
    stopAuto();
    setIdx((i) => (i - 1 + reviews.length) % reviews.length);
  };
  const goto = (i: number) => {
    stopAuto();
    setIdx(i);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next();
    else prev();
  };

  const r = reviews[idx];
  const av = avatarFor(r.authorName);

  return (
    <div
      className="relative max-w-2xl mx-auto"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 md:p-10 rounded-[var(--radius-lg)] bg-[var(--color-bg-elevated)] border border-[var(--color-border-soft)] shadow-[0_4px_20px_rgba(44,62,45,0.06)]"
          >
            <header className="flex items-start gap-4 mb-5">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-[var(--font-display)] text-sm"
                style={{ background: av.bg, color: av.fg }}
              >
                {av.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-base text-[var(--color-deep-forest)]">
                  {r.authorName}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)] mt-0.5">
                  {r.source ?? 'Verified purchase'}
                </p>
              </div>
              <div className="flex gap-px text-[var(--color-dusty-rose)] text-lg">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < r.rating ? 'opacity-100' : 'opacity-25'}>
                    ★
                  </span>
                ))}
              </div>
            </header>

            <p
              className="font-[var(--font-display)] text-3xl text-[var(--color-sage)] leading-none mb-1"
              style={{ fontStyle: 'italic' }}
              aria-hidden="true"
            >
              &ldquo;
            </p>
            <p className="text-base md:text-lg text-[var(--color-text-primary)] leading-[1.7]">
              {r.content}
            </p>

            <footer className="mt-6 pt-4 border-t border-[var(--color-border-soft)] flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              <span>✓ Покупка підтверджена</span>
              <span>Florenza</span>
            </footer>
          </motion.article>
        </AnimatePresence>
      </div>

      {reviews.length > 1 && (
        <>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Попередній відгук"
              onClick={prev}
              className="w-10 h-10 rounded-full bg-[var(--color-cream-soft)] hover:bg-[var(--color-cream)] text-[var(--color-deep-forest)] flex items-center justify-center transition border border-[var(--color-border-soft)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Відгук ${i + 1}`}
                  onClick={() => goto(i)}
                  className={
                    'rounded-full transition-all ' +
                    (i === idx
                      ? 'w-6 h-1.5 bg-[var(--color-deep-forest)]'
                      : 'w-1.5 h-1.5 bg-[var(--color-deep-forest)]/30 hover:bg-[var(--color-deep-forest)]/60')
                  }
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Наступний відгук"
              onClick={next}
              className="w-10 h-10 rounded-full bg-[var(--color-cream-soft)] hover:bg-[var(--color-cream)] text-[var(--color-deep-forest)] flex items-center justify-center transition border border-[var(--color-border-soft)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.32em] text-[var(--color-text-muted)] tabular-nums">
            {String(idx + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
          </p>
        </>
      )}
    </div>
  );
}
