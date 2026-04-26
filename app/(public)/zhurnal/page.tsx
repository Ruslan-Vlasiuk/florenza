import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBlogPosts } from '@/lib/data';
import { formatDateUk } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'Журнал',
  description:
    'Editorial-блог Florenza: гайди по догляду за квітами, тренди весільної флористики, історії з нашої майстерні.',
  alternates: { canonical: '/zhurnal' },
};

export const revalidate = 600;

export default async function BlogIndexPage() {
  const posts = await fetchBlogPosts(30);

  return (
    <div className="editorial-container py-12 md:py-20">
      <header className="mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)] mb-3">
          Журнал
        </p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--color-deep-forest)] max-w-2xl">
          Тексти про квіти, людей і деталі
        </h1>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--color-text-secondary)]">Поки що жодної статті. Ми почнемо незабаром.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {posts.map((p: any) => (
            <Link
              key={p.slug}
              href={`/zhurnal/${p.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)] mb-4">
                {p.heroImage?.url && (
                  <Image
                    src={p.heroImage.url}
                    alt={p.heroImage.alt ?? p.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                {p.publishedAt ? formatDateUk(p.publishedAt) : ''}
                {p.readingTimeMinutes && ` · ${p.readingTimeMinutes} хв`}
              </p>
              <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)] group-hover:text-[var(--color-deep-forest-soft)] transition-colors leading-tight">
                {p.title}
              </h2>
              {p.excerpt && (
                <p className="mt-3 text-[var(--color-text-secondary)] leading-relaxed text-sm line-clamp-3">
                  {p.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
