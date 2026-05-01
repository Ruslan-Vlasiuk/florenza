import Image from 'next/image';
import Link from 'next/link';
import type { BouquetCardData } from './BouquetCard';
import { MagneticButton } from './MagneticButton';
import { BlurFade } from './effects/BlurFade';

interface BouquetOfTheDayProps {
  bouquet: BouquetCardData;
}

/**
 * Editorial product hero — single oversized bouquet with rich copy and dual
 * call-to-action. Lives between Story sticky and the discount section as a
 * "this is what you came for" moment.
 */
export function BouquetOfTheDay({ bouquet }: BouquetOfTheDayProps) {
  return (
    <section className="editorial-container py-24 md:py-32 relative">
      <BlurFade>
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Image — oversized, asymmetric. Hardcoded to a curated
              bouquet photograph so this hero feature always reads as a
              real florist composition (the seed-time Unsplash auto-picks
              occasionally returned unrelated stock). */}
          <div className="col-span-12 md:col-span-7 relative">
            <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)] shadow-[0_30px_80px_rgba(44,62,45,0.18)]">
              <Image
                src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1600&q=88&auto=format&fit=crop"
                alt="Сьогоднішній букет — півонії та троянди в льняній обгортці"
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
              {/* Subtle vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 60%, rgba(26,26,26,0.18) 100%)',
                }}
              />
            </div>
            {/* Floating type badge — like a magazine pull-out */}
            <div className="absolute -bottom-6 left-6 md:left-10 bg-[var(--color-cream)] px-5 py-3 shadow-[0_8px_30px_rgba(44,62,45,0.15)] rounded-full">
              <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--color-sage-deep)]">
                ✦ Букет дня · {new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* Editorial copy */}
          <div className="col-span-12 md:col-span-5 md:pl-4">
            <p className="section-eyebrow mb-6">
              Підбір на сьогодні
            </p>
            <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.05] text-[var(--color-deep-forest)] mb-6">
              <em style={{ fontStyle: 'italic' }}>{bouquet.name}</em>
            </h2>
            <p className="text-base md:text-lg leading-[1.85] text-[var(--color-text-secondary)] mb-8">
              Сьогоднішній фаворит — авторська композиція, складена спеціально
              для цього сезону. Кількість обмежена: ми не повторюємо букет дня
              двічі за місяць.
            </p>

            {/* Mini composition list */}
            <ul className="space-y-2 mb-10 text-sm">
              {[
                'Преміум сезонні квіти ручного відбору',
                'Авторська обгортка (льон / японський папір)',
                'Шовкова стрічка з вузлом ручної роботи',
                'Готовий до доставки за 60 хвилин',
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[var(--color-text-secondary)]"
                >
                  <span className="mt-2 inline-block w-1 h-1 rounded-full bg-[var(--color-sage-deep)] flex-shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-sage-deep)] mb-1">
                  від
                </p>
                <p className="font-[var(--font-display)] text-3xl text-[var(--color-deep-forest)]">
                  {bouquet.price.toLocaleString('uk-UA')} грн
                </p>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] max-w-[120px] text-right leading-tight">
                Гарантія свіжості 5 днів
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <MagneticButton href={`/checkout?bouquet=${bouquet.slug}`} variant="primary">
                Замовити сьогодні
              </MagneticButton>
              <MagneticButton href={`/buket/${bouquet.slug}`} variant="outline">
                Деталі →
              </MagneticButton>
            </div>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
