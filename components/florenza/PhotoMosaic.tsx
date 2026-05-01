'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BlurFade } from './effects/BlurFade';

// Curated bouquet-only Unsplash IDs — verified flowers/bouquets, no
// stock office / desk drift.
const ROW_TOP = [
  {
    src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&q=85&auto=format&fit=crop',
    alt: 'Букет півоній у льняній обгортці',
  },
  {
    src: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=900&q=85&auto=format&fit=crop',
    alt: 'Білі півонії в студії',
  },
  {
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=85&auto=format&fit=crop',
    alt: 'Композиція з півоній',
  },
  {
    src: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=900&q=85&auto=format&fit=crop',
    alt: 'Рожевий весняний букет',
  },
  {
    src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&q=85&auto=format&fit=crop',
    alt: 'Букет крупним планом',
  },
];

const ROW_BOTTOM = [
  {
    src: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&q=85&auto=format&fit=crop',
    alt: 'Темні червоні троянди',
  },
  {
    src: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=900&q=85&auto=format&fit=crop',
    alt: 'Букет у вазі',
  },
  {
    src: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=900&q=85&auto=format&fit=crop',
    alt: 'Букет на дерев\'яному столі',
  },
  {
    src: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=900&q=85&auto=format&fit=crop',
    alt: 'Ручне оформлення букета',
  },
  {
    src: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=900&q=85&auto=format&fit=crop',
    alt: 'Руки тримають букет',
  },
];

function PhotoRow({
  photos,
  direction,
  paused,
}: {
  photos: typeof ROW_TOP;
  direction: 'left' | 'right';
  paused: boolean;
}) {
  // Triple the array so the loop stays seamless when one set scrolls out.
  const items = [...photos, ...photos, ...photos];
  const animation = direction === 'left' ? 'florenza-row-left' : 'florenza-row-right';

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3 md:gap-4 will-change-transform"
        style={{
          animation: `${animation} 60s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {items.map((p, i) => (
          <div
            key={`${p.src}-${i}`}
            className="relative w-[260px] md:w-[340px] aspect-[4/5] flex-shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-cream-soft)] group"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="340px"
              className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Customer photo wall — two horizontal rows scrolling in opposite directions.
 * Continuous CSS-only marquee (no scroll listeners), pauses on hover so user
 * can study individual frames. Visually "alive" without being distracting.
 */
export function PhotoMosaic() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      className="py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <BlurFade>
        <header className="text-center mb-14 max-w-2xl mx-auto px-6">
          <p className="section-eyebrow justify-center inline-flex mb-4">
            ✦ З життя букетів ✦
          </p>
          <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] leading-tight text-[var(--color-deep-forest)]">
            <em style={{ fontStyle: 'italic' }}>Кадри</em> з нашої студії
          </h2>
          <p className="mt-4 text-base text-[var(--color-text-secondary)]">
            Ранковий завоз, готова композиція, букет у руках клієнтки. Ведіть
            мишею щоб призупинити.
          </p>
        </header>
      </BlurFade>

      <div className="space-y-3 md:space-y-4">
        <PhotoRow photos={ROW_TOP} direction="left" paused={paused} />
        <PhotoRow photos={ROW_BOTTOM} direction="right" paused={paused} />
      </div>

      <style>{`
        @keyframes florenza-row-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes florenza-row-right {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
