import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';
import { FadeUp } from '@/components/florenza/effects/FadeUp';

export const metadata = { title: 'V01 · Aesop · Quiet minimalism' };
export const revalidate = 300;

export default async function V01() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: '#f5f0e8', color: '#2c3e2d' }}>
      {/* Hero — narrow centered column, generous whitespace */}
      <section className="min-h-[88svh] flex items-center justify-center px-6">
        <div className="max-w-2xl text-center py-32">
          <p className="text-[10px] uppercase tracking-[0.42em] mb-12 opacity-60">
            Florenza · Ірпінь · est. 2026
          </p>
          <h1
            className="font-[var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] leading-[1.08] font-light"
            style={{ fontVariationSettings: "'opsz' 144, 'wght' 280" }}
          >
            Тиха флористика.
            <br />
            <em className="not-italic" style={{ fontStyle: 'italic', fontWeight: 320 }}>
              Без надмірності.
            </em>
          </h1>
          <p className="mt-12 text-base leading-[1.85] opacity-70 max-w-md mx-auto">
            Авторські композиції в палітрі бренду. Доставка по Ірпеню, Бучі та Гостомелю
            від однієї години.
          </p>
          <div className="mt-16 inline-block">
            <Link
              href="/buketu"
              className="text-xs uppercase tracking-[0.3em] border-b border-current pb-1 hover:opacity-60 transition-opacity"
            >
              Каталог
            </Link>
          </div>
        </div>
      </section>

      <hr className="border-0 h-px bg-[#2c3e2d] opacity-10 mx-12" />

      {/* Featured grid — sparse, oversized images, no cards */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <FadeUp>
          <header className="mb-24 text-center">
            <p className="text-[10px] uppercase tracking-[0.42em] opacity-60 mb-4">
              Каталог
            </p>
            <h2 className="font-[var(--font-display)] text-4xl font-light">
              Букети сезону
            </h2>
          </header>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          {featured.slice(0, 6).map((b, i) => (
            <FadeUp key={b.slug} delay={(i % 3) * 0.12}>
              <Link href={`/buket/${b.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden mb-8">
                  <Image
                    src={b.primaryImageUrl}
                    alt={b.imageAlt}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]"
                  />
                </div>
                <p className="text-xs uppercase tracking-[0.22em] opacity-55 mb-2">
                  Авторський
                </p>
                <h3 className="font-[var(--font-display)] text-xl mb-1 font-light">
                  {b.name}
                </h3>
                <p className="text-sm opacity-70">{b.price.toLocaleString('uk-UA')} грн</p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Roses callout — single line, full-width */}
      <section className="py-32 px-6 text-center border-y border-[#2c3e2d]/10 my-12">
        <p className="text-[10px] uppercase tracking-[0.42em] opacity-60 mb-6">
          Колекція
        </p>
        <h2 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight max-w-3xl mx-auto">
          51 троянда. 101. 201.
          <br />
          <em style={{ fontStyle: 'italic' }}>Жест, що залишається.</em>
        </h2>
        <Link
          href="/buketu?type=veliki-troyandy"
          className="inline-block mt-10 text-xs uppercase tracking-[0.3em] border-b border-current pb-1 hover:opacity-60"
        >
          Переглянути
        </Link>
      </section>

      {/* Balloons — minimal text-driven row */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16">
          {balloons.slice(0, 3).map((b) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden mb-4">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="(min-width: 768px) 30vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="text-sm opacity-80">{b.name}</p>
              <p className="text-xs opacity-55 mt-1">
                {b.price.toLocaleString('uk-UA')} грн
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing — single line of type */}
      <section className="py-40 text-center px-6">
        <p className="font-[var(--font-display)] text-2xl md:text-3xl font-light max-w-xl mx-auto leading-relaxed">
          Кожен букет складається вручну.
          <br />
          Жодних шаблонів.
        </p>
      </section>
    </main>
  );
}
