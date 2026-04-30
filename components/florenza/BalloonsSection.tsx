import { BouquetCard, type BouquetCardData } from './BouquetCard';
import { MagneticButton } from './MagneticButton';
import { BotanicalWatermark } from './effects/BotanicalWatermark';

export function BalloonsSection({ bouquets }: { bouquets: BouquetCardData[] }) {
  if (!bouquets.length) return null;
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <BotanicalWatermark variant="eucalyptus" position="top-right" size={340} opacity={0.08} />
      <div className="editorial-container relative z-10">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-dusty-rose)] mb-3">
            Повітряні шари
          </p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-deep-forest)] leading-tight">
            Шари і фольговані сети
          </h2>
          <p className="mt-4 text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Гелієві набори в палітрі бренду — самостійно або як доповнення до квітів.
            Тримаються 8–14 годин.
          </p>
        </div>
        <MagneticButton
          href="/buketu?type=shari"
          variant="ghost"
          className="self-start md:self-end shrink-0"
        >
          Усі шари →
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
