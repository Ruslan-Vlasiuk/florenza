import type { Metadata } from 'next';
import { fetchAllBouquets } from '@/lib/data';
import { BouquetCard } from '@/components/florenza/BouquetCard';
import { CatalogFilters } from '@/components/florenza/CatalogFilters';

export const metadata: Metadata = {
  title: 'Каталог букетів',
  description:
    'Усі авторські букети Florenza: монобукети, композиції, сезонні. Доставка по Ірпеню, Бучі, Гостомелю.',
  alternates: { canonical: '/buketu' },
};

export const revalidate = 300;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filter: any = {};

  if (params.discount === 'true') {
    filter['discount.enabled'] = { equals: true };
  }

  const bouquets = await fetchAllBouquets(filter, 60);

  return (
    <div className="editorial-container py-12 md:py-16">
      <header className="mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Каталог
        </p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--color-deep-forest)] max-w-2xl">
          {params.discount === 'true' ? 'Спеціальні пропозиції' : 'Усі букети сезону'}
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        <aside className="hidden lg:block">
          <CatalogFilters />
        </aside>

        <div>
          {bouquets.length === 0 ? (
            <p className="text-[var(--color-text-secondary)]">
              Поки що букетів за вашими фільтрами немає. Спробуйте розширити критерії.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
              {bouquets.map((b, i) => (
                <BouquetCard key={b.slug} bouquet={b} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
