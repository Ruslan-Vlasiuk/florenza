import Image from 'next/image';
import { BlurFade } from './effects/BlurFade';

// Curated bouquet-only Unsplash IDs — verified to be flowers/bouquets, not
// stock office / coffee / lifestyle drift. Aspect ratio is uniform 4/5
// across the whole grid for clean editorial cadence.
const PHOTOS: Array<{ src: string; alt: string }> = [
  {
    src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&q=85&auto=format&fit=crop&crop=faces',
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
    src: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=900&q=85&auto=format&fit=crop',
    alt: 'Рожевий весняний букет',
  },
  {
    src: 'https://images.unsplash.com/photo-1457089328389-f2efeb6b6ba6?w=900&q=85&auto=format&fit=crop',
    alt: 'Півонії крупним планом',
  },
];

/**
 * Customer photo wall — uniform 4:5 portrait grid. All bouquets, no mixed
 * spans (the previous span-mosaic looked chaotic and overflowed into the
 * next section because grid auto-placement couldnt see the BlurFade-
 * wrapped span classes).
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
            Ранковий завоз, готова композиція, букет у руках клієнтки — кадри з
            нашої щоденної роботи.
          </p>
        </header>
      </BlurFade>

      <div className="editorial-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {PHOTOS.map((p, i) => (
            <div
              key={p.src}
              className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-cream-soft)] group transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(44,62,45,0.18)]"
              style={{
                animation: `florenza-mosaic-in 0.7s ${(i % 4) * 0.08}s both ease-out`,
              }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-xs uppercase tracking-[0.32em] text-white">
                  Florenza · Spring 2026
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes florenza-mosaic-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
