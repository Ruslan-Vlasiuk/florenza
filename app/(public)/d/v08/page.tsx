import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V08 · Hermès · Retro premium' };
export const revalidate = 300;

const COGNAC = '#a0633a';
const COGNAC_DEEP = '#6b3d1f';
const PARCHMENT = '#f4ecd8';
const INK = '#2a1d10';

export default async function V08() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: PARCHMENT, color: INK }}>
      {/* Hero — classical layout with ornate flourishes */}
      <section
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${PARCHMENT} 0%, #ebd9b8 100%)`,
        }}
      >
        {/* Decorative top border */}
        <div className="border-b-2 border-double" style={{ borderColor: COGNAC }}>
          <div className="grid grid-cols-3 px-6 md:px-12 py-3 text-[10px] uppercase tracking-[0.42em]">
            <span>Maison · est. 2026</span>
            <span className="text-center" style={{ color: COGNAC_DEEP }}>
              ✦ Florenza ✦
            </span>
            <span className="text-right">Ірпінь · Україна</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 px-6 md:px-12 py-20">
          <div className="col-span-12 md:col-span-7 relative">
            {featured[0] && (
              <div className="relative aspect-[5/6] border-[6px]" style={{ borderColor: COGNAC }}>
                <Image
                  src={featured[0].primaryImageUrl}
                  alt={featured[0].imageAlt}
                  fill
                  priority
                  sizes="60vw"
                  className="object-cover"
                />
                <div
                  className="absolute -bottom-4 -right-4 px-6 py-3 border-2"
                  style={{ background: PARCHMENT, borderColor: COGNAC }}
                >
                  <p className="text-[10px] uppercase tracking-[0.42em]">N°01</p>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-5 flex items-center">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.6em] mb-8"
                style={{ color: COGNAC }}
              >
                ⊹ La maison florale ⊹
              </p>
              <h1
                className="font-[var(--font-display)] leading-[0.9]"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                  fontVariationSettings: "'opsz' 144, 'wght' 320",
                }}
              >
                <span style={{ fontStyle: 'italic', color: COGNAC_DEEP }}>Florenza</span>
                <br />
                fleurs &amp; cadeaux
              </h1>
              <div
                className="my-8 h-px w-24"
                style={{ background: COGNAC }}
              />
              <p className="text-base leading-[1.85] mb-10 opacity-85">
                Quatre saisons. Une seule maison. Авторська флористика з 1200+ букетів за
                рік. Доставка від однієї години.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/buketu"
                  className="inline-block px-8 py-4 text-xs uppercase tracking-[0.42em]"
                  style={{ background: COGNAC, color: PARCHMENT }}
                >
                  Catalogue
                </Link>
                <Link
                  href="/about"
                  className="inline-block px-8 py-4 text-xs uppercase tracking-[0.42em] border"
                  style={{ borderColor: COGNAC, color: COGNAC }}
                >
                  Notre histoire
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="border-t-2 border-double mx-6 md:mx-12"
          style={{ borderColor: COGNAC, opacity: 0.6 }}
        />
      </section>

      {/* Catalogue — framed cards with ornate dividers */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <div
            className="h-px w-12 mx-auto mb-4"
            style={{ background: COGNAC }}
          />
          <p
            className="text-[10px] uppercase tracking-[0.6em]"
            style={{ color: COGNAC }}
          >
            ⊹ La sélection ⊹
          </p>
          <h2 className="font-[var(--font-display)] text-5xl md:text-6xl mt-6">
            <em style={{ fontStyle: 'italic', color: COGNAC_DEEP }}>Bouquets</em> de la
            saison
          </h2>
          <div
            className="h-px w-12 mx-auto mt-6"
            style={{ background: COGNAC }}
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featured.slice(0, 6).map((b, i) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
              <div
                className="relative aspect-[3/4] overflow-hidden border-[3px]"
                style={{ borderColor: COGNAC }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="text-center mt-6">
                <p
                  className="text-[10px] uppercase tracking-[0.42em] mb-2"
                  style={{ color: COGNAC }}
                >
                  N° {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="font-[var(--font-display)] text-2xl mb-2"
                  style={{ fontStyle: 'italic' }}
                >
                  {b.name}
                </h3>
                <div
                  className="h-px w-8 mx-auto mb-3"
                  style={{ background: COGNAC, opacity: 0.6 }}
                />
                <p className="text-sm">{b.price.toLocaleString('uk-UA')} грн</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses — ornate framed callout */}
      <section
        className="py-24 px-6 md:px-12"
        style={{ background: COGNAC, color: PARCHMENT }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-[10px] uppercase tracking-[0.6em] mb-6"
            style={{ color: PARCHMENT, opacity: 0.85 }}
          >
            ⊹ Une promesse ⊹
          </p>
          <h2
            className="font-[var(--font-display)] leading-[1] mb-8"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontVariationSettings: "'opsz' 144, 'wght' 350",
            }}
          >
            <em style={{ fontStyle: 'italic' }}>Cent et une</em>
            <br />
            roses rouges.
          </h2>
          <p className="text-base leading-[1.85] max-w-md mx-auto opacity-90 mb-10">
            Pour les anniversaires, les promesses, et tout ce qui mérite plus que
            quelques mots.
          </p>
          <Link
            href="/buketu?type=veliki-troyandy"
            className="inline-block px-10 py-4 text-xs uppercase tracking-[0.42em]"
            style={{ background: PARCHMENT, color: COGNAC_DEEP }}
          >
            Découvrir →
          </Link>
        </div>
      </section>

      <footer
        className="py-16 text-center border-t-2 border-double"
        style={{ borderColor: COGNAC }}
      >
        <p className="font-[var(--font-display)] text-3xl mb-4" style={{ fontStyle: 'italic' }}>
          Florenza · Maison florale
        </p>
        <p
          className="text-[10px] uppercase tracking-[0.6em]"
          style={{ color: COGNAC }}
        >
          Ірпінь · Україна · MMXXVI
        </p>
      </footer>
    </main>
  );
}
