import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V09 · Glossier · Soft pastel' };
export const revalidate = 300;

const BLUSH = '#fde6e3';
const ROSE = '#f4b8b0';
const ROSE_DEEP = '#d97a72';
const CREAM = '#fdf8f4';
const INK = '#3a2a26';

export default async function V09() {
  const { featured, bigRoses, balloons, author } = await fetchVariantData();

  return (
    <main style={{ background: CREAM, color: INK }}>
      {/* Hero — soft round shapes, gentle gradient */}
      <section
        className="relative min-h-screen overflow-hidden flex items-center"
        style={{
          background: `radial-gradient(ellipse at top right, ${BLUSH} 0%, ${CREAM} 70%)`,
        }}
      >
        {/* Big blush blob behind hero */}
        <div
          className="absolute -right-[20%] -top-[10%] w-[80vw] h-[80vw] rounded-full opacity-50"
          style={{ background: ROSE, filter: 'blur(80px)' }}
        />

        <div className="relative z-10 grid grid-cols-12 gap-6 px-6 md:px-12 py-24 max-w-7xl mx-auto w-full">
          <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
            <p
              className="text-xs uppercase tracking-[0.32em] mb-8 inline-flex items-center gap-2"
              style={{ color: ROSE_DEEP }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: ROSE_DEEP }}
              />
              Florenza
            </p>
            <h1
              className="font-[var(--font-display)] leading-[1] tracking-[-0.02em] mb-8"
              style={{
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                fontVariationSettings: "'opsz' 144, 'wght' 350",
              }}
            >
              Bring home
              <br />
              <em style={{ fontStyle: 'italic' }}>the bloom</em>.
            </h1>
            <p className="text-lg leading-relaxed opacity-75 max-w-md mb-12">
              Soft, joyful flower compositions for every reason — and all the no-reasons
              in between. Hand-built in Irpin.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/buketu"
                className="inline-block px-8 py-4 rounded-full text-sm font-medium transition-all hover:scale-[1.03]"
                style={{ background: ROSE_DEEP, color: CREAM }}
              >
                Shop bouquets ✿
              </Link>
              <Link
                href="/buketu?type=shari"
                className="inline-block px-8 py-4 rounded-full text-sm font-medium border"
                style={{ borderColor: ROSE_DEEP, color: ROSE_DEEP }}
              >
                Add balloons
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 relative aspect-square">
            {featured[0] && (
              <div
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{ background: ROSE }}
              >
                <Image
                  src={featured[0].primaryImageUrl}
                  alt={featured[0].imageAlt}
                  fill
                  priority
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
            )}
            {/* Floating decorative dots */}
            <div
              className="absolute -top-4 -left-4 w-16 h-16 rounded-full"
              style={{ background: ROSE_DEEP, opacity: 0.4 }}
            />
            <div
              className="absolute bottom-12 -right-6 w-24 h-24 rounded-full"
              style={{ background: BLUSH }}
            />
          </div>
        </div>
      </section>

      {/* Soft rounded cards */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <p
            className="text-xs uppercase tracking-[0.32em] mb-4"
            style={{ color: ROSE_DEEP }}
          >
            ✿ This week's faves ✿
          </p>
          <h2 className="font-[var(--font-display)] text-5xl md:text-6xl">
            Picked just for you
          </h2>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.slice(0, 6).map((b) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="group block bg-white rounded-[28px] overflow-hidden p-3 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(217,122,114,0.18)] hover:-translate-y-1"
            >
              <div
                className="relative aspect-[4/5] rounded-[20px] overflow-hidden mb-4"
                style={{ background: BLUSH }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <span
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium"
                  style={{ background: 'white', color: ROSE_DEEP }}
                >
                  ✿ new
                </span>
              </div>
              <div className="px-3 py-2 flex items-center justify-between">
                <h3 className="font-[var(--font-display)] text-xl">{b.name}</h3>
                <p
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{ background: BLUSH, color: ROSE_DEEP }}
                >
                  {b.price.toLocaleString('uk-UA')} грн
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses chunky pink CTA */}
      <section className="py-24 px-6 md:px-12">
        <div
          className="max-w-7xl mx-auto rounded-[44px] px-6 md:px-16 py-20 relative overflow-hidden"
          style={{ background: ROSE }}
        >
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-40"
            style={{ background: ROSE_DEEP }}
          />
          <div className="relative z-10 grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-7">
              <p
                className="text-xs uppercase tracking-[0.32em] mb-4"
                style={{ color: CREAM }}
              >
                ✿ Roses, but big
              </p>
              <h2
                className="font-[var(--font-display)] leading-[0.95] mb-6"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  color: '#3a1a18',
                }}
              >
                51, 101, 201 roses.
                <br />
                Yes really.
              </h2>
              <p className="text-base opacity-85 max-w-md mb-8" style={{ color: '#3a1a18' }}>
                Premium 60cm red roses, hand-tied, delivered in a custom velvet wrap.
                Because some moments deserve the loud version.
              </p>
              <Link
                href="/buketu?type=veliki-troyandy"
                className="inline-block px-8 py-4 rounded-full text-sm font-medium transition-all hover:scale-[1.03]"
                style={{ background: '#3a1a18', color: CREAM }}
              >
                Shop big bouquets ❤
              </Link>
            </div>
            <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-3">
              {bigRoses.slice(0, 4).map((b) => (
                <Link key={b.slug} href={`/buket/${b.slug}`}>
                  <div
                    className="relative aspect-square rounded-[18px] overflow-hidden"
                    style={{ background: ROSE_DEEP }}
                  >
                    <Image
                      src={b.primaryImageUrl}
                      alt={b.imageAlt}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Balloon row pastel */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="flex items-end justify-between mb-12">
          <h3 className="font-[var(--font-display)] text-3xl md:text-4xl">
            ✿ Add some bounce
          </h3>
          <Link
            href="/buketu?type=shari"
            className="text-sm font-medium px-5 py-2 rounded-full"
            style={{ background: BLUSH, color: ROSE_DEEP }}
          >
            See all balloons →
          </Link>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {balloons.slice(0, 3).map((b) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="block bg-white rounded-[24px] p-3 transition-all hover:-translate-y-1"
            >
              <div
                className="relative aspect-[4/5] rounded-[18px] overflow-hidden"
                style={{ background: BLUSH }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </div>
              <div className="px-2 py-3">
                <h4 className="font-medium">{b.name}</h4>
                <p className="text-sm opacity-65 mt-1">
                  {b.price.toLocaleString('uk-UA')} грн
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="py-16 text-center" style={{ background: BLUSH }}>
        <p
          className="font-[var(--font-display)] text-4xl mb-4"
          style={{ color: ROSE_DEEP, fontStyle: 'italic' }}
        >
          ✿ love, Florenza ✿
        </p>
        <p className="text-xs uppercase tracking-[0.3em] opacity-65">
          Ірпінь · Буча · Гостомель
        </p>
      </footer>
    </main>
  );
}
