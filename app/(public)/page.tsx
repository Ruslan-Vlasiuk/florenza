import type { Metadata } from 'next';
import { EditorialHero } from '@/components/florenza/EditorialHero';
import { BouquetCard } from '@/components/florenza/BouquetCard';
import { MagneticButton } from '@/components/florenza/MagneticButton';
import { ReviewsMarquee } from '@/components/florenza/ReviewsMarquee';
import { UspBento } from '@/components/florenza/UspBento';
import { SpecialOffersSection } from '@/components/florenza/SpecialOffersSection';
import { BigRosesSection } from '@/components/florenza/BigRosesSection';
import { BalloonsSection } from '@/components/florenza/BalloonsSection';
import { OccasionShowcase } from '@/components/florenza/OccasionShowcase';
import { StoryStickySection } from '@/components/florenza/StoryStickySection';
import { StatsRibbon } from '@/components/florenza/StatsRibbon';
import { ScrollProgress } from '@/components/florenza/effects/ScrollProgress';
import { SectionDivider } from '@/components/florenza/effects/SectionDivider';
import { BlurFade } from '@/components/florenza/effects/BlurFade';
import {
  fetchFeaturedBouquets,
  fetchActiveDiscounts,
  fetchBigRoseBouquets,
  fetchBalloons,
  fetchAuthorBouquets,
  fetchFeaturedReviews,
} from '@/lib/data';

export const metadata: Metadata = {
  title: 'Florenza — флористичний бутік в Ірпені',
  description:
    'Преміум авторська флористика. Тиха editorial-чутливість. Доставка по Ірпеню, Бучі, Гостомелю та ближньому Києву.',
  alternates: { canonical: '/' },
};

export const revalidate = 300;

const STORY_CHAPTERS = [
  {
    eyebrow: 'Підхід',
    title: 'Композиція з характером',
    body: 'Кожен букет — окрема історія. Ми не складаємо їх «під ключ» з готових шаблонів. Варвара читає привід, відчуває настрій, і потім обирає квіти. Через це навіть прості монобукети у нас виходять ні на що не схожими.',
  },
  {
    eyebrow: 'Палітра',
    title: 'Тонко налаштовані тони',
    body: 'Ми працюємо в редакторській палітрі — кремовий, шавлія, припилена троянда, глибокий ліс. Жодних агресивних кольорів. Букет має поєднуватися з інтер\'єром клієнтки, з її обличчям, з настроєм дня — не кричати про себе.',
  },
  {
    eyebrow: 'Деталь',
    title: 'Ручна обгортка та стрічка',
    body: 'Льон, крафт, оксамит, шовк — обираємо обгортку під кожен букет, ніколи не повторюємо механічно. Стрічка зав\'язується вручну, з вузликом у потрібному місці. Це 5 хвилин додаткової роботи, які роблять букет подарунком.',
  },
];

export default async function HomePage() {
  const [featured, discounts, bigRoses, balloons, authorShowcase, reviews] = await Promise.all([
    fetchFeaturedBouquets(8),
    fetchActiveDiscounts(6),
    fetchBigRoseBouquets(6),
    fetchBalloons(6),
    fetchAuthorBouquets(6),
    fetchFeaturedReviews(8),
  ]);

  return (
    <>
      <ScrollProgress />

      <EditorialHero
        eyebrow="Florenza · Ірпінь"
        title="Квіти, які говорять тихо"
        subtitle="Авторська флористика для тих, хто цінує тишу і деталь. Доставка по Ірпеню, Бучі, Гостомелю та ближньому Києву."
        imageUrl="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1600&q=85&auto=format&fit=crop"
        imageAlt="Букет півоній у льняній упаковці"
        ctaPrimary={{ label: 'Перейти до каталогу', href: '/buketu' }}
        ctaSecondary={{ label: 'Дізнатися більше', href: '/about' }}
      />

      <StatsRibbon />

      <BlurFade>
        <UspBento />
      </BlurFade>

      <SectionDivider variant="sprig" />

      <StoryStickySection
        imageUrl="https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1400&q=85&auto=format&fit=crop"
        imageAlt="Студія Florenza — робочий стіл флориста"
        chapters={STORY_CHAPTERS}
      />

      <SectionDivider variant="line" />

      {discounts.length > 0 && (
        <BlurFade>
          <SpecialOffersSection bouquets={discounts} />
        </BlurFade>
      )}

      {bigRoses.length > 0 && (
        <BlurFade>
          <BigRosesSection bouquets={bigRoses} />
        </BlurFade>
      )}

      {balloons.length > 0 && (
        <BlurFade>
          <BalloonsSection bouquets={balloons} />
        </BlurFade>
      )}

      <SectionDivider variant="dots" />

      <BlurFade>
        <section className="editorial-container py-24 md:py-32">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div className="max-w-xl">
              <p className="section-eyebrow mb-4">Каталог</p>
              <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] leading-tight text-[var(--color-deep-forest)]">
                Букети сезону
              </h2>
            </div>
            <MagneticButton href="/buketu" variant="ghost" className="self-start md:self-end">
              Усі букети →
            </MagneticButton>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
            {featured.map((b, i) => (
              <BouquetCard key={b.slug} bouquet={b} index={i} />
            ))}
          </div>
        </section>
      </BlurFade>

      <section className="section-cream-soft py-24 md:py-32">
        <div className="editorial-container">
          <BlurFade>
            <header className="text-center mb-14 max-w-xl mx-auto flex flex-col items-center">
              <p className="section-eyebrow mb-4">Що пишуть</p>
              <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] leading-tight text-[var(--color-deep-forest)]">
                Відгуки клієнтів
              </h2>
              <p className="mt-6 text-[var(--color-text-secondary)] leading-relaxed">
                Понад 1 200 букетів за рік. Ось що пишуть ті, для кого ми складали композиції.
              </p>
            </header>
          </BlurFade>
          <ReviewsMarquee reviews={reviews} />
        </div>
      </section>

      <SectionDivider variant="sprig" />

      <BlurFade>
        <OccasionShowcase bouquets={authorShowcase} />
      </BlurFade>
    </>
  );
}
