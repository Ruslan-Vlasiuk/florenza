import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V05 · Loewe · Bold blocks' };
export const revalidate = 300;

const ACCENT = '#c84a32';
const CREAM = '#f3e8d6';
const INK = '#1a1612';

export default async function V05() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: CREAM, color: INK }}>
      {/* Hero — split bold colour block + image */}
      <section className="grid grid-cols-12 min-h-[88svh]">
        <div
          className="col-span-12 md:col-span-7 flex items-end px-6 md:px-12 pb-16 md:pb-24 pt-16"
          style={{ background: ACCENT, color: CREAM }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.42em] mb-12 opacity-90">
              Florenza · Vol. 01
            </p>
            <h1
              className="font-[var(--font-display)] text-[clamp(3.5rem,11vw,12rem)] leading-[0.85] tracking-[-0.04em]"
              style={{ fontVariationSettings: "'opsz' 144, 'wght' 700" }}
            >
              Loud
              <br />
              flowers
              <br />
              quietly
              <br />
              made.
            </h1>
            <Link
              href="/buketu"
              className="inline-block mt-16 px-10 py-5 bg-[var(--cream)] text-[var(--ink)] text-xs uppercase tracking-[0.42em] font-medium"
              style={{ background: CREAM, color: INK }}
            >
              The collection →
            </Link>
          </div>
        </div>
        <div className="col-span-12 md:col-span-5 relative aspect-square md:aspect-auto">
          {featured[0] && (
            <Image
              src={featured[0].primaryImageUrl}
              alt={featured[0].imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
      </section>

      {/* Big text marquee strip */}
      <section
        className="py-6 overflow-hidden"
        style={{ background: INK, color: CREAM }}
      >
        <p
          className="font-[var(--font-display)] text-3xl md:text-5xl whitespace-nowrap tracking-tight"
          style={{ fontVariationSettings: "'opsz' 144, 'wght' 600" }}
        >
          ✿ Преміум флористика · 1200+ букетів · Доставка 60 хв · Ірпінь / Буча /
          Гостомель · ✿ Преміум флористика · 1200+ букетів · Доставка 60 хв ·
        </p>
      </section>

      {/* Block grid catalogue */}
      <section className="py-24 px-6 md:px-12">
        <header className="mb-20 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.42em] mb-4">Каталог</p>
          <h2 className="font-[var(--font-display)] text-5xl md:text-7xl tracking-[-0.03em] leading-[0.95]">
            Spring favourites.
          </h2>
        </header>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.slice(0, 8).map((b, i) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className={`group block ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <div
                className={`relative ${i === 0 ? 'aspect-square' : 'aspect-[3/4]'} overflow-hidden mb-3`}
                style={{ background: i % 3 === 0 ? ACCENT : INK }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex items-baseline justify-between">
                <p className={`${i === 0 ? 'text-2xl' : 'text-base'} font-[var(--font-display)]`}>
                  {b.name}
                </p>
                <p className="text-xs opacity-70">
                  {b.price.toLocaleString('uk-UA')} грн
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses block — solid colour CTA */}
      <section
        className="py-24 px-6 md:px-12"
        style={{ background: INK, color: CREAM }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5 flex items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.42em] mb-6" style={{ color: ACCENT }}>
                Великі букети троянд
              </p>
              <h2
                className="font-[var(--font-display)] text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight"
                style={{ fontVariationSettings: "'opsz' 144, 'wght' 650" }}
              >
                51 / 75 / 101 / 151 / 201 / 301
              </h2>
              <Link
                href="/buketu?type=veliki-troyandy"
                className="inline-block mt-12 px-10 py-5 text-xs uppercase tracking-[0.42em] font-medium"
                style={{ background: ACCENT, color: CREAM }}
              >
                Усі великі →
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-7 grid grid-cols-3 gap-3">
            {bigRoses.slice(0, 6).map((b) => (
              <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={b.primaryImageUrl}
                    alt={b.imageAlt}
                    fill
                    sizes="20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                </div>
                <p className="mt-2 text-xs uppercase tracking-wider opacity-80">
                  {b.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Balloon shelf with bold tags */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="font-[var(--font-display)] text-5xl md:text-6xl mb-16 leading-[0.95]">
          Шари &nbsp;
          <span style={{ color: ACCENT, fontStyle: 'italic' }}>+ atmosphere</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {balloons.slice(0, 6).map((b) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <span
                className="absolute top-3 left-3 px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
                style={{ background: ACCENT, color: CREAM }}
              >
                Set
              </span>
              <p className="mt-3 text-base font-[var(--font-display)]">{b.name}</p>
              <p className="text-sm opacity-65">
                {b.price.toLocaleString('uk-UA')} грн
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer
        className="py-16 px-6 md:px-12 text-center"
        style={{ background: ACCENT, color: CREAM }}
      >
        <p
          className="font-[var(--font-display)] text-3xl md:text-5xl tracking-tight"
          style={{ fontVariationSettings: "'opsz' 144, 'wght' 600" }}
        >
          ✿ Florenza · Made in Irpin ✿
        </p>
      </footer>
    </main>
  );
}
