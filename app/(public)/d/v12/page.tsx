import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V12 · Linear · Dark glow' };
export const revalidate = 300;

const BG = '#08080b';
const SURFACE = '#101116';
const SURFACE_HI = '#1a1c24';
const GLOW = '#7b6dd6';
const GLOW_PINK = '#e85a8c';
const FG = '#e8e9ee';
const FG_DIM = '#9398a6';

export default async function V12() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: BG, color: FG }}>
      {/* Hero — dark with luminous glow */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Glow blobs */}
        <div
          className="absolute -top-[30%] -left-[20%] w-[80vw] h-[80vw] rounded-full opacity-50"
          style={{
            background: `radial-gradient(circle, ${GLOW} 0%, transparent 60%)`,
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute -bottom-[30%] -right-[20%] w-[60vw] h-[60vw] rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle, ${GLOW_PINK} 0%, transparent 60%)`,
            filter: 'blur(80px)',
          }}
        />

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${FG} 1px, transparent 1px), linear-gradient(90deg, ${FG} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-24 grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full self-start mb-8 text-xs"
              style={{ background: SURFACE_HI, color: FG_DIM }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#7b6dd6' }}
              />
              Live · Spring 2026
            </div>
            <h1
              className="font-[var(--font-display)] leading-[0.95] tracking-[-0.04em] mb-8"
              style={{
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontWeight: 350,
              }}
            >
              <span
                style={{
                  background: `linear-gradient(135deg, ${FG} 0%, ${GLOW} 50%, ${GLOW_PINK} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Florenza.
              </span>
              <br />
              <span style={{ color: FG_DIM, fontWeight: 280 }}>
                Built for moments.
              </span>
            </h1>
            <p className="text-lg max-w-md mb-10 leading-relaxed" style={{ color: FG_DIM }}>
              Авторські композиції на замовлення. AI-приймає замовлення цілодобово.
              Доставка через 60 хв.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/buketu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: GLOW,
                  color: FG,
                  boxShadow: `0 0 0 1px ${GLOW}, 0 8px 24px ${GLOW}55`,
                }}
              >
                Перейти →
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border"
                style={{
                  borderColor: SURFACE_HI,
                  color: FG,
                  background: 'transparent',
                }}
              >
                Дізнатись більше
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 relative">
            {/* Floating glassmorphism card */}
            {featured[0] && (
              <div
                className="relative rounded-2xl overflow-hidden p-2 border"
                style={{
                  background: 'rgba(26,28,36,0.6)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: `0 0 80px ${GLOW}30`,
                }}
              >
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  <Image
                    src={featured[0].primaryImageUrl}
                    alt={featured[0].imageAlt}
                    fill
                    priority
                    sizes="40vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <p className="text-xs" style={{ color: FG_DIM }}>
                    {featured[0].name}
                  </p>
                  <p className="font-mono text-xs" style={{ color: GLOW }}>
                    {featured[0].price.toLocaleString('uk-UA')} ₴
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Catalog — Linear-style table-like cards */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-12 flex items-end justify-between">
          <div>
            <p
              className="font-mono text-xs uppercase tracking-wider mb-2"
              style={{ color: GLOW }}
            >
              ./catalogue
            </p>
            <h2 className="font-[var(--font-display)] text-5xl">Bouquets</h2>
          </div>
          <Link
            href="/buketu"
            className="font-mono text-xs uppercase tracking-wider"
            style={{ color: GLOW }}
          >
            view all 36 →
          </Link>
        </header>
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            background: SURFACE,
          }}
        >
          {featured.slice(0, 6).map((b, i) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="block grid grid-cols-12 gap-4 px-6 py-5 group transition-colors hover:bg-[#1a1c24]"
              style={{
                borderBottom:
                  i < 5 ? '1px solid rgba(255,255,255,0.05)' : undefined,
              }}
            >
              <p className="col-span-1 font-mono text-xs flex items-center" style={{ color: FG_DIM }}>
                №{String(i + 1).padStart(2, '0')}
              </p>
              <div className="col-span-2 relative aspect-square rounded-md overflow-hidden">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="10vw"
                  className="object-cover"
                />
              </div>
              <div className="col-span-5 flex flex-col justify-center">
                <p className="font-[var(--font-display)] text-xl">{b.name}</p>
                <p className="text-xs mt-1" style={{ color: FG_DIM }}>
                  Авторський · подарунок · {b.preparationHours ?? 1}h prep
                </p>
              </div>
              <div className="col-span-2 flex items-center" style={{ color: FG_DIM }}>
                <p className="text-xs font-mono">in stock</p>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <p
                  className="text-base font-mono font-medium"
                  style={{ color: GLOW }}
                >
                  {b.price.toLocaleString('uk-UA')} ₴
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses block — glow-heavy */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full opacity-30"
          style={{
            background: `radial-gradient(circle, ${GLOW_PINK} 0%, transparent 60%)`,
            filter: 'blur(100px)',
          }}
        />
        <div className="relative grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-5">
            <p
              className="font-mono text-xs uppercase tracking-wider mb-4"
              style={{ color: GLOW_PINK }}
            >
              ./big-roses
            </p>
            <h2
              className="font-[var(--font-display)] leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              <span
                style={{
                  background: `linear-gradient(135deg, ${FG} 0%, ${GLOW_PINK} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                The serious
                <br />
                gesture.
              </span>
            </h2>
            <Link
              href="/buketu?type=veliki-troyandy"
              className="inline-block font-mono text-sm px-5 py-2.5 rounded-lg border"
              style={{
                borderColor: GLOW_PINK,
                color: GLOW_PINK,
                boxShadow: `0 0 30px ${GLOW_PINK}40`,
              }}
            >
              51 → 301 →
            </Link>
          </div>
          <div className="col-span-12 md:col-span-7 grid grid-cols-3 gap-3">
            {bigRoses.slice(0, 6).map((b) => (
              <Link
                key={b.slug}
                href={`/buket/${b.slug}`}
                className="block relative aspect-square rounded-xl overflow-hidden border group"
                style={{
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p className="font-mono text-xs" style={{ color: FG_DIM }}>
          florenza.io · v.spring.2026 · made in irpin
        </p>
      </footer>
    </main>
  );
}
