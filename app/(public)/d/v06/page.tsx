import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V06 · Tom Ford · Luxe noir' };
export const revalidate = 300;

const NOIR = '#0c0a08';
const NOIR_SOFT = '#181513';
const GOLD = '#c9a868';
const GOLD_SOFT = '#dcc28e';
const CREAM = '#e8dec9';

export default async function V06() {
  const { featured, bigRoses, balloons, author } = await fetchVariantData();

  return (
    <main style={{ background: NOIR, color: CREAM }}>
      {/* Hero — black with thin gold rule + serif logotype */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${NOIR_SOFT} 0%, ${NOIR} 70%)`,
          }}
        />
        {featured[0] && (
          <div className="absolute right-[5vw] top-[10vh] bottom-[10vh] w-[28vw] hidden md:block">
            <div className="relative w-full h-full">
              <Image
                src={featured[0].primaryImageUrl}
                alt=""
                fill
                priority
                sizes="30vw"
                className="object-cover"
                style={{ filter: 'brightness(0.85) contrast(1.05)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(circle, transparent 30%, rgba(12,10,8,0.6) 100%)' }}
              />
            </div>
          </div>
        )}

        <div className="relative z-10 px-6 md:px-16 max-w-3xl">
          <div
            className="h-px w-24 mb-12"
            style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}
          />
          <p
            className="text-[10px] uppercase tracking-[0.6em] mb-10"
            style={{ color: GOLD }}
          >
            Florenza · Maison
          </p>
          <h1
            className="font-[var(--font-display)] leading-[0.92] tracking-[-0.03em]"
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 9rem)',
              fontVariationSettings: "'opsz' 144, 'wght' 280",
            }}
          >
            <span style={{ color: GOLD_SOFT, fontStyle: 'italic' }}>L'art</span>
            <br />
            de la fleur.
          </h1>
          <p className="text-base md:text-lg leading-[1.85] mt-12 max-w-md opacity-75">
            Авторська флористика для тих, хто розуміє різницю між квітами і ритуалом.
            Доставка від однієї години.
          </p>
          <div className="mt-16 flex items-center gap-12">
            <Link
              href="/buketu"
              className="text-xs uppercase tracking-[0.42em] pb-1 border-b"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Collection
            </Link>
            <Link
              href="/about"
              className="text-xs uppercase tracking-[0.42em] opacity-70"
            >
              Maison
            </Link>
          </div>
        </div>

        <div
          className="absolute bottom-8 inset-x-0 flex justify-center text-[10px] uppercase tracking-[0.6em] opacity-50"
        >
          ✦ scroll ✦
        </div>
      </section>

      {/* Three feature cards — minimal lines, gold accents */}
      <section className="py-32 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: GOLD }}>
            {[
              { eyebrow: 'I', title: 'Сезонна композиція', body: 'Складається флористом з найкращих квітів дня.' },
              { eyebrow: 'II', title: 'Ручна обгортка', body: 'Льон, оксамит, японський папір — для кожного букета окремо.' },
              { eyebrow: 'III', title: 'Доставка 60 хв', body: 'Іпрінь, Буча, Гостомель — за годину з моменту оплати.' },
            ].map((b) => (
              <div key={b.title} className="px-8 py-12" style={{ background: NOIR }}>
                <p
                  className="text-[10px] uppercase tracking-[0.6em] mb-8"
                  style={{ color: GOLD }}
                >
                  Service · {b.eyebrow}
                </p>
                <h3
                  className="font-[var(--font-display)] text-2xl leading-tight mb-4"
                  style={{ fontStyle: 'italic' }}
                >
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-70">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog — large editorial cards with gold dividers */}
      <section className="py-32 px-6 md:px-16 max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <div
            className="h-px w-16 mx-auto mb-10"
            style={{ background: GOLD }}
          />
          <p
            className="text-[10px] uppercase tracking-[0.6em] mb-6"
            style={{ color: GOLD }}
          >
            La sélection
          </p>
          <h2 className="font-[var(--font-display)] text-5xl md:text-7xl font-light leading-[1.05]">
            <span style={{ fontStyle: 'italic' }}>Curated</span> bouquets
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-20">
          {featured.slice(0, 6).map((b, i) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
              <div
                className="relative aspect-[3/4] overflow-hidden mb-6"
                style={{ background: NOIR_SOFT }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]"
                  style={{ filter: 'contrast(1.05)' }}
                />
                <span
                  className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.4em]"
                  style={{ color: GOLD }}
                >
                  №{String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3
                className="font-[var(--font-display)] text-2xl leading-tight"
                style={{ fontStyle: 'italic' }}
              >
                {b.name}
              </h3>
              <div
                className="my-3 h-px w-12"
                style={{ background: GOLD, opacity: 0.6 }}
              />
              <div className="flex justify-between items-baseline">
                <p className="text-xs uppercase tracking-[0.3em] opacity-60">Авторський</p>
                <p className="text-sm" style={{ color: GOLD }}>
                  {b.price.toLocaleString('uk-UA')} грн
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses statement — black with single hero image */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[80svh]">
        <div
          className="flex items-center px-6 md:px-16 py-20"
          style={{ background: NOIR_SOFT }}
        >
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.6em] mb-8"
              style={{ color: GOLD }}
            >
              Une collection
            </p>
            <h2
              className="font-[var(--font-display)] leading-[0.92]"
              style={{
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                fontVariationSettings: "'opsz' 144, 'wght' 280",
              }}
            >
              <span style={{ fontStyle: 'italic', color: GOLD_SOFT }}>Cent et une</span>
              <br />
              roses.
            </h2>
            <p className="mt-12 max-w-md text-base leading-[1.85] opacity-75">
              Преміум червоні троянди 60 см. Складаються вручну за добу. У шовковій
              стрічці. Для жесту, який не вимагає слів.
            </p>
            <Link
              href="/buketu?type=veliki-troyandy"
              className="inline-block mt-12 text-xs uppercase tracking-[0.42em] pb-1 border-b"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              51, 75, 101, 151, 201, 301 →
            </Link>
          </div>
        </div>
        <div className="relative aspect-square md:aspect-auto">
          {bigRoses[2] && (
            <Image
              src={bigRoses[2].primaryImageUrl}
              alt={bigRoses[2].imageAlt}
              fill
              sizes="50vw"
              className="object-cover"
              style={{ filter: 'brightness(0.9)' }}
            />
          )}
        </div>
      </section>

      {/* Balloon row — subtle */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <header className="mb-12 flex items-end justify-between">
          <h3
            className="font-[var(--font-display)] text-3xl md:text-4xl"
            style={{ fontStyle: 'italic' }}
          >
            <span style={{ color: GOLD_SOFT }}>Ballons</span> de fête
          </h3>
          <Link href="/buketu?type=shari" className="text-xs uppercase tracking-[0.4em]" style={{ color: GOLD }}>
            View all →
          </Link>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {balloons.slice(0, 3).map((b) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-3 text-base font-[var(--font-display)]" style={{ fontStyle: 'italic' }}>
                {b.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="py-20 text-center">
        <div
          className="h-px w-24 mx-auto mb-10"
          style={{ background: GOLD }}
        />
        <p
          className="text-[10px] uppercase tracking-[0.6em]"
          style={{ color: GOLD }}
        >
          Florenza · Maison · Irpin
        </p>
        <p className="font-[var(--font-display)] text-2xl mt-4" style={{ fontStyle: 'italic' }}>
          Maintenant et toujours
        </p>
      </footer>
    </main>
  );
}
