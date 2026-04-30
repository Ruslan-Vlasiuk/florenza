import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V10 · Apple · Gallery clean' };
export const revalidate = 300;

const BG = '#ffffff';
const SOFT = '#f5f5f7';
const INK = '#1d1d1f';
const SUBTLE = '#86868b';

export default async function V10() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: BG, color: INK }}>
      {/* Hero — large centered headline + product underneath */}
      <section className="pt-20 pb-16 text-center px-6">
        <h1
          className="font-[var(--font-display)] leading-[1.05] tracking-[-0.025em] mb-6"
          style={{
            fontSize: 'clamp(2.75rem, 6vw, 5.5rem)',
            fontWeight: 600,
          }}
        >
          Florenza.
        </h1>
        <p
          className="font-[var(--font-display)] leading-[1.1] max-w-3xl mx-auto"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 500,
          }}
        >
          Premium florist, redefined.
        </p>
        <p
          className="mt-6 text-lg md:text-xl max-w-xl mx-auto"
          style={{ color: SUBTLE }}
        >
          Авторська флористика з доставкою за 60 хвилин у Ірпінь, Бучу та Гостомель.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/buketu"
            className="inline-block px-7 py-3 rounded-full text-base font-medium transition-colors"
            style={{ background: '#0071e3', color: 'white' }}
          >
            Shop bouquets
          </Link>
          <Link
            href="/about"
            className="inline-block px-7 py-3 rounded-full text-base font-medium border"
            style={{ borderColor: INK, color: INK }}
          >
            Learn more &nbsp;›
          </Link>
        </div>

        {/* Hero product — single huge image */}
        <div className="mt-20 max-w-5xl mx-auto">
          {featured[0] && (
            <div className="relative aspect-[16/10] rounded-[28px] overflow-hidden">
              <Image
                src={featured[0].primaryImageUrl}
                alt={featured[0].imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <p className="mt-6 text-sm" style={{ color: SUBTLE }}>
            На фото: {featured[0]?.name} · від {featured[0]?.price.toLocaleString('uk-UA')} грн
          </p>
        </div>
      </section>

      {/* Two big feature blocks side by side, Apple gallery style */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roses card */}
          <Link
            href="/buketu?type=veliki-troyandy"
            className="block rounded-[28px] overflow-hidden p-12 lg:p-16 group transition-all hover:scale-[0.99]"
            style={{ background: '#1d1d1f', color: 'white' }}
          >
            <p className="text-sm font-medium mb-4" style={{ color: '#ff453a' }}>
              Великі букети троянд
            </p>
            <h3
              className="font-[var(--font-display)] leading-[1.05] mb-6"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 600,
              }}
            >
              101 троянда.
              <br />
              Made for the moment.
            </h3>
            <p className="text-base mb-8 max-w-md" style={{ color: '#a1a1a6' }}>
              Преміум 60 см, ручне оформлення, оксамитова стрічка.
            </p>
            <span className="inline-block text-sm font-medium" style={{ color: '#0a84ff' }}>
              Дізнатись більше &nbsp;›
            </span>
            <div className="relative aspect-[16/9] mt-12 rounded-[20px] overflow-hidden">
              {bigRoses[2] && (
                <Image
                  src={bigRoses[2].primaryImageUrl}
                  alt={bigRoses[2].imageAlt}
                  fill
                  sizes="50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}
            </div>
          </Link>

          {/* Balloons card */}
          <Link
            href="/buketu?type=shari"
            className="block rounded-[28px] overflow-hidden p-12 lg:p-16 group transition-all hover:scale-[0.99]"
            style={{ background: SOFT }}
          >
            <p className="text-sm font-medium mb-4" style={{ color: '#0071e3' }}>
              Повітряні шари
            </p>
            <h3
              className="font-[var(--font-display)] leading-[1.05] mb-6"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 600,
              }}
            >
              Atmosphere,
              <br />
              by the dozen.
            </h3>
            <p className="text-base mb-8 max-w-md" style={{ color: SUBTLE }}>
              Гелієві сети у фірмовій палітрі. Тримаються 8–14 годин.
            </p>
            <span className="inline-block text-sm font-medium" style={{ color: '#0a84ff' }}>
              Подивитись набори &nbsp;›
            </span>
            <div className="relative aspect-[16/9] mt-12 rounded-[20px] overflow-hidden">
              {balloons[0] && (
                <Image
                  src={balloons[0].primaryImageUrl}
                  alt={balloons[0].imageAlt}
                  fill
                  sizes="50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}
            </div>
          </Link>
        </div>
      </section>

      {/* Catalog — apple-clean grid */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h2
            className="font-[var(--font-display)] tracking-[-0.025em]"
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
              fontWeight: 600,
            }}
          >
            Знайти ідеальний букет.
          </h2>
          <p className="mt-4 text-lg" style={{ color: SUBTLE }}>
            36 авторських композицій. Ось 8 найпопулярніших.
          </p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.slice(0, 8).map((b) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="block group rounded-[20px] overflow-hidden p-4 transition-colors hover:bg-[#f5f5f7]"
            >
              <div
                className="relative aspect-square rounded-[14px] overflow-hidden mb-4"
                style={{ background: SOFT }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="font-medium text-base">{b.name}</h3>
              <p className="text-sm mt-1" style={{ color: SUBTLE }}>
                від {b.price.toLocaleString('uk-UA')} грн
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Spec strip — Apple-style three columns */}
      <section className="px-6 py-20" style={{ background: SOFT }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { label: 'Доставка', value: '60–90 хв', sub: 'Ірпінь · Буча · Гостомель' },
            { label: 'Гарантія', value: '5 днів', sub: 'або заміна букета' },
            { label: 'Прийом', value: '24/7', sub: 'Telegram · чат · телефон' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-sm font-medium" style={{ color: SUBTLE }}>
                {s.label}
              </p>
              <p
                className="font-[var(--font-display)] mt-2"
                style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 600 }}
              >
                {s.value}
              </p>
              <p className="text-base mt-2" style={{ color: SUBTLE }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-16 text-center px-6">
        <p className="text-sm" style={{ color: SUBTLE }}>
          Florenza · Made in Irpin · Ukraine
        </p>
      </footer>
    </main>
  );
}
