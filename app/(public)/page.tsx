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
import { BouquetOfTheDay } from '@/components/florenza/BouquetOfTheDay';
import { ProcessSection } from '@/components/florenza/ProcessSection';
import { InventoryTicker } from '@/components/florenza/InventoryTicker';
import { WhyFlorenza } from '@/components/florenza/WhyFlorenza';
import { FloristsDiary } from '@/components/florenza/FloristsDiary';
import { FaqSection } from '@/components/florenza/FaqSection';
import { MessengerOrder } from '@/components/florenza/MessengerOrder';
import { PhotoMosaic } from '@/components/florenza/PhotoMosaic';
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

// Server-render on every request — DB is unavailable during docker build,
// so static prerendering would bake in empty bouquet arrays.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    body: 'Кожен букет — окрема історія. Ми не складаємо їх «під ключ» з готових шаблонів. Спочатку — привід і настрій, потім — квіти. Через це навіть прості монобукети виходять ні на що не схожими.',
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

  // Pick today's featured bouquet — first non-discounted authored one
  const bouquetOfTheDay = authorShowcase[0] ?? featured[0];

  return (
    <>
      <EditorialHero
        eyebrow="Florenza · Ірпінь"
        title="Квіти, які говорять тихо"
        subtitle="Авторська флористика для тих, хто цінує тишу і деталь. Доставка по Ірпеню, Бучі, Гостомелю та ближньому Києву."
        imageUrl="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1600&q=85&auto=format&fit=crop"
        imageAlt="Букет півоній у льняній упаковці"
        ctaPrimary={{ label: 'Перейти до каталогу', href: '/buketu' }}
        ctaSecondary={{ label: 'Дізнатися більше', href: '/about' }}
      />

      <InventoryTicker />

      <StatsRibbon />

      <WhyFlorenza />

      <BlurFade>
        <UspBento />
      </BlurFade>

      <SectionDivider variant="sprig" />

      <StoryStickySection
        imageUrl="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1400&q=88&auto=format&fit=crop"
        imageAlt="Білі півонії в студії Florenza"
        chapters={STORY_CHAPTERS}
      />

      <SectionDivider variant="line" />

      {bouquetOfTheDay && <BouquetOfTheDay bouquet={bouquetOfTheDay} />}

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

      <ProcessSection />

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
              <div
                key={b.slug}
                className="bg-[rgba(245,240,232,0.88)] backdrop-blur-sm rounded-[var(--radius-lg)] p-3 shadow-[0_8px_30px_rgba(40,30,40,0.15)]"
              >
                <BouquetCard bouquet={b} index={i} />
              </div>
            ))}
          </div>
        </section>
      </BlurFade>

      <section className="py-24 md:py-32 relative">
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

      <PhotoMosaic />

      <SectionDivider variant="sprig" />

      <FloristsDiary />

      <SectionDivider variant="line" />

      <FaqSection />

      <SectionDivider variant="dots" />

      <BlurFade>
        <OccasionShowcase bouquets={authorShowcase} />
      </BlurFade>

      <MessengerOrder />
    </>
  );
}
