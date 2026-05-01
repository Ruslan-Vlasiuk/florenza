'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Review {
  authorName: string;
  rating: number;
  content: string;
  source?: string;
}

// Avatar initials with deterministic palette
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

export function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  const [paused, setPaused] = useState(false);
  if (!reviews.length) return null;
  const items = [...reviews, ...reviews]; // duplicate for seamless loop

  return (
    <div
      className="overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '320px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <motion.div
        className="flex gap-6 will-change-transform"
        animate={{ x: paused ? undefined : ['0%', '-50%'] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((r, i) => {
          const av = avatarFor(r.authorName);
          return (
            <article
              key={i}
              className="flex-shrink-0 w-[320px] md:w-[440px] p-6 md:p-8 rounded-[var(--radius-lg)] bg-[var(--color-bg-elevated)] border border-[var(--color-border-soft)] shadow-[0_4px_20px_rgba(44,62,45,0.04)] flex flex-col"
            >
              {/* Header: avatar + author + stars */}
              <header className="flex items-start gap-4 mb-5">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-[var(--font-display)] text-sm"
                  style={{ background: av.bg, color: av.fg }}
                >
                  {av.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--color-deep-forest)] truncate">
                    {r.authorName}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)] mt-0.5">
                    {r.source ?? 'Verified purchase'}
                  </p>
                </div>
                <div className="flex gap-px text-[var(--color-dusty-rose)]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className={idx < r.rating ? 'opacity-100' : 'opacity-25'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </header>

              {/* Editorial pull-quote opening */}
              <p
                className="font-[var(--font-display)] text-3xl text-[var(--color-sage)] leading-none mb-1"
                style={{ fontStyle: 'italic' }}
                aria-hidden="true"
              >
                &ldquo;
              </p>
              <p className="text-base text-[var(--color-text-primary)] leading-[1.65] flex-1">
                {r.content}
              </p>

              {/* Bottom verified strip */}
              <footer className="mt-5 pt-4 border-t border-[var(--color-border-soft)] flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                <span>✓ Покупка підтверджена</span>
                <span>Florenza</span>
              </footer>
            </article>
          );
        })}
      </motion.div>
    </div>
  );
}
