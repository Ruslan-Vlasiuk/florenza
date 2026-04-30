import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V24 · Type as art' };
export const revalidate = 300;

export default async function V24() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main className="bg-white text-black overflow-hidden">
      {/* Hero — letterforms with images inside */}
      <section className="px-6 md:px-12 py-12">
        <p className="font-mono text-xs uppercase tracking-wider mb-12 max-w-7xl mx-auto opacity-50">
          Florenza · Spring 2026 · Catalogue
        </p>

        {/* Word "FLEUR" with image inside the letters via background-clip */}
        <div className="max-w-7xl mx-auto relative">
          <h1
            className="font-[var(--font-display)] tracking-[-0.06em] leading-[0.78]"
            style={{
              fontSize: 'clamp(7rem, 26vw, 26rem)',
              fontWeight: 700,
              backgroundImage: featured[0]
                ? `url(${featured[0].primaryImageUrl})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            FLEUR.
          </h1>
        </div>
      </section>

      {/* Subtitle row */}
      <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto grid grid-cols-12 gap-6 border-t border-b border-black">
        <div className="col-span-12 md:col-span-3">
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-50">
            Definition
          </p>
        </div>
        <div className="col-span-12 md:col-span-6">
          <p
            className="font-[var(--font-display)] text-2xl md:text-3xl leading-tight"
            style={{ fontStyle: 'italic' }}
          >
            ‘flower’, fr. lat. <em>flos, floris</em> — мова квітів,
            <br />
            якою у Florenza говорять щодня.
          </p>
        </div>
        <div className="col-span-12 md:col-span-3 text-right">
          <Link
            href="/buketu"
            className="inline-block font-mono text-xs uppercase tracking-wider border-b border-black pb-1"
          >
            36 entries →
          </Link>
        </div>
      </section>

      {/* Big "FLORENZA" word with image bg + giant catalog */}
      <section className="px-6 md:px-12 pt-16 pb-12">
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-[var(--font-display)] tracking-[-0.05em] leading-[0.85]"
            style={{
              fontSize: 'clamp(4rem, 14vw, 14rem)',
              fontWeight: 700,
            }}
          >
            CATALO—
            <br />
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>gue.</span>
          </h2>
        </div>
      </section>

      {/* Catalog — bouquet name as huge type, image as background */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-32 space-y-1">
        {featured.slice(0, 6).map((b, i) => (
          <Link
            key={b.slug}
            href={`/buket/${b.slug}`}
            className="block group relative border-b border-black overflow-hidden"
          >
            <div className="grid grid-cols-12 items-center px-2 py-6">
              <p className="col-span-1 font-mono text-xs">№{String(i + 1).padStart(2, '0')}</p>
              <div className="col-span-11 md:col-span-7">
                <h3
                  className="font-[var(--font-display)] tracking-[-0.04em] leading-[0.95] uppercase"
                  style={{
                    fontSize: 'clamp(2rem, 6vw, 5rem)',
                    fontWeight: 700,
                  }}
                >
                  {b.name}
                </h3>
              </div>
              <div className="hidden md:block col-span-3">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={b.primaryImageUrl}
                    alt={b.imageAlt}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                </div>
              </div>
              <p className="col-span-12 md:col-span-1 text-right font-mono text-sm mt-2 md:mt-0">
                ₴{b.price.toLocaleString('uk-UA')}
              </p>
            </div>
            {/* Hover state — slide image on top */}
            <div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            >
              <div className="relative w-full h-full">
                <Image
                  src={b.primaryImageUrl}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover opacity-30"
                />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Roses — type with rose image inside */}
      <section className="bg-black text-white px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-wider opacity-50 mb-6">
            Big roses · Selection 04
          </p>
          <h2
            className="font-[var(--font-display)] tracking-[-0.05em] leading-[0.85]"
            style={{
              fontSize: 'clamp(5rem, 18vw, 18rem)',
              fontWeight: 700,
              backgroundImage: bigRoses[2] ? `url(${bigRoses[2].primaryImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            101.
          </h2>
          <div className="mt-12 grid grid-cols-12 gap-6 items-end">
            <p className="col-span-12 md:col-span-6 text-base opacity-70 max-w-md">
              Преміум червоні троянди 60 см. Складаються вручну. У шовковій стрічці.
              Для жесту, який не вимагає слів.
            </p>
            <Link
              href="/buketu?type=veliki-troyandy"
              className="col-span-12 md:col-span-6 text-right font-mono text-sm border-b border-white inline-block self-end pb-1"
            >
              51, 75, 101, 151, 201, 301 →
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-8 max-w-7xl mx-auto grid grid-cols-12 border-t border-black">
        <p className="col-span-6 font-mono text-xs uppercase tracking-wider">
          Florenza · Type-as-art issue 01
        </p>
        <p className="col-span-6 text-right font-mono text-xs uppercase tracking-wider opacity-50">
          End. 2026.
        </p>
      </footer>
    </main>
  );
}
