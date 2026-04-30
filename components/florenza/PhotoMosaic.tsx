import Image from 'next/image';
import { BlurFade } from './effects/BlurFade';

interface MosaicEntry {
  src: string;
  alt: string;
  span: 'wide' | 'tall' | 'square' | 'normal';
}

const ENTRIES: MosaicEntry[] = [
  {
    src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1000&q=85&auto=format&fit=crop',
    alt: 'Букет півоній на дерев\'яному столі',
    span: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=900&q=85&auto=format&fit=crop',
    alt: 'Робоче місце флориста',
    span: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=85&auto=format&fit=crop',
    alt: 'Композиція з трояндами',
    span: 'square',
  },
  {
    src: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=900&q=85&auto=format&fit=crop',
    alt: 'Білі півонії в крафті',
    span: 'square',
  },
  {
    src: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1000&q=85&auto=format&fit=crop',
    alt: 'Темні троянди',
    span: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=900&q=85&auto=format&fit=crop',
    alt: 'Студія Florenza',
    span: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1498611247071-c1c4cf9f1c5d?w=900&q=85&auto=format&fit=crop',
    alt: 'Жінка з букетом',
    span: 'square',
  },
  {
    src: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1000&q=85&auto=format&fit=crop',
    alt: 'Ваза з букетом',
    span: 'normal',
  },
];

const SPAN_CLASSES: Record<MosaicEntry['span'], string> = {
  wide: 'col-span-2 row-span-1 aspect-[2/1]',
  tall: 'col-span-1 row-span-2 aspect-[1/2]',
  square: 'col-span-1 row-span-1 aspect-square',
  normal: 'col-span-1 row-span-1 aspect-[4/5]',
};

/**
 * Customer photo wall — Pinterest/Instagram-style mosaic of mixed-aspect
 * images. On desktop, mixes widths and heights for editorial composition;
 * on mobile, all become 1:1.
 */
export function PhotoMosaic() {
  return (
    <section className="py-24 md:py-32">
      <BlurFade>
        <header className="text-center mb-14 max-w-2xl mx-auto px-6">
          <p className="section-eyebrow justify-center inline-flex mb-4">
            ✦ З життя букетів ✦
          </p>
          <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] leading-tight text-[var(--color-deep-forest)]">
            <em style={{ fontStyle: 'italic' }}>Кадри</em> з нашої студії
          </h2>
          <p className="mt-4 text-base text-[var(--color-text-secondary)]">
            Пасма дня в Florenza: ранковий завоз, букет на столі, готова композиція в
            руках кур&apos;єра.
          </p>
        </header>
      </BlurFade>

      <div className="px-3 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[200px] gap-3">
          {ENTRIES.map((e, i) => (
            <BlurFade key={e.src} delay={(i % 4) * 0.08}>
              <div
                className={`relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-cream-soft)] group transition-all duration-500 hover:shadow-[0_20px_60px_rgba(44,62,45,0.18)] ${SPAN_CLASSES[e.span]}`}
              >
                <Image
                  src={e.src}
                  alt={e.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
                />
                {/* Caption strip on hover */}
                <div
                  className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                >
                  <p className="text-xs uppercase tracking-[0.32em] text-white">
                    Florenza · Spring 2026
                  </p>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
