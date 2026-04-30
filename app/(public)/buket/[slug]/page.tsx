import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchBouquetBySlug, fetchAllBouquets } from '@/lib/data';
import { formatPrice } from '@/lib/utils/format';
import { DiscountTimer } from '@/components/florenza/DiscountTimer';
import { MagneticButton } from '@/components/florenza/MagneticButton';
import { BouquetCard } from '@/components/florenza/BouquetCard';
import { ProductSchema } from '@/components/seo/ProductSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Bouquet3DRotation } from '@/components/florenza/Bouquet3DRotation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bouquet = await fetchBouquetBySlug(slug);
  if (!bouquet) return { title: 'Не знайдено' };
  return {
    title: bouquet.metaTitle || bouquet.name,
    description: bouquet.metaDescription || bouquet.descriptionShort,
    alternates: { canonical: `/buket/${slug}` },
    openGraph: {
      title: bouquet.name,
      description: bouquet.descriptionShort,
      images: [bouquet.ogImage?.url || bouquet.primaryImage?.url].filter(Boolean) as string[],
    },
  };
}

export default async function BouquetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bouquet = await fetchBouquetBySlug(slug);
  if (!bouquet) notFound();

  const hasDiscount = (bouquet as any).discount?.enabled;
  const finalPrice = hasDiscount
    ? (bouquet as any).discount.type === 'percent'
      ? Math.round((bouquet as any).price * (1 - (bouquet as any).discount.amount / 100))
      : (bouquet as any).price - (bouquet as any).discount.amount
    : (bouquet as any).price;

  const photoSequence = (bouquet as any).photoSequence ?? [];
  const gallery = (bouquet as any).gallery ?? [];
  const related = await fetchAllBouquets({ status: { equals: 'published' } }, 4);

  return (
    <>
      <ProductSchema bouquet={bouquet} finalPrice={finalPrice} />
      <BreadcrumbSchema
        items={[
          { name: 'Головна', url: '/' },
          { name: 'Каталог', url: '/buketu' },
          { name: (bouquet as any).name, url: `/buket/${(bouquet as any).slug}` },
        ]}
      />

      <article className="editorial-container py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16">
          {/* Gallery */}
          <div>
            {photoSequence.length >= 4 ? (
              <Bouquet3DRotation
                images={photoSequence.map((p: any) => p.image?.url ?? '/images/placeholder.jpg')}
                alt={(bouquet as any).name}
              />
            ) : (
              <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)]">
                <Image
                  src={(bouquet as any).primaryImage?.url ?? '/images/placeholder.jpg'}
                  alt={(bouquet as any).name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            {gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.slice(0, 4).map((g: any, i: number) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-cream-soft)]"
                  >
                    <Image
                      src={g.image?.url ?? '/images/placeholder.jpg'}
                      alt={`${(bouquet as any).name} — ракурс ${i + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky info panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-2">
                {(bouquet as any).type?.name ?? 'Букет'}
              </p>
              <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--color-deep-forest)] leading-tight">
                {(bouquet as any).name}
              </h1>
            </div>

            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
              {(bouquet as any).descriptionShort}
            </p>

            <div className="flex items-baseline gap-3">
              {hasDiscount && (
                <span className="text-xl text-[var(--color-text-muted)] line-through">
                  {formatPrice((bouquet as any).price)}
                </span>
              )}
              <span className="text-3xl font-[var(--font-display)] text-[var(--color-deep-forest)]">
                {formatPrice(finalPrice)}
              </span>
            </div>

            {hasDiscount && (bouquet as any).discount.endAt && (
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-cream-soft)]">
                <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                  Знижка діє ще
                </p>
                <DiscountTimer endAt={(bouquet as any).discount.endAt} />
              </div>
            )}

            <div className="space-y-3">
              <MagneticButton href={`/checkout?bouquet=${(bouquet as any).slug}`} variant="primary" className="w-full">
                Замовити
              </MagneticButton>
              <MagneticButton href="#liya" variant="outline" className="w-full">
                Запитати в чаті
              </MagneticButton>
            </div>

            {/* Composition */}
            {(bouquet as any).composition && (bouquet as any).composition.length > 0 && (
              <details className="border-t border-[var(--color-border-soft)] pt-4">
                <summary className="cursor-pointer font-medium text-sm uppercase tracking-wider">
                  Склад букета
                </summary>
                <ul className="mt-4 space-y-2 text-[var(--color-text-secondary)]">
                  {(bouquet as any).composition.map((c: any, i: number) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{c.item}</span>
                      <span className="text-[var(--color-text-muted)]">×{c.count}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {/* Size */}
            {(bouquet as any).size && ((bouquet as any).size.heightCm || (bouquet as any).size.diameterCm) && (
              <details className="border-t border-[var(--color-border-soft)] pt-4">
                <summary className="cursor-pointer font-medium text-sm uppercase tracking-wider">
                  Розмір
                </summary>
                <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                  {(bouquet as any).size.heightCm && `Висота ${(bouquet as any).size.heightCm} см`}
                  {(bouquet as any).size.heightCm && (bouquet as any).size.diameterCm && ', '}
                  {(bouquet as any).size.diameterCm && `діаметр ${(bouquet as any).size.diameterCm} см`}
                </p>
              </details>
            )}

            {/* Preparation */}
            <div className="text-sm text-[var(--color-text-muted)]">
              Час підготовки: {(bouquet as any).preparationHours ?? 1} год.
              {(bouquet as any).preparationHours <= 2 && ' — можна на сьогодні.'}
            </div>
          </aside>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="editorial-container py-16 md:py-24 border-t border-[var(--color-border-soft)] mt-16">
          <h2 className="font-[var(--font-display)] text-2xl md:text-3xl text-[var(--color-deep-forest)] mb-10">
            З цим часто замовляють
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.slice(0, 4).map((b, i) => (
              <BouquetCard key={b.slug} bouquet={b} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
