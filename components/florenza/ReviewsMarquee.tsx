'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Review {
  authorName: string;
  rating: number;
  content: string;
  source?: string;
}

export function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  const [paused, setPaused] = useState(false);
  if (!reviews.length) return null;
  const items = [...reviews, ...reviews]; // duplicate for seamless loop

  return (
    <div
      className="overflow-hidden"
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
        {items.map((r, i) => (
          <article
            key={i}
            className="flex-shrink-0 w-[300px] md:w-[420px] p-6 md:p-8 rounded-[var(--radius-lg)] bg-[var(--color-bg-elevated)] border border-[var(--color-border-soft)]"
          >
            <div className="text-[var(--color-sage-deep)] text-sm">
              {'★'.repeat(r.rating)}
              <span className="text-[var(--color-border)]">{'★'.repeat(5 - r.rating)}</span>
            </div>
            <p className="mt-4 text-[var(--color-text-primary)] leading-relaxed text-sm">
              {r.content}
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              {r.authorName}
              {r.source ? ` · ${r.source}` : ''}
            </p>
          </article>
        ))}
      </motion.div>
    </div>
  );
}
