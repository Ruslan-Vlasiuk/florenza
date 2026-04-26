import type { Metadata } from 'next';
import { EditorialHero } from '@/components/florenza/EditorialHero';
import { BouquetCard, type BouquetCardData } from '@/components/florenza/BouquetCard';
import { MagneticButton } from '@/components/florenza/MagneticButton';
import { ReviewsMarquee } from '@/components/florenza/ReviewsMarquee';
import { UspBento } from '@/components/florenza/UspBento';
import { SpecialOffersSection } from '@/components/florenza/SpecialOffersSection';
import { fetchFeaturedBouquets, fetchActiveDiscounts, fetchFeaturedReviews } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Florenza — флористичний бутік в Ірпені',
  description:
    'Преміум авторська флористика. Тиха editorial-чутливість. Доставка по Ірпеню, Бучі, Гостомелю та ближньому Києву.',
  alternates: { canonical: '/' },
};

export const revalidate = 300;

export default async function HomePage() {
  const [featured, discounts, reviews] = await Promise.all([
    fetchFeaturedBouquets(8),
    fetchActiveDiscounts(6),
    fetchFeaturedReviews(8),
  ]);

  return (
    <>
      <EditorialHero
        eyebrow="Florenza · Ірпінь"
        title="Квіти, які говорять тихо"
        subtitle="Авторська флористика для тих, хто цінує тишу і деталь. Доставка по Ірпеню, Бучі, Гостомелю та ближньому Києву."
        imageUrl="/images/hero-default.jpg"
        imageAlt="Букет півоній у льняній упаковці"
        ctaPrimary={{ label: 'Перейти до каталогу', href: '/buketu' }}
        ctaSecondary={{ label: 'Дізнатися більше', href: '/about' }}
      />

      <UspBento />

      {discounts.length > 0 && <SpecialOffersSection bouquets={discounts} />}

      <section className="editorial-container py-24 md:py-32">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
              Каталог
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-deep-forest)]">
              Букети сезону
            </h2>
          </div>
          <MagneticButton href="/buketu" variant="ghost" className="self-start md:self-end">
            Усі букети →
          </MagneticButton>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((b, i) => (
            <BouquetCard key={b.slug} bouquet={b} index={i} />
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-cream-soft)] py-24 md:py-32">
        <div className="editorial-container">
          <header className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
              Що пишуть
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl text-[var(--color-deep-forest)]">
              Відгуки клієнтів
            </h2>
          </header>
          <ReviewsMarquee reviews={reviews} />
        </div>
      </section>

      <section className="editorial-container py-24 md:py-32 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Особливі замовлення
        </p>
        <h2 className="font-[var(--font-display)] text-3xl md:text-5xl text-[var(--color-deep-forest)] max-w-2xl mx-auto leading-tight">
          Весілля, корпоратив, авторські композиції
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-[var(--color-text-secondary)] text-lg">
          Для подій, де букет — не просто подарунок, а частина історії. Розкажіть деталі — і ми
          складемо персональну пропозицію.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <MagneticButton href="/vesilna-floristyka" variant="primary">
            Весільна флористика
          </MagneticButton>
          <MagneticButton href="/korporatyvna-floristyka" variant="outline">
            Корпоративна
          </MagneticButton>
        </div>
      </section>
    </>
  );
}
