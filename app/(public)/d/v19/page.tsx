import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V19 · Provence · Wedding rustic' };
export const revalidate = 300;

const LAVENDER = '#a08fc4';
const LAVENDER_DEEP = '#5e4d80';
const LINEN = '#f7f3ea';
const HONEY = '#d4a85a';
const INK = '#3d2f3a';

export default async function V19() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: LINEN, color: INK }}>
      {/* Hero with watercolor-feel decorative SVG */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Soft watercolor blob top-left */}
        <svg
          aria-hidden="true"
          className="absolute -top-20 -left-20 w-[60vw] h-[60vw] opacity-50 pointer-events-none"
          viewBox="0 0 200 200"
        >
          <defs>
            <radialGradient id="lav-grad" cx="50%" cy="50%">
              <stop offset="0%" stopColor={LAVENDER} stopOpacity="0.7" />
              <stop offset="100%" stopColor={LAVENDER} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="100" fill="url(#lav-grad)" />
        </svg>
        <svg
          aria-hidden="true"
          className="absolute -bottom-20 -right-20 w-[50vw] h-[50vw] opacity-40 pointer-events-none"
          viewBox="0 0 200 200"
        >
          <defs>
            <radialGradient id="hon-grad" cx="50%" cy="50%">
              <stop offset="0%" stopColor={HONEY} stopOpacity="0.6" />
              <stop offset="100%" stopColor={HONEY} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="100" fill="url(#hon-grad)" />
        </svg>

        {/* Floating lavender stems */}
        <svg
          aria-hidden="true"
          className="absolute right-12 top-12 w-32 h-48 opacity-60 pointer-events-none"
          viewBox="0 0 80 200"
          stroke={LAVENDER_DEEP}
          strokeWidth="1.2"
          fill="none"
        >
          <path d="M40 200 L 40 30" />
          <path d="M40 30 q -8 -8 -3 -16 q 5 -3 8 5 z" fill={LAVENDER} fillOpacity="0.6" />
          <path d="M40 50 q 8 -8 3 -16 q -5 -3 -8 5 z" fill={LAVENDER} fillOpacity="0.5" />
          <path d="M40 70 q -8 -8 -3 -16 q 5 -3 8 5 z" fill={LAVENDER} fillOpacity="0.5" />
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-32 grid grid-cols-12 gap-8 items-center min-h-screen">
          <div className="col-span-12 md:col-span-7">
            <p
              className="text-[11px] uppercase tracking-[0.5em] mb-10"
              style={{ color: LAVENDER_DEEP }}
            >
              ✦ Florenza · Maison florale ✦ A wedding atelier ✦
            </p>
            <h1
              className="font-[var(--font-display)] leading-[1] mb-10"
              style={{
                fontSize: 'clamp(2.75rem, 7vw, 6.5rem)',
                fontStyle: 'italic',
                fontVariationSettings: "'opsz' 144, 'wght' 320",
              }}
            >
              For the day
              <br />
              you'll always
              <br />
              remember.
            </h1>
            <p className="text-base md:text-lg leading-[1.85] max-w-md opacity-85 mb-10">
              Букети нареченої, корнаджі, столові композиції, оформлення локацій.
              Палітра Provence — лаванда, льон, мед, дика квітка.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/vesilna-floristyka"
                className="inline-block px-7 py-3 rounded-full text-sm uppercase tracking-[0.32em] font-medium"
                style={{ background: LAVENDER_DEEP, color: LINEN }}
              >
                Весілля з Florenza →
              </Link>
              <Link
                href="/buketu"
                className="inline-block px-7 py-3 rounded-full text-sm uppercase tracking-[0.32em] font-medium border"
                style={{ borderColor: LAVENDER_DEEP, color: LAVENDER_DEEP }}
              >
                Цей сезон
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            {featured[0] && (
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-[24px] opacity-40"
                  style={{ background: LAVENDER, filter: 'blur(40px)' }}
                />
                <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden">
                  <Image
                    src={featured[0].primaryImageUrl}
                    alt={featured[0].imageAlt}
                    fill
                    priority
                    sizes="40vw"
                    className="object-cover"
                    style={{ filter: 'saturate(0.92) brightness(1.02)' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Wedding promise — three soft cards */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.5em] mb-4" style={{ color: LAVENDER_DEEP }}>
            ✦ Three promises ✦
          </p>
          <h2
            className="font-[var(--font-display)] text-4xl md:text-5xl"
            style={{ fontStyle: 'italic' }}
          >
            What we make.
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { t: 'Букет нареченої', d: 'Авторська композиція в палітрі весілля. Включає 4-6 видів квітів, лляну стрічку.', icon: '⚘' },
            { t: 'Бутоньєрки', d: 'Для нареченого та свідків. Зборка з тих самих квітів що й букет нареченої.', icon: '✿' },
            { t: 'Композиції на столи', d: 'Ниск проста або висока кафедральна. Свічки, листя, сезонна дика квітка.', icon: '❀' },
          ].map((p) => (
            <div
              key={p.t}
              className="rounded-[24px] p-10 text-center"
              style={{ background: '#fff', boxShadow: `0 10px 40px ${LAVENDER}33` }}
            >
              <p className="text-4xl mb-4" style={{ color: LAVENDER_DEEP }}>{p.icon}</p>
              <h3
                className="font-[var(--font-display)] text-2xl mb-4"
                style={{ fontStyle: 'italic' }}
              >
                {p.t}
              </h3>
              <p className="text-sm opacity-75 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bouquets in honey rounded cards */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] mb-4" style={{ color: HONEY }}>
            ✦ Daily bouquets ✦
          </p>
          <h2 className="font-[var(--font-display)] text-5xl md:text-6xl" style={{ fontStyle: 'italic' }}>
            Fresh from yesterday's market.
          </h2>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.slice(0, 8).map((b) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="group block transition-transform hover:-translate-y-1"
            >
              <div
                className="relative aspect-[4/5] rounded-[20px] overflow-hidden"
                style={{ background: '#f0e8d8' }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  style={{ filter: 'saturate(0.92)' }}
                />
              </div>
              <div className="mt-3 text-center">
                <h3
                  className="font-[var(--font-display)] text-base"
                  style={{ fontStyle: 'italic' }}
                >
                  {b.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: LAVENDER_DEEP }}>
                  {b.price.toLocaleString('uk-UA')} грн
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses statement with lavender frame */}
      <section
        className="py-24 px-6 md:px-12 text-center"
        style={{ background: LAVENDER, color: '#fff' }}
      >
        <p className="text-[11px] uppercase tracking-[0.5em] mb-6 opacity-80">
          ✦ La grande déclaration ✦
        </p>
        <h2
          className="font-[var(--font-display)] leading-[1.05] mb-8 max-w-3xl mx-auto"
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            fontStyle: 'italic',
          }}
        >
          51, 101, 201 троянди.
          <br />
          Pour le grand jour.
        </h2>
        <Link
          href="/buketu?type=veliki-troyandy"
          className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-[0.32em] font-medium"
          style={{ background: LINEN, color: LAVENDER_DEEP }}
        >
          Tous les bouquets →
        </Link>
      </section>

      <footer className="py-16 text-center px-6">
        <p
          className="font-[var(--font-display)] text-4xl mb-3"
          style={{ fontStyle: 'italic', color: LAVENDER_DEEP }}
        >
          ✦ Florenza ✦
        </p>
        <p className="text-[11px] uppercase tracking-[0.5em] opacity-60">
          Maison florale · Ірпінь · MMXXVI
        </p>
      </footer>
    </main>
  );
}
