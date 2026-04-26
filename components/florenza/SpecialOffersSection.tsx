import { BouquetCard, type BouquetCardData } from './BouquetCard';
import { MagneticButton } from './MagneticButton';

export function SpecialOffersSection({ bouquets }: { bouquets: BouquetCardData[] }) {
  if (!bouquets.length) return null;
  return (
    <section className="editorial-container py-16 md:py-24">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-dusty-rose)] mb-3">
            Спеціальні пропозиції
          </p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-deep-forest)]">
            Знижки з таймером
          </h2>
        </div>
        <MagneticButton href="/buketu?discount=true" variant="ghost" className="self-start md:self-end">
          Всі акції →
        </MagneticButton>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {bouquets.slice(0, 6).map((b, i) => (
          <BouquetCard key={b.slug} bouquet={b} index={i} />
        ))}
      </div>
    </section>
  );
}
