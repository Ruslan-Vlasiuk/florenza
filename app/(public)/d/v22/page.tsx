import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V22 · Parisian · Art nouveau' };
export const revalidate = 300;

const PARCH = '#f1e7d0';
const GOLD = '#a98538';
const GOLD_DEEP = '#7a5a1a';
const PLUM = '#6e3a55';
const INK = '#28201a';

// Reusable ornate SVG frame
function OrnateFrame() {
  return (
    <svg
      viewBox="0 0 200 60"
      aria-hidden="true"
      className="w-full"
      stroke={GOLD}
      strokeWidth="0.6"
      fill="none"
    >
      {/* Central flourish */}
      <path d="M100 30 q -4 -10 -12 -10 q -8 0 -10 6 q -1 4 4 4 q 6 0 8 -4" fill={GOLD} fillOpacity="0.18" />
      <path d="M100 30 q 4 -10 12 -10 q 8 0 10 6 q 1 4 -4 4 q -6 0 -8 -4" fill={GOLD} fillOpacity="0.18" />
      {/* Vines */}
      <path d="M0 30 L 60 30 q 20 -8 38 0" />
      <path d="M200 30 L 140 30 q -20 -8 -38 0" />
      {/* Tiny leaves */}
      <ellipse cx="40" cy="30" rx="6" ry="2" fill={GOLD} fillOpacity="0.4" />
      <ellipse cx="160" cy="30" rx="6" ry="2" fill={GOLD} fillOpacity="0.4" />
      <circle cx="100" cy="30" r="3" fill={GOLD} />
    </svg>
  );
}

