import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V07 · Margiela · Experimental type' };
export const revalidate = 300;

export default async function V07() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: '#fbfbf9', color: '#111' }}>
      {/* Hero — typography out-of-grid, numbered like Margiela tags */}
      <section className="min-h-screen relative px-6 md:px-12 py-24 flex flex-col justify-between">
        {/* Top bar — numbered system */}
        <div className="grid grid-cols-12 gap-2 text-[10px] font-mono">
          {Array.from({ length: 25 }, (_, i) => (
            <span
              key={i}
              className={`px-1 py-0.5 ${i === 0 ? 'bg-black text-white' : 'opacity-30'}`}
              style={{ writingMode: 'horizontal-tb' }}
            >
              {String(i).padStart(2, '0')}
            </span>
          ))}
        </div>

        {/* Center: rotated, off-grid type */}
        <div className="relative">
          <h1
            className="font-[var(--font-display)] tracking-[-0.05em] leading-[0.85]"
            style={{
              fontSize: 'clamp(4rem, 13vw, 14rem)',
              fontVariationSettings: "'opsz' 144, 'wght' 250",
              fontWeight: 250,
            }}
          >
            <span className="block">Florenza</span>
            <span
              className="block ml-[15%] -mt-4"
              style={{ fontStyle: 'italic', fontWeight: 280 }}
            >
              ⌜the&nbsp;flower&nbsp;collection⌝
            </span>
            <span
              className="block opacity-30 ml-[8%] -mt-3"
              style={{ fontWeight: 250 }}
            >
              maison · 2026
            </span>
          </h1>
          {/* Annotations like garment tags */}
          <div className="absolute right-0 top-1/3 hidden md:block">
            <div className="border border-black px-3 py-2 font-mono text-[10px] uppercase tracking-wider">
              <p>Lot 042</p>
              <p>Spring · Ірпінь</p>
            </div>
          </div>
          <div className="absolute right-[5%] bottom-0 hidden md:block">
            <div className="border border-black px-3 py-2 font-mono text-[10px] uppercase tracking-wider rotate-[-2deg]">
              <p>F-01 · «À la main»</p>
            </div>
          </div>
        </div>

        {/* Bottom: minimal CTA */}
        <div className="grid grid-cols-12 gap-4 items-end mt-12">
          <div className="col-span-12 md:col-span-4">
            <p className="text-xs leading-[1.85] max-w-xs">
              Композиції з імпортних квітів. Авторська флористика. Без шаблонів.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 text-right">
            <Link
              href="/buketu"
              className="inline-block border-t border-black pt-2 text-[10px] uppercase tracking-[0.42em]"
            >
              <span className="block opacity-50">→</span>
              Catalogue · all 36
            </Link>
          </div>
        </div>
      </section>

      {/* Tagged catalog — each card has Margiela-style numbered tag */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="grid grid-cols-12 gap-4 mb-20">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em]">
              · 0/3 ·
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] mt-1 opacity-50">
              ·· catalog ··
            </p>
          </div>
          <h2 className="col-span-12 md:col-span-9 font-[var(--font-display)] text-5xl md:text-6xl tracking-tight leading-[0.95]">
            Items <em style={{ fontStyle: 'italic' }}>in</em> rotation.
          </h2>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-12">
          {featured.slice(0, 8).map((b, i) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block relative">
              {/* Margiela-style tag */}
              <div className="absolute top-3 left-3 z-10 bg-white border border-black/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wider">
                <p>F-{String(i + 1).padStart(3, '0')}</p>
                <p className="opacity-50">{b.preparationHours ?? 1}h prep</p>
              </div>
              <div className="relative aspect-[3/4] overflow-hidden bg-[#eee]">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <p className="text-xs leading-tight">{b.name}</p>
                <p className="text-xs text-right opacity-60">
                  {b.price.toLocaleString('uk-UA')} ₴
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Long, single-line typographic break */}
      <section className="border-y border-black overflow-hidden py-1">
        <p
          className="font-[var(--font-display)] text-3xl md:text-5xl whitespace-nowrap"
          style={{ fontVariationSettings: "'opsz' 144, 'wght' 250" }}
        >
          ✦ Авторська флористика ⌜since 2026⌝ ✦ Авторська флористика ⌜since 2026⌝ ✦
          Авторська флористика ⌜since 2026⌝ ✦
        </p>
      </section>

      {/* Roses — diptych with text overlap */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7 relative">
            {bigRoses[0] && (
              <div className="relative aspect-[4/5]">
                <Image
                  src={bigRoses[0].primaryImageUrl}
                  alt={bigRoses[0].imageAlt}
                  fill
                  sizes="60vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-5 md:-ml-24 relative z-10 flex items-center">
            <div className="bg-white p-8 md:p-12 border border-black/10">
              <p className="font-mono text-[10px] uppercase tracking-[0.42em] mb-6">
                Lot · 0/101
              </p>
              <h2 className="font-[var(--font-display)] text-4xl md:text-5xl leading-[0.95] mb-6 tracking-tight">
                Cent <em style={{ fontStyle: 'italic' }}>+1</em> roses.
              </h2>
              <p className="text-sm leading-relaxed opacity-75 mb-8">
                51, 75, 101, 151, 201, 301. Купуйте за кількістю — не за шаблоном.
              </p>
              <Link
                href="/buketu?type=veliki-troyandy"
                className="font-mono text-[10px] uppercase tracking-[0.42em] border-b border-black pb-1"
              >
                → all in series
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 md:px-12 grid grid-cols-12 gap-4 border-t border-black">
        <p className="col-span-6 font-mono text-[10px] uppercase tracking-[0.32em]">
          Florenza · F-01 · Made in Irpin
        </p>
        <p className="col-span-6 text-right font-mono text-[10px] uppercase tracking-[0.32em] opacity-50">
          ✶ catalogue 2026 — fin ✶
        </p>
      </footer>
    </main>
  );
}
