import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V20 · Scandinavian · Linen' };
export const revalidate = 300;

const SAND = '#f3eee2';
const STONE = '#dcd2bf';
const FOREST = '#3a4a3c';
const PALE_WOOD = '#c9b88a';
const INK = '#1f1d18';

export default async function V20() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: SAND, color: INK }}>
      {/* Hero — clean grid, neutral palette */}
      <section className="px-6 md:px-12 pt-12 pb-20 max-w-7xl mx-auto">
        <header className="grid grid-cols-12 mb-12 items-end">
          <div className="col-span-6 md:col-span-3">
            <p className="font-[var(--font-display)] text-2xl tracking-tight">
              Florenza
            </p>
          </div>
          <div className="col-span-6 md:col-span-9 text-right text-xs uppercase tracking-[0.3em]">
            Spring 2026 · Catalogue / 36
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-7">
            <h1
              className="font-[var(--font-display)] leading-[0.95] tracking-[-0.025em] mb-8"
              style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 400 }}
            >
              <span>Calmly</span>
              <br />
              made flowers.
              <br />
              <em style={{ fontStyle: 'italic', color: FOREST }}>For real life.</em>
            </h1>
            <p className="text-base md:text-lg max-w-md leading-relaxed mb-10">
              Просто й по-справжньому. Сезонні квіти, льон, ремесло. Доставка від
              однієї години в Ірпінь, Бучу, Гостомель.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/buketu"
                className="inline-block px-6 py-3 text-sm uppercase tracking-[0.32em] font-medium"
                style={{ background: FOREST, color: SAND }}
              >
                See all 36 →
              </Link>
              <Link
                href="/about"
                className="inline-block px-6 py-3 text-sm uppercase tracking-[0.32em] font-medium border"
                style={{ borderColor: INK }}
              >
                The studio
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 relative">
            {featured[0] && (
              <div className="relative aspect-[4/5]">
                <Image
                  src={featured[0].primaryImageUrl}
                  alt={featured[0].imageAlt}
                  fill
                  priority
                  sizes="40vw"
                  className="object-cover"
                  style={{ filter: 'saturate(0.85) contrast(1.02)' }}
                />
                <p
                  className="absolute -bottom-8 right-0 text-xs uppercase tracking-[0.32em]"
                  style={{ color: FOREST }}
                >
                  No. 01 · {featured[0].name}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Two-column manifesto */}
      <section
        className="py-24 px-6 md:px-12"
        style={{ background: STONE }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <p className="text-xs uppercase tracking-[0.32em] mb-4" style={{ color: FOREST }}>
              Manifest
            </p>
            <h2
              className="font-[var(--font-display)] text-4xl tracking-tight"
              style={{ fontWeight: 400 }}
            >
              Flowers for living rooms, not stages.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6 space-y-5 text-base leading-[1.85]">
            <p>
              Ми любимо квіти, які поєднуються з обличчям клієнтки, з рамами вікон
              кухні, з настроєм вівторкового вечора. Не з події, не з фотосесії — з
              життям.
            </p>
            <p>
              Тому в наших букетах нема кричущих кольорів, нема перебільшеної
              кількості, нема пишних бантів. Є — баланс, тиша, ремесло. І так само,
              як гарний светр, букет від Florenza лягає в інтер&apos;єр як треба, з
              першої хвилини.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog grid — clean rectangles, lots of breathing */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-12 grid grid-cols-12 items-end">
          <div className="col-span-12 md:col-span-6">
            <p className="text-xs uppercase tracking-[0.32em] mb-4" style={{ color: FOREST }}>
              ▼ The selection
            </p>
            <h2
              className="font-[var(--font-display)] text-5xl md:text-6xl tracking-tight"
              style={{ fontWeight: 400 }}
            >
              Букети сезону
            </h2>
          </div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.slice(0, 8).map((b, i) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-4" style={{ background: STONE }}>
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ filter: 'saturate(0.85)' }}
                />
              </div>
              <p className="text-xs uppercase tracking-[0.32em] mb-1 opacity-60">
                №{String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="text-base mb-1">{b.name}</h3>
              <p className="text-xs opacity-65">від {b.price.toLocaleString('uk-UA')} грн</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses with woods accent */}
      <section className="py-24 px-6 md:px-12" style={{ background: FOREST, color: SAND }}>
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-5">
            <p
              className="text-xs uppercase tracking-[0.32em] mb-4"
              style={{ color: PALE_WOOD }}
            >
              Roses, by quantity
            </p>
            <h2
              className="font-[var(--font-display)] leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400 }}
            >
              <span>51.</span>
              <span style={{ color: PALE_WOOD }}> 101.</span>
              <span> 301.</span>
              <br />
              <em style={{ fontStyle: 'italic' }}>Calmly extreme.</em>
            </h2>
            <Link
              href="/buketu?type=veliki-troyandy"
              className="inline-block mt-6 px-6 py-3 text-sm uppercase tracking-[0.32em]"
              style={{ background: PALE_WOOD, color: FOREST }}
            >
              Big bouquets →
            </Link>
          </div>
          <div className="col-span-12 md:col-span-7 grid grid-cols-3 gap-3">
            {bigRoses.slice(0, 6).map((b) => (
              <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={b.primaryImageUrl}
                    alt={b.imageAlt}
                    fill
                    sizes="20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ filter: 'saturate(0.85)' }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-12 gap-4 border-t" style={{ borderColor: '#0001' }}>
        <p className="col-span-6 text-xs uppercase tracking-[0.3em]">Florenza · Studio</p>
        <p className="col-span-6 text-right text-xs uppercase tracking-[0.3em] opacity-60">
          Ірпінь · Made calmly · 2026
        </p>
      </footer>
    </main>
  );
}
