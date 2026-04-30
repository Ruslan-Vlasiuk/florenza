import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V25 · Cinematic widescreen' };
export const revalidate = 300;

export default async function V25() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: '#0a0a0a', color: '#f3eee5' }}>
      {/* Letterboxed hero with cinematic widescreen frame */}
      <section className="relative">
        <div className="aspect-[21/9] relative overflow-hidden">
          {featured[0] && (
            <Image
              src={featured[0].primaryImageUrl}
              alt={featured[0].imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ filter: 'contrast(1.05) saturate(0.92)' }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.7) 100%)',
            }}
          />

          {/* Cinematic top bar */}
          <div className="absolute top-0 inset-x-0 px-6 md:px-12 py-6 grid grid-cols-12 text-[10px] uppercase tracking-[0.42em]">
            <span className="col-span-4 opacity-80">∎ FLR · 01</span>
            <span className="col-span-4 text-center opacity-90">▸ Florenza presents</span>
            <span className="col-span-4 text-right opacity-80">21:9 · 24fps · Spring 2026</span>
          </div>

          {/* Centered title block */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.6em] mb-8 opacity-70">
                Coming Spring 2026
              </p>
              <h1
                className="font-[var(--font-display)] leading-[0.92]"
                style={{
                  fontSize: 'clamp(3rem, 9vw, 9rem)',
                  fontVariationSettings: "'opsz' 144, 'wght' 320",
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                }}
              >
                <em style={{ fontStyle: 'italic' }}>«flowers»</em>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.6em] mt-8 opacity-70">
                A short film by Florenza
              </p>
            </div>
          </div>

          {/* Bottom subtitle bar — like film subtitles */}
          <div
            className="absolute bottom-12 inset-x-0 px-6 text-center"
          >
            <p className="font-[var(--font-display)] text-lg md:text-2xl" style={{ fontStyle: 'italic' }}>
              «Ми зробили щось тихе, але дуже точне».
            </p>
          </div>
        </div>
      </section>

      {/* Frame counter scene navigator */}
      <section className="border-y border-white/10 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-12 items-center text-[10px] uppercase tracking-[0.42em]">
          <p className="col-span-3 opacity-70">▸ Now playing</p>
          <p className="col-span-6 text-center">
            ▸ Scene 01 — The opening — 00:00 / 03:42 ▸
          </p>
          <p className="col-span-3 text-right opacity-70">SCROLL ▼</p>
        </div>
      </section>

      {/* Scene 02: 6 horizontal frames stacked */}
      <section className="px-0 py-12 space-y-2">
        <header className="px-6 md:px-12 mb-8 max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.42em] opacity-70 mb-4">
            ▸ Scene 02 · The catalogue
          </p>
          <h2
            className="font-[var(--font-display)] text-5xl md:text-6xl"
            style={{ fontVariationSettings: "'opsz' 144, 'wght' 320" }}
          >
            <em style={{ fontStyle: 'italic' }}>The pieces</em>
          </h2>
        </header>
        {featured.slice(0, 4).map((b, i) => (
          <Link
            key={b.slug}
            href={`/buket/${b.slug}`}
            className="block relative aspect-[21/8] overflow-hidden group"
          >
            <Image
              src={b.primaryImageUrl}
              alt={b.imageAlt}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[2500ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]"
              style={{ filter: 'contrast(1.05) saturate(0.92)' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.1) 50%, rgba(10,10,10,0.5) 100%)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-6 md:px-16">
              <div>
                <p className="text-[10px] uppercase tracking-[0.42em] opacity-70 mb-2">
                  Frame {String(i + 1).padStart(3, '0')}
                </p>
                <h3
                  className="font-[var(--font-display)] text-3xl md:text-5xl leading-tight"
                  style={{ fontStyle: 'italic' }}
                >
                  {b.name}
                </h3>
              </div>
              <p
                className="font-[var(--font-display)] text-2xl md:text-3xl"
                style={{ fontStyle: 'italic' }}
              >
                {b.price.toLocaleString('uk-UA')} ₴
              </p>
            </div>
            {/* Subtitle at bottom */}
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs md:text-base text-center max-w-md">
              «Авторська композиція. Складена вручну.»
            </p>
          </Link>
        ))}
      </section>

      {/* Scene 03: Roses — letterboxed cinematic close-up */}
      <section className="my-12 relative aspect-[21/9] overflow-hidden">
        {bigRoses[2] && (
          <Image
            src={bigRoses[2].primaryImageUrl}
            alt={bigRoses[2].imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: 'contrast(1.1) saturate(1.1)' }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.7) 0%, transparent 50%, rgba(10,10,10,0.85) 100%)',
          }}
        />
        <div className="absolute top-0 inset-x-0 px-6 md:px-12 py-6 text-[10px] uppercase tracking-[0.42em]">
          ▸ Scene 03 · The big gesture
        </div>
        <div className="absolute inset-0 flex items-end justify-center px-6 pb-16">
          <div className="text-center">
            <h2
              className="font-[var(--font-display)] mb-6 leading-[0.95]"
              style={{
                fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                fontStyle: 'italic',
                textShadow: '0 4px 30px rgba(0,0,0,0.6)',
              }}
            >
              «one hundred and one»
            </h2>
            <Link
              href="/buketu?type=veliki-troyandy"
              className="inline-block px-10 py-3 border border-white/60 text-xs uppercase tracking-[0.42em] hover:bg-white hover:text-black transition-colors"
            >
              View collection
            </Link>
          </div>
        </div>
      </section>

      {/* Closing credits */}
      <footer className="py-32 text-center px-6">
        <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-60">
          ▸ Florenza · the end
        </p>
        <p
          className="font-[var(--font-display)] text-3xl md:text-5xl mb-12"
          style={{ fontStyle: 'italic' }}
        >
          «Спокій у квітах».
        </p>
        <div className="text-[10px] uppercase tracking-[0.42em] opacity-50 space-y-2">
          <p>Direction · Karakoy V.</p>
          <p>Florals · Florenza Studio</p>
          <p>Location · Ірпінь, Україна</p>
          <p className="opacity-30 mt-8">© MMXXVI · all rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
