import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V18 · Italian villa · Terracotta' };
export const revalidate = 300;

const TERRA = '#c66c4e';
const TERRA_DEEP = '#8a3f25';
const STONE = '#e6dcc8';
const OLIVE = '#7a8554';
const INK = '#3a221a';

export default async function V18() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main
      style={{
        background: STONE,
        color: INK,
      }}
    >
      {/* Hero — sun-baked Tuscan feel with arched frame */}
      <section className="relative min-h-screen pt-12 px-6 md:px-12 pb-16">
        {/* Decorative arch */}
        <div className="max-w-7xl mx-auto">
          <p
            className="text-[11px] uppercase tracking-[0.5em] mb-12 text-center"
            style={{ color: TERRA_DEEP }}
          >
            ✦ Casa Florenza · Ірпінь ✦ Florists since 2026 ✦
          </p>

          <div className="relative grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-7">
              <h1
                className="font-[var(--font-display)] leading-[0.95] tracking-[-0.025em] mb-8"
                style={{
                  fontSize: 'clamp(3rem, 9vw, 8rem)',
                  fontVariationSettings: "'opsz' 144, 'wght' 350",
                }}
              >
                Bouquets
                <br />
                <em style={{ fontStyle: 'italic', color: TERRA_DEEP }}>baked in</em>
                <br />
                sunlight.
              </h1>
              <p
                className="text-base md:text-lg max-w-md leading-[1.85] mb-10"
                style={{ color: '#5c4030' }}
              >
                Сезонні квіти у південному настрої. Терракота, олива, теплий камінь.
                Доставка по Ірпеню за годину.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/buketu"
                  className="inline-block px-7 py-3 rounded-full text-sm uppercase tracking-[0.32em] font-medium"
                  style={{ background: TERRA, color: STONE }}
                >
                  Il catalogo →
                </Link>
                <Link
                  href="/about"
                  className="inline-block px-7 py-3 rounded-full text-sm uppercase tracking-[0.32em] font-medium border-2"
                  style={{ borderColor: TERRA, color: TERRA }}
                >
                  La casa
                </Link>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 relative">
              {/* Image inside arched frame */}
              <div className="relative aspect-[3/4]">
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    borderRadius: '50% 50% 0 0',
                    border: `4px solid ${TERRA}`,
                  }}
                >
                  {featured[0] && (
                    <Image
                      src={featured[0].primaryImageUrl}
                      alt={featured[0].imageAlt}
                      fill
                      priority
                      sizes="40vw"
                      className="object-cover"
                      style={{ filter: 'saturate(1.1) contrast(1.05) sepia(0.05)' }}
                    />
                  )}
                </div>
                {/* Terra column */}
                <div
                  className="absolute -left-6 bottom-0 top-1/3 w-3"
                  style={{ background: TERRA_DEEP }}
                />
                <div
                  className="absolute -right-6 bottom-0 top-1/3 w-3"
                  style={{ background: TERRA_DEEP }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wide horizontal photo with quote overlay */}
      <section className="relative h-[60svh] overflow-hidden">
        {bigRoses[0] && (
          <Image
            src={bigRoses[0].primaryImageUrl}
            alt={bigRoses[0].imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: 'saturate(0.95) contrast(1.05) sepia(0.08)' }}
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(58,34,26,0.5), rgba(58,34,26,0.1))' }} />
        <div className="relative z-10 h-full flex items-end px-6 md:px-12 pb-12 max-w-5xl mx-auto">
          <p
            className="font-[var(--font-display)] text-2xl md:text-4xl leading-tight"
            style={{
              color: STONE,
              fontStyle: 'italic',
              fontVariationSettings: "'opsz' 144, 'wght' 320",
            }}
          >
            «I fiori parlano il linguaggio dei luoghi
            <br />— ми чуємо їх».
          </p>
        </div>
      </section>

      {/* Catalog — terracotta tile grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.5em] mb-4" style={{ color: TERRA }}>
            Il catalogo · 36 bouquets
          </p>
          <h2 className="font-[var(--font-display)] text-5xl md:text-6xl">
            <em style={{ fontStyle: 'italic', color: TERRA_DEEP }}>Bouquets</em> della casa
          </h2>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {featured.slice(0, 6).map((b, i) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="group block"
            >
              <div
                className="relative aspect-[3/4] overflow-hidden"
                style={{
                  borderRadius: i % 2 === 0 ? '50% 50% 12px 12px' : '12px',
                  border: `3px solid ${TERRA}`,
                }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ filter: 'saturate(1.05) sepia(0.05)' }}
                />
              </div>
              <div className="mt-4 text-center">
                <h3
                  className="font-[var(--font-display)] text-xl"
                  style={{ fontStyle: 'italic' }}
                >
                  {b.name}
                </h3>
                <p className="text-sm mt-1" style={{ color: TERRA_DEEP }}>
                  {b.price.toLocaleString('uk-UA')} ₴
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Olive grove balloons section */}
      <section
        className="py-24 px-6 md:px-12"
        style={{ background: OLIVE, color: STONE }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.5em] opacity-80 mb-6">
              Palloncini · sets gioiosi
            </p>
            <h2
              className="font-[var(--font-display)] leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              <em style={{ fontStyle: 'italic' }}>Allegria</em>
              <br />
              in helium.
            </h2>
            <Link
              href="/buketu?type=shari"
              className="inline-block mt-4 px-7 py-3 rounded-full text-sm uppercase tracking-[0.32em] font-medium"
              style={{ background: STONE, color: OLIVE }}
            >
              Tutti i set →
            </Link>
          </div>
          <div className="col-span-12 md:col-span-7 grid grid-cols-3 gap-3">
            {balloons.slice(0, 3).map((b) => (
              <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
                <div
                  className="relative aspect-[3/4] overflow-hidden"
                  style={{ borderRadius: '12px', border: `2px solid ${STONE}` }}
                >
                  <Image
                    src={b.primaryImageUrl}
                    alt={b.imageAlt}
                    fill
                    sizes="20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-16 text-center px-6" style={{ background: TERRA, color: STONE }}>
        <p
          className="font-[var(--font-display)] text-3xl mb-3"
          style={{ fontStyle: 'italic' }}
        >
          ✦ Casa Florenza ✦
        </p>
        <p className="text-[11px] uppercase tracking-[0.5em] opacity-80">
          Ірпінь · Україна · MMXXVI
        </p>
      </footer>
    </main>
  );
}
