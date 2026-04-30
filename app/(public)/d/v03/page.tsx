import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V03 · Burberry · Cinematic' };
export const revalidate = 300;

export default async function V03() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: '#0e0d0c', color: '#f0e7da' }}>
      {/* Hero — full-bleed cinematic image with letterbox */}
      <section className="relative h-[100svh] overflow-hidden">
        {featured[0] && (
          <Image
            src={featured[0].primaryImageUrl}
            alt={featured[0].imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* Cinematic overlay + letterbox */}
        <div className="absolute inset-x-0 top-0 h-[8svh] bg-[#0e0d0c]" />
        <div className="absolute inset-x-0 bottom-0 h-[8svh] bg-[#0e0d0c]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(14,13,12,0.85) 100%)',
          }}
        />

        {/* Centered minimal text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.6em] mb-8 opacity-70">
            Florenza
          </p>
          <h1
            className="font-[var(--font-display)] text-[clamp(2.5rem,7vw,7rem)] leading-[0.95] font-light"
            style={{
              fontVariationSettings: "'opsz' 144, 'wght' 280",
              textShadow: '0 4px 30px rgba(0,0,0,0.4)',
            }}
          >
            A NEW
            <br />
            <em style={{ fontStyle: 'italic' }}>chapter</em> in flowers
          </h1>
          <p className="text-xs uppercase tracking-[0.42em] mt-12 opacity-60">
            Spring 2026 · Ukraine
          </p>
          <Link
            href="/buketu"
            className="mt-16 px-12 py-4 border border-[#f0e7da]/60 text-xs uppercase tracking-[0.4em] hover:bg-[#f0e7da] hover:text-[#0e0d0c] transition-colors duration-500"
          >
            Discover the collection
          </Link>
        </div>

        {/* Bottom credit line */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-between px-6 md:px-16 text-[10px] uppercase tracking-[0.4em] opacity-50">
          <span>01 / 04 — Spring opening</span>
          <span>Made in Irpin · Ukraine</span>
        </div>
      </section>

      {/* Chapter 1 — full-bleed photo with overlay text */}
      <section className="relative h-[100svh] overflow-hidden">
        {bigRoses[0] && (
          <Image
            src={bigRoses[0].primaryImageUrl}
            alt={bigRoses[0].imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(14,13,12,0.65) 0%, rgba(14,13,12,0.4) 50%, rgba(14,13,12,0.85) 100%)',
          }}
        />
        <div className="absolute inset-0 flex items-end px-6 md:px-16 py-20">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-70">
              Chapter II
            </p>
            <h2
              className="font-[var(--font-display)] text-[clamp(2.5rem,6vw,5.5rem)] leading-[1] font-light"
              style={{ fontVariationSettings: "'opsz' 144, 'wght' 320" }}
            >
              The grand
              <br />
              gesture, redefined.
            </h2>
            <p className="mt-8 text-base leading-relaxed max-w-xl opacity-80">
              101 троянда не як штамп, а як твердження. Преміум червона троянда 60 см,
              крафтова обгортка ручної роботи, оксамитова стрічка. Збирається за добу.
            </p>
            <Link
              href="/buketu?type=veliki-troyandy"
              className="inline-block mt-10 text-xs uppercase tracking-[0.4em] border-b border-current pb-1"
            >
              Великі букети →
            </Link>
          </div>
        </div>
      </section>

      {/* Product grid — minimal dark cards */}
      <section className="py-32 px-6 md:px-16 max-w-[1600px] mx-auto">
        <header className="mb-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.6em] mb-6 opacity-70">
            Chapter III
          </p>
          <h2 className="font-[var(--font-display)] text-5xl md:text-6xl font-light">
            <em style={{ fontStyle: 'italic' }}>The Edit</em>
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-20">
          {featured.slice(0, 6).map((b, i) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-3">
                №{String(i + 1).padStart(2, '0')}
              </p>
              <div className="flex items-baseline justify-between">
                <h3 className="font-[var(--font-display)] text-xl">{b.name}</h3>
                <p className="text-sm opacity-70">
                  {b.price.toLocaleString('uk-UA')} грн
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cinematic close */}
      <section className="h-[80svh] relative overflow-hidden flex items-center justify-center">
        {balloons[0] && (
          <Image
            src={balloons[0].primaryImageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-[#0e0d0c]/60" />
        <div className="relative z-10 text-center px-6">
          <p
            className="font-[var(--font-display)] text-[clamp(2rem,5vw,4rem)] leading-tight font-light max-w-3xl mx-auto"
            style={{ fontStyle: 'italic' }}
          >
            «Quiet on its own. Powerful in person».
          </p>
          <p className="text-[10px] uppercase tracking-[0.6em] mt-12 opacity-70">
            Florenza · Spring 2026
          </p>
        </div>
      </section>
    </main>
  );
}
