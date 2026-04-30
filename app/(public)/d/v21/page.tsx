import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V21 · NY gallery · White cube' };
export const revalidate = 300;

export default async function V21() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main className="bg-white text-black">
      {/* Tiny minimal header */}
      <header className="px-6 md:px-12 py-6 grid grid-cols-12 items-center border-b border-black/10">
        <p className="col-span-6 font-mono text-xs uppercase tracking-wider">
          Florenza Gallery
        </p>
        <p className="col-span-6 text-right font-mono text-xs uppercase tracking-wider">
          Floor 01 / Spring '26
        </p>
      </header>

      {/* Single huge hero — gallery centerpiece */}
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto text-center">
        <p className="font-mono text-xs uppercase tracking-[0.5em] mb-12 opacity-60">
          ✦ Currently exhibiting ✦
        </p>
        <h1
          className="font-[var(--font-display)] tracking-[-0.025em] leading-[0.95] mb-16"
          style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 400 }}
        >
          The flower
          <br />
          as object,
          <br />
          <em style={{ fontStyle: 'italic' }}>not subject.</em>
        </h1>

        {featured[0] && (
          <div className="max-w-3xl mx-auto">
            <div className="relative aspect-square">
              <Image
                src={featured[0].primaryImageUrl}
                alt={featured[0].imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 768px, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.32em] opacity-60">
              {featured[0].name} · 2026 · Mixed flowers · Florenza Studio
            </p>
            <p className="mt-2 font-mono text-xs">
              {featured[0].price.toLocaleString('uk-UA')} ₴
            </p>
          </div>
        )}
      </section>

      {/* Gallery wall — pieces hung at varying sizes */}
      <section className="border-t border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <header className="mb-16 grid grid-cols-12">
            <p className="col-span-1 font-mono text-xs uppercase tracking-wider">02 / 04</p>
            <p className="col-span-3 font-mono text-xs uppercase tracking-wider">Wall A</p>
            <h2
              className="col-span-8 font-[var(--font-display)] text-3xl tracking-tight"
              style={{ fontWeight: 400 }}
            >
              Permanent collection · Spring 2026
            </h2>
          </header>
          <div className="grid grid-cols-12 gap-8">
            {featured.slice(0, 6).map((b, i) => {
              const sizes = [
                'col-span-12 md:col-span-7 aspect-[3/4]',
                'col-span-12 md:col-span-5 aspect-square',
                'col-span-6 md:col-span-4 aspect-[3/4]',
                'col-span-6 md:col-span-4 aspect-square',
                'col-span-12 md:col-span-4 aspect-[3/4]',
                'col-span-12 md:col-span-6 aspect-[16/10]',
              ];
              return (
                <Link
                  key={b.slug}
                  href={`/buket/${b.slug}`}
                  className={`group block ${sizes[i]?.split(' ').slice(0, -1).join(' ')}`}
                >
                  <div className={`relative ${sizes[i]?.split(' ').pop()} overflow-hidden`}>
                    <Image
                      src={b.primaryImageUrl}
                      alt={b.imageAlt}
                      fill
                      sizes="50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="mt-3 font-mono text-xs uppercase tracking-wider opacity-60">
                    №{String(i + 1).padStart(2, '0')} · {b.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roses installation — single huge piece */}
      <section className="px-6 md:px-12 py-32">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.5em] mb-12 text-center opacity-60">
            ✦ Special installation · Floor 02 ✦
          </p>
          <h2
            className="font-[var(--font-display)] text-center text-5xl md:text-7xl mb-16 tracking-tight"
            style={{ fontWeight: 400 }}
          >
            «Hundred and one»
          </h2>
          {bigRoses[2] && (
            <div className="relative aspect-[16/10]">
              <Image
                src={bigRoses[2].primaryImageUrl}
                alt={bigRoses[2].imageAlt}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="mt-8 grid grid-cols-12 gap-4">
            <p className="col-span-12 md:col-span-6 font-mono text-xs uppercase tracking-wider opacity-60">
              101 stems · 60 cm · Hand-tied
            </p>
            <p className="col-span-12 md:col-span-3 font-mono text-xs uppercase tracking-wider opacity-60">
              Edition open
            </p>
            <p className="col-span-12 md:col-span-3 font-mono text-xs uppercase tracking-wider text-right">
              {bigRoses[2]?.price.toLocaleString('uk-UA')} ₴
            </p>
          </div>
          <Link
            href="/buketu?type=veliki-troyandy"
            className="block mt-12 mx-auto w-fit px-8 py-3 border-2 border-black text-sm uppercase tracking-[0.32em]"
          >
            Acquire piece →
          </Link>
        </div>
      </section>

      {/* Curated balloons — small studio shots */}
      <section className="border-t border-black/10 px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 grid grid-cols-12">
            <p className="col-span-1 font-mono text-xs uppercase tracking-wider">03</p>
            <h3 className="col-span-11 font-[var(--font-display)] text-3xl tracking-tight">
              Studio · helium edition
            </h3>
          </header>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {balloons.slice(0, 6).map((b) => (
              <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={b.primaryImageUrl}
                    alt={b.imageAlt}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider opacity-60">
                  {b.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 px-6 md:px-12 py-8 grid grid-cols-12">
        <p className="col-span-6 font-mono text-xs uppercase tracking-wider">
          Florenza Gallery · Ірпінь
        </p>
        <p className="col-span-6 text-right font-mono text-xs uppercase tracking-wider opacity-60">
          Open 24/7 · 2026
        </p>
      </footer>
    </main>
  );
}
