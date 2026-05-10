'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SkeletonImage } from './effects/SkeletonImage';
import { BlurFade } from './effects/BlurFade';

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1200&q=85&auto=format&fit=crop',
    alt: 'Букет півоній у льняній обгортці',
  },
  {
    src: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1200&q=85&auto=format&fit=crop',
    alt: 'Білі півонії в студії',
  },
  {
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=85&auto=format&fit=crop',
    alt: 'Композиція з півоній',
  },
  {
    src: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=1200&q=85&auto=format&fit=crop',
    alt: 'Рожевий весняний букет',
  },
  {
    src: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&q=85&auto=format&fit=crop',
    alt: 'Темні червоні троянди',
  },
  {
    src: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1200&q=85&auto=format&fit=crop',
    alt: 'Букет у вазі',
  },
  {
    src: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=85&auto=format&fit=crop',
    alt: 'Букет на дерев\'яному столі',
  },
  {
    src: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=85&auto=format&fit=crop',
    alt: 'Ручне оформлення букета',
  },
];

const AUTO_ADVANCE_MS = 5000;

/**
 * Studio photo carousel. Auto-advances every 5s; manual interaction
 * (arrow click, dot click, swipe) disables auto-play for the session.
 */
export function PhotoMosaic() {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [autoOn, setAutoOn] = useState(true);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!autoOn || reduced) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % PHOTOS.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [autoOn, reduced]);

  const stopAuto = () => setAutoOn(false);
  const next = () => {
    stopAuto();
    setIdx((i) => (i + 1) % PHOTOS.length);
  };
  const prev = () => {
    stopAuto();
    setIdx((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
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

  return (
    <section
      className="py-24 md:py-32"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '900px',
      }}
    >
      <BlurFade>
        <header className="text-center mb-12 max-w-2xl mx-auto px-6">
          <p className="section-eyebrow justify-center inline-flex mb-4">
            ✦ З життя букетів ✦
          </p>
          <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] leading-tight text-[var(--color-deep-forest)]">
            <em style={{ fontStyle: 'italic' }}>Кадри</em> з нашої студії
          </h2>
          <p className="mt-4 text-base text-[var(--color-text-secondary)]">
            Ранковий завоз, готова композиція, букет у руках клієнтки.
          </p>
        </header>
      </BlurFade>

      <div
        className="relative max-w-3xl mx-auto px-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-[4/5] md:aspect-[3/2] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)] shadow-[0_12px_40px_rgba(44,62,45,0.10)]">
          <AnimatePresence mode="sync">
            <motion.div
              key={idx}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <SkeletonImage
                src={PHOTOS[idx].src}
                alt={PHOTOS[idx].alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            type="button"
            aria-label="Попереднє фото"
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 left-3 md:left-4 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-[var(--color-cream)]/85 hover:bg-[var(--color-cream)] text-[var(--color-deep-forest)] flex items-center justify-center shadow-md transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            type="button"
            aria-label="Наступне фото"
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 right-3 md:right-4 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-[var(--color-cream)]/85 hover:bg-[var(--color-cream)] text-[var(--color-deep-forest)] flex items-center justify-center shadow-md transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Фото ${i + 1}`}
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
        <p className="mt-2 text-center text-[10px] uppercase tracking-[0.32em] text-[var(--color-text-muted)] tabular-nums">
          {String(idx + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
        </p>
      </div>
    </section>
  );
}