export default async function V22() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: PARCH, color: INK }}>
      {/* Hero — ornate frame around centered hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-20">
        <div className="max-w-3xl w-full">
          <div className="opacity-80">
            <OrnateFrame />
          </div>
          <p
            className="text-center text-[11px] uppercase tracking-[0.5em] mt-6 mb-8"
            style={{ color: GOLD_DEEP }}
          >
            Florenza · Maison florale · Estd. MMXXVI
          </p>
          <h1
            className="font-[var(--font-display)] text-center leading-[0.95] mb-10"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontVariationSettings: "'opsz' 144, 'wght' 320",
            }}
          >
            <span style={{ fontStyle: 'italic', color: PLUM }}>Fleurs</span>
            <br />
            de Paris,
            <br />
            <span style={{ fontStyle: 'italic', color: GOLD_DEEP }}>en Ukraine</span>.
          </h1>
          <p className="text-center text-base md:text-lg max-w-md mx-auto leading-[1.85] opacity-85 mb-10">
            Авторська флористика в палітрі ар-нуво. Класичні композиції з імпортних
            квітів. Доставка від однієї години в Ірпінь.
          </p>
          <div className="text-center mb-10">
            <Link
              href="/buketu"
              className="inline-block px-10 py-3 text-xs uppercase tracking-[0.42em]"
              style={{ background: PLUM, color: PARCH }}
            >
              Le catalogue →
            </Link>
          </div>
          <div className="opacity-80 rotate-180">
            <OrnateFrame />
          </div>
        </div>

        {/* Decorative vine corners */}
        <svg
          aria-hidden="true"
          className="absolute top-12 left-12 w-32 h-32 opacity-50 pointer-events-none"
          viewBox="0 0 100 100"
          stroke={GOLD}
          strokeWidth="0.6"
          fill="none"
        >
          <path d="M0 0 q 30 0 50 30 q 20 30 50 30" />
          <ellipse cx="30" cy="20" rx="5" ry="2" fill={GOLD} fillOpacity="0.4" />
          <ellipse cx="60" cy="50" rx="5" ry="2" fill={GOLD} fillOpacity="0.4" />
          <circle cx="80" cy="70" r="2" fill={GOLD} />
        </svg>
        <svg
          aria-hidden="true"
          className="absolute bottom-12 right-12 w-32 h-32 opacity-50 pointer-events-none rotate-180"
          viewBox="0 0 100 100"
          stroke={GOLD}
          strokeWidth="0.6"
          fill="none"
        >
          <path d="M0 0 q 30 0 50 30 q 20 30 50 30" />
          <ellipse cx="30" cy="20" rx="5" ry="2" fill={GOLD} fillOpacity="0.4" />
          <ellipse cx="60" cy="50" rx="5" ry="2" fill={GOLD} fillOpacity="0.4" />
          <circle cx="80" cy="70" r="2" fill={GOLD} />
        </svg>
      </section>

      {/* Hero photo with ornate frame */}
      <section className="px-6 md:px-12 py-24 max-w-5xl mx-auto">
        {featured[0] && (
          <figure className="relative">
            <div
              className="relative aspect-[5/6]"
              style={{
                border: `8px double ${GOLD}`,
                padding: '12px',
                background: PARCH,
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={featured[0].primaryImageUrl}
                  alt={featured[0].imageAlt}
                  fill
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-cover"
                  style={{ filter: 'sepia(0.05) saturate(1.05)' }}
                />
              </div>
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-1"
                style={{ background: PARCH, color: GOLD_DEEP }}
              >
                <p className="font-[var(--font-display)] text-sm" style={{ fontStyle: 'italic' }}>
                  N° I
                </p>
              </div>
            </div>
            <figcaption className="mt-6 text-center font-[var(--font-display)] text-xl" style={{ fontStyle: 'italic' }}>
              {featured[0].name}, 2026
            </figcaption>
          </figure>
        )}
      </section>

      {/* Catalog — framed pieces */}
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <div className="opacity-70 max-w-md mx-auto">
            <OrnateFrame />
          </div>
          <p
            className="text-[11px] uppercase tracking-[0.5em] mt-6 mb-4"
            style={{ color: GOLD_DEEP }}
          >
            Le catalogue
          </p>
          <h2 className="font-[var(--font-display)] text-5xl md:text-6xl" style={{ fontStyle: 'italic' }}>
            Bouquets de saison
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featured.slice(0, 6).map((b, i) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
              <div
                className="relative aspect-[3/4]"
                style={{ border: `4px double ${GOLD}`, padding: '8px' }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={b.primaryImageUrl}
                    alt={b.imageAlt}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{ filter: 'sepia(0.05) saturate(1.05)' }}
                  />
                </div>
              </div>
              <div className="mt-5 text-center">
                <p
                  className="text-[11px] uppercase tracking-[0.42em] mb-2"
                  style={{ color: GOLD_DEEP }}
                >
                  N° {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="font-[var(--font-display)] text-xl mb-2"
                  style={{ fontStyle: 'italic' }}
                >
                  {b.name}
                </h3>
                <div className="mx-auto w-12 h-px" style={{ background: GOLD }} />
                <p className="mt-3 text-sm">{b.price.toLocaleString('uk-UA')} ₴</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses statement with full ornate framing */}
      <section
        className="py-24 px-6 md:px-12 text-center"
        style={{ background: PLUM, color: PARCH }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="opacity-80">
            <OrnateFrame />
          </div>
          <p className="text-[11px] uppercase tracking-[0.5em] mt-8 mb-6 opacity-80">
            Une collection particulière
          </p>
          <h2
            className="font-[var(--font-display)] mb-10 leading-[1.05]"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontStyle: 'italic',
              fontVariationSettings: "'opsz' 144, 'wght' 320",
            }}
          >
            Cinquante-et-une.
            <br />
            Cent-et-une.
            <br />
            Trois-cent-une roses.
          </h2>
          <Link
            href="/buketu?type=veliki-troyandy"
            className="inline-block px-10 py-3 text-xs uppercase tracking-[0.42em]"
            style={{ background: GOLD, color: INK }}
          >
            Découvrir →
          </Link>
        </div>
      </section>

      <footer className="py-16 text-center">
        <p
          className="font-[var(--font-display)] text-3xl mb-3"
          style={{ fontStyle: 'italic', color: GOLD_DEEP }}
        >
          Florenza
        </p>
        <p className="text-[11px] uppercase tracking-[0.5em] opacity-65">
          Maison florale · Ірпінь · Україна
        </p>
      </footer>
    </main>
  );
}
