import { BouquetCard, type BouquetCardData } from './BouquetCard';
import { MagneticButton } from './MagneticButton';

export function BigRosesSection({ bouquets }: { bouquets: BouquetCardData[] }) {
  if (!bouquets.length) return null;
  return (
    <section className="bg-[var(--color-cream-soft)] py-16 md:py-24">
      <div className="editorial-container">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-dusty-rose)] mb-3">
              Великі букети троянд
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-deep-forest)] leading-tight">
              51, 101, 201 троянда
            </h2>
            <p className="mt-4 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Преміум червоні троянди 60 см у класичному оформленні. Для річниць,
              освідчень та жестів, які запам'ятовуються.
            </p>
          </div>
          <MagneticButton
            href="/buketu?type=veliki-troyandy"
            variant="ghost"
            className="self-start md:self-end shrink-0"
          >
            Усі великі букети →
          </MagneticButton>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {bouquets.slice(0, 6).map((b, i) => (
            <BouquetCard key={b.slug} bouquet={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
