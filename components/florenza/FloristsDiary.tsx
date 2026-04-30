import Image from 'next/image';
import Link from 'next/link';
import { BlurFade } from './effects/BlurFade';

const ENTRIES = [
  {
    date: '14 квітня',
    eyebrow: 'Notebook',
    title: 'Чому ми не любимо «букети-снопи»',
    excerpt:
      'Стандартний штамп «зробіть якнайбільше квіток» псує композицію. Натомість ми працюємо з трьома висотами — і букет дихає.',
    image:
      'https://images.unsplash.com/photo-1487070183336-b863922373d4?w=1000&q=85&auto=format&fit=crop',
    href: '/zhurnal',
  },
  {
    date: '08 квітня',
    eyebrow: 'Notebook',
    title: 'Що нам везуть з Голландії цього тижня',
    excerpt:
      'Свіжий завоз: півонії Sarah Bernhardt, троянди O\'Hara, дельфініум. Кожен букет складається з того, що сьогодні в найкращій формі.',
    image:
      'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1000&q=85&auto=format&fit=crop',
    href: '/zhurnal',
  },
  {
    date: '02 квітня',
    eyebrow: 'Notebook',
    title: 'Як подовжити життя букета на 2 дні',
    excerpt:
      'Косий зріз під холодною водою, чисті ножиці, поживний засіб (cryzal — у нас завжди безкоштовно). Дрібниці, які роблять різницю.',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1000&q=85&auto=format&fit=crop',
    href: '/zhurnal',
  },
];

/**
 * Mini-blog "Florist's Diary" preview — 3 editorial cards. Lives near the
 * bottom of the homepage to give the brand depth and a content hook for
 * SEO. Real entries fetched from BlogPosts collection later.
 */
export function FloristsDiary() {
  return (
    <section className="editorial-container py-24 md:py-32">
      <BlurFade>
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div className="max-w-xl">
            <p className="section-eyebrow mb-4">Florist&apos;s diary</p>
            <h2 className="font-[var(--font-display)] text-[clamp(2.25rem,4vw,3.5rem)] leading-tight text-[var(--color-deep-forest)]">
              Записки з квіткарні
            </h2>
            <p className="mt-4 text-base text-[var(--color-text-secondary)] leading-relaxed">
              Короткі нотатки про сезон, роботу з квітами, і дрібниці, які
              перетворюють букет на спогад.
            </p>
          </div>
          <Link
            href="/zhurnal"
            className="text-xs uppercase tracking-[0.32em] text-[var(--color-sage-deep)] border-b border-[var(--color-sage-deep)] pb-1 self-start md:self-end transition-colors hover:text-[var(--color-deep-forest)] hover:border-[var(--color-deep-forest)]"
          >
            Усі записи →
          </Link>
        </header>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
        {ENTRIES.map((e, i) => (
          <BlurFade key={e.title} delay={i * 0.12} yOffset={28}>
            <Link href={e.href} className="group block">
              <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-cream-soft)] mb-5 shadow-[0_4px_20px_rgba(44,62,45,0.06)]">
                <Image
                  src={e.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[var(--color-cream)]/95 backdrop-blur-sm text-[10px] uppercase tracking-[0.32em] text-[var(--color-sage-deep)]">
                  {e.eyebrow} · {e.date}
                </div>
              </div>
              <h3 className="font-[var(--font-display)] text-2xl leading-tight text-[var(--color-deep-forest)] mb-3 group-hover:text-[var(--color-sage-deep)] transition-colors">
                {e.title}
              </h3>
              <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
                {e.excerpt}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.32em] text-[var(--color-sage-deep)]">
                Читати далі →
              </p>
            </Link>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
