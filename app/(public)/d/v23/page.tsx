import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V23 · Sketch · Hand-drawn' };
export const revalidate = 300;

const PAPER = '#fbf6ec';
const GRAPHITE = '#3a342c';
const RED = '#a83f30';
const BLUE = '#3a5878';

// Hand-drawn arrow SVG
function HandArrow({ className = '', stroke = GRAPHITE }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 80 30" className={className} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 17 Q 30 8, 60 14 Q 64 15, 70 18" strokeDasharray="0" />
      <path d="M62 10 L 72 18 L 60 22" />
    </svg>
  );
}

// Hand-drawn underline scribble
function Scribble({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 14" className={className} fill="none" stroke={GRAPHITE} strokeWidth="2" strokeLinecap="round">
      <path d="M5 8 Q 50 2, 100 7 Q 150 11, 195 5" />
    </svg>
  );
}

export default async function V23() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main
      style={{
        background: PAPER,
        color: GRAPHITE,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='1'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.15'/></svg>")`,
        backgroundSize: '180px',
      }}
    >
      {/* Hero — sketchbook page */}
      <section className="relative min-h-screen px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-wider mb-12 opacity-60 italic">
          ~ florenza · pages from the studio ~
        </p>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7">
            <h1
              className="font-[var(--font-display)] leading-[0.95] mb-4"
              style={{
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontVariationSettings: "'opsz' 144, 'wght' 350",
              }}
            >
              <em style={{ fontStyle: 'italic' }}>florists,</em>
              <br />
              still drawing
              <br />
              by hand.
            </h1>
            <Scribble className="w-48 ml-2 -mt-2 opacity-70" />

            <p className="text-base md:text-lg mt-10 max-w-md leading-[1.85] opacity-85">
              Прості начерки. Складні букети. Невелика квіткарня в Ірпені, де ще
              пам&apos;ятають як це — чути запах піонії в травні.
            </p>

            <div className="flex items-center gap-4 mt-10">
              <Link
                href="/buketu"
                className="inline-block px-7 py-3 border-2 text-sm font-medium"
                style={{ borderColor: GRAPHITE, background: PAPER }}
              >
                Каталог
              </Link>
              <HandArrow className="w-16 -mt-2" />
              <span
                className="font-[var(--font-display)] text-base"
                style={{ fontStyle: 'italic', color: RED }}
              >
                36 рисунків
              </span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 relative">
            {featured[0] && (
              <div className="relative">
                <div
                  className="relative aspect-[4/5]"
                  style={{
                    transform: 'rotate(1.5deg)',
                    boxShadow: '4px 4px 0 rgba(58,52,44,0.1)',
                  }}
                >
                  <div className="absolute inset-0 bg-white p-2">
                    <div className="relative w-full h-full">
                      <Image
                        src={featured[0].primaryImageUrl}
                        alt={featured[0].imageAlt}
                        fill
                        priority
                        sizes="40vw"
                        className="object-cover"
                        style={{ filter: 'saturate(0.8)' }}
                      />
                    </div>
                  </div>
                </div>
                {/* Hand-drawn note */}
                <div
                  className="absolute -bottom-8 -left-4 px-3 py-1 rotate-[-3deg]"
                  style={{
                    background: PAPER,
                    color: RED,
                    border: `1.5px dashed ${RED}`,
                    fontFamily: 'cursive',
                    fontSize: '14px',
                  }}
                >
                  ✿ {featured[0].name}!
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Annotated sketchbook catalog */}
      <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <span
            className="font-[var(--font-display)] text-3xl"
            style={{ fontStyle: 'italic', color: RED }}
          >
            page 02 —
          </span>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">
            our favourites this season
          </h2>
        </div>
        <Scribble className="w-64 -mt-1 opacity-60" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 mt-12">
          {featured.slice(0, 6).map((b, i) => {
            const rotates = ['rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]', 'rotate-[1.5deg]', 'rotate-[-0.7deg]', 'rotate-[0.6deg]'];
            return (
              <Link
                key={b.slug}
                href={`/buket/${b.slug}`}
                className={`group block ${rotates[i]} transition-transform hover:rotate-0 hover:scale-[1.02]`}
              >
                <div
                  className="bg-white p-2"
                  style={{ boxShadow: '2px 3px 0 rgba(58,52,44,0.12)' }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={b.primaryImageUrl}
                      alt={b.imageAlt}
                      fill
                      sizes="33vw"
                      className="object-cover"
                      style={{ filter: 'saturate(0.85)' }}
                    />
                  </div>
                  <div className="px-2 py-3 flex items-baseline justify-between">
                    <p
                      className="font-[var(--font-display)] text-base"
                      style={{ fontStyle: 'italic' }}
                    >
                      {b.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: BLUE, fontFamily: 'cursive' }}
                    >
                      {b.price.toLocaleString('uk-UA')} ₴
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex items-center gap-4">
          <HandArrow className="w-16 -mt-1 rotate-180" stroke={BLUE} />
          <Link
            href="/buketu"
            className="font-[var(--font-display)] text-2xl underline decoration-2 underline-offset-4"
            style={{ fontStyle: 'italic', color: BLUE }}
          >
            see the full sketchbook (36 pieces)
          </Link>
        </div>
      </section>

      {/* Roses note — handwritten style */}
      <section
        className="py-24 px-6 md:px-12 text-center"
        style={{
          background: '#fff8e8',
          borderTop: `2px dashed ${GRAPHITE}40`,
          borderBottom: `2px dashed ${GRAPHITE}40`,
        }}
      >
        <p className="font-[var(--font-display)] text-3xl mb-2" style={{ fontStyle: 'italic', color: RED }}>
          page 04 —
        </p>
        <h2
          className="font-[var(--font-display)] mb-8 leading-[1.05]"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontStyle: 'italic',
          }}
        >
          51, 101, 201 троянди.
          <br />
          Просто.
        </h2>
        <Scribble className="w-32 mx-auto opacity-60" />
        <Link
          href="/buketu?type=veliki-troyandy"
          className="inline-block mt-10 font-[var(--font-display)] text-xl underline decoration-2 underline-offset-4"
          style={{ fontStyle: 'italic', color: RED }}
        >
          подивитись усі →
        </Link>
      </section>

      <footer className="py-16 text-center px-6">
        <p
          className="font-[var(--font-display)] text-2xl mb-3"
          style={{ fontStyle: 'italic' }}
        >
          ~ florenza ~
        </p>
        <p className="text-xs opacity-60" style={{ fontFamily: 'cursive' }}>
          Made with hands. Ірпінь, 2026.
        </p>
      </footer>
    </main>
  );
}
