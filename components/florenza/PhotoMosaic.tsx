import Image from 'next/image';
import { BlurFade } from './effects/BlurFade';

// Curated bouquet-only Unsplash IDs at modest size (500w is enough for
// the 340px tile on retina). Only 4 images per row × 2 array repeats = 16
// DOM nodes per row instead of 30 — lighter compositor work.
const ROW_TOP = [
  {
    src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80&auto=format&fit=crop',
    alt: 'Букет півоній у льняній обгортці',
  },
  {
    src: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500&q=80&auto=format&fit=crop',
    alt: 'Білі півонії в студії',
  },
  {
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80&auto=format&fit=crop',
    alt: 'Композиція з півоній',
  },
  {
    src: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=500&q=80&auto=format&fit=crop',
    alt: 'Рожевий весняний букет',
  },
];

const ROW_BOTTOM = [
  {
    src: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&q=80&auto=format&fit=crop',
    alt: 'Темні червоні троянди',
  },
  {
    src: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=500&q=80&auto=format&fit=crop',
    alt: 'Букет у вазі',
  },
  {
    src: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500&q=80&auto=format&fit=crop',
    alt: 'Букет на дерев\'яному столі',
  },
  {
    src: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&q=80&auto=format&fit=crop',
    alt: 'Ручне оформлення букета',
  },
];

function PhotoRow({
  photos,
  direction,
}: {
  photos: typeof ROW_TOP;
  direction: 'left' | 'right';
}) {
  // Double the array — translateX -50% keeps the seam invisible.
  const items = [...photos, ...photos];
  const animation = direction === 'left' ? 'florenza-row-left' : 'florenza-row-right';

  return (
    <div className="overflow-hidden">
      <div
        className="flex gap-3 md:gap-4 will-change-transform"
        style={{ animation: `${animation} 80s linear infinite` }}
      >
        {items.map((p, i) => (
          <div
            key={`${p.src}-${i}`}
            className="relative w-[260px] md:w-[340px] aspect-[4/5] flex-shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-cream-soft)]"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="340px"
              className="object-cover"
              loading="lazy"
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
  return (
    <section
      className="py-24 md:py-32"
      style={{
        // Skip rendering work entirely when section is well outside the
        // viewport. Avoids the marquee burning GPU while user reads other
        // sections.
        contentVisibility: 'auto',
        containIntrinsicSize: '900px',
      }}
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
            Ранковий завоз, готова композиція, букет у руках клієнтки.
          </p>
        </header>
      </BlurFade>

      <div className="space-y-3 md:space-y-4">
        <PhotoRow photos={ROW_TOP} direction="left" />
        <PhotoRow photos={ROW_BOTTOM} direction="right" />
      </div>

      <style>{`
        @keyframes florenza-row-left {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes florenza-row-right {
          from { transform: translate3d(-50%, 0, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
      `}</style>
    </section>
  );
}
