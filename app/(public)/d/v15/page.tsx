import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V15 · Brutalist · Architectural B/W' };
export const revalidate = 300;

export default async function V15() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main className="bg-white text-black">
      {/* Top utility bar */}
      <div className="border-b-2 border-black flex">
        <div className="flex-1 px-6 py-3 text-xs font-mono uppercase tracking-wider border-r-2 border-black">
          F.LORENZA
        </div>
        <div className="px-6 py-3 text-xs font-mono uppercase border-r-2 border-black">
          ®2026
        </div>
        <div className="px-6 py-3 text-xs font-mono uppercase border-r-2 border-black">
          UA · Ірпінь
        </div>
        <div className="px-6 py-3 text-xs font-mono uppercase">
          Catalogue 36/36
        </div>
      </div>

      {/* Hero — black-and-white, brutalist */}
      <section className="grid grid-cols-12 border-b-2 border-black">
        <div className="col-span-12 md:col-span-7 border-r-2 border-black px-6 md:px-12 py-20 flex items-end min-h-[80svh]">
          <h1
            className="font-[var(--font-display)] leading-[0.85] tracking-[-0.05em]"
            style={{
              fontSize: 'clamp(4rem, 14vw, 16rem)',
              fontWeight: 700,
            }}
          >
            FLOWER
            <br />
            CON—
            <br />
            STRUCTION.
          </h1>
        </div>
        <div className="col-span-12 md:col-span-5 relative aspect-square md:aspect-auto">
          {featured[0] && (
            <Image
              src={featured[0].primaryImageUrl}
              alt={featured[0].imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
              style={{ filter: 'grayscale(1) contrast(1.15)' }}
            />
          )}
        </div>
      </section>

      {/* Stats grid — bold black/white blocks */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-black">
        {[
          { v: '36', l: 'Букетів у каталозі' },
          { v: '60′', l: 'Доставка хвилин' },
          { v: '24/7', l: 'Прийом замовлень' },
          { v: 'XX-LX', l: '21–60 троянд штук' },
        ].map((s, i) => (
          <div
            key={s.l}
            className={`px-6 md:px-8 py-12 ${i < 3 ? 'border-r-2 border-black' : ''} ${i < 2 ? 'border-b-2 border-black md:border-b-0' : ''} ${i % 2 === 0 ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            <p
              className="font-[var(--font-display)] leading-[0.85] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700 }}
            >
              {s.v}
            </p>
            <p className="text-xs uppercase tracking-wider mt-3 opacity-80">
              {s.l}
            </p>
          </div>
        ))}
      </section>

      {/* Catalogue — concrete grid */}
      <section className="border-b-2 border-black">
        <header className="grid grid-cols-12 border-b-2 border-black">
          <div className="col-span-2 px-6 py-6 border-r-2 border-black">
            <p className="font-mono text-xs uppercase">04 / 09</p>
          </div>
          <div className="col-span-10 px-6 py-6">
            <p className="font-[var(--font-display)] text-3xl tracking-tight" style={{ fontWeight: 700 }}>
              CATALOGUE.
            </p>
          </div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 border-l-2 border-black">
          {featured.slice(0, 8).map((b, i) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="block group border-r-2 border-b-2 border-black"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="25vw"
                  className="object-cover transition-all duration-500 group-hover:scale-[1.04]"
                  style={{ filter: 'grayscale(1) contrast(1.1)' }}
                />
                <span className="absolute top-3 left-3 bg-white px-2 py-0.5 font-mono text-xs uppercase tracking-wider">
                  №{String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="px-4 py-4 grid grid-cols-2 gap-2">
                <p className="font-[var(--font-display)] text-base font-bold uppercase tracking-tight">
                  {b.name}
                </p>
                <p className="font-mono text-xs text-right">
                  ₴ {b.price.toLocaleString('uk-UA')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses — single huge headline */}
      <section className="border-b-2 border-black">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-5 border-r-0 md:border-r-2 border-black px-6 md:px-12 py-16 flex items-center bg-black text-white">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider mb-6 opacity-70">
                07 / 09 · ROSES
              </p>
              <p
                className="font-[var(--font-display)] leading-[0.9] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 700 }}
              >
                FIFTY ONE.
                <br />
                ONE HUNDRED ONE.
                <br />
                THREE HUNDRED ONE.
              </p>
              <Link
                href="/buketu?type=veliki-troyandy"
                className="inline-block mt-12 bg-white text-black px-8 py-3 font-mono text-xs uppercase tracking-wider"
              >
                ENTER →
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-7 grid grid-cols-2">
            {bigRoses.slice(0, 4).map((b, i) => (
              <div
                key={b.slug}
                className={`relative aspect-square ${i < 2 ? 'border-b-2 border-black' : ''} ${i % 2 === 0 ? 'border-r-2 border-black' : ''}`}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  style={{ filter: 'grayscale(1) contrast(1.15)' }}
                />
                <span className="absolute bottom-3 left-3 bg-black text-white px-2 py-0.5 font-mono text-xs uppercase">
                  {b.name.match(/\d+/)?.[0] ?? '—'} STEMS
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom marquee */}
      <section className="overflow-hidden bg-black text-white py-3">
        <p
          className="font-[var(--font-display)] text-3xl whitespace-nowrap tracking-tight"
          style={{ fontWeight: 700 }}
        >
          ✶ FLORENZA ✶ FLORENZA ✶ FLORENZA ✶ FLORENZA ✶ FLORENZA ✶ FLORENZA ✶
        </p>
      </section>

      <footer className="grid grid-cols-12 border-t-2 border-black">
        <div className="col-span-6 px-6 py-6 border-r-2 border-black">
          <p className="font-mono text-xs uppercase">© 2026 FLORENZA / IRPIN</p>
        </div>
        <div className="col-span-6 px-6 py-6 text-right">
          <p className="font-mono text-xs uppercase">END / 09</p>
        </div>
      </footer>
    </main>
  );
}
