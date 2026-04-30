import { BouquetCard, type BouquetCardData } from './BouquetCard';
import { MagneticButton } from './MagneticButton';

export function OccasionShowcase({ bouquets }: { bouquets: BouquetCardData[] }) {
  return (
    <section className="editorial-container py-24 md:py-32">
      <header className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Особливі замовлення
        </p>
        <h2 className="font-[var(--font-display)] text-3xl md:text-5xl text-[var(--color-deep-forest)] leading-tight">
          Весілля, корпоратив, авторські композиції
        </h2>
        <p className="mt-6 text-[var(--color-text-secondary)] text-lg leading-relaxed">
          Для подій, де букет — не просто подарунок, а частина історії. Подивіться авторські
          композиції Варвари або розкажіть деталі — і ми складемо персональну пропозицію.
        </p>
      </header>

      {bouquets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mb-16">
          {bouquets.slice(0, 6).map((b, i) => (
            <BouquetCard key={b.slug} bouquet={b} index={i} />
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 flex-wrap">
        <MagneticButton href="/vesilna-floristyka" variant="primary">
          Весільна флористика
        </MagneticButton>
        <MagneticButton href="/korporatyvna-floristyka" variant="outline">
          Корпоративна
        </MagneticButton>
      </div>
    </section>
  );
}
