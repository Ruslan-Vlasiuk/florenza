import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';
import { FadeUp } from '@/components/florenza/effects/FadeUp';

export const metadata = { title: 'V04 · Cereal · Photography-driven' };
export const revalidate = 300;

export default async function V04() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: '#f1ede5', color: '#1f1d18' }}>
      {/* Massive landscape hero, minimal text below */}
      <section className="pt-12 px-6 md:px-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
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
        </div>
        <div className="grid grid-cols-12 gap-6 mt-12 max-w-7xl mx-auto">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[10px] uppercase tracking-[0.32em] opacity-50">
              Issue 02 · Florenza
            </p>
          </div>
          <div className="col-span-12 md:col-span-6">
            <h1
              className="font-[var(--font-display)] text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.15] font-light"
              style={{ fontVariationSettings: "'opsz' 72, 'wght' 320" }}
            >
              On flowers, slowness, and the rooms they enter.
            </h1>
          </div>
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.32em] opacity-50">
              Photographs &nbsp;·&nbsp;&nbsp;
              <span className="opacity-100 normal-case tracking-normal">Karakoy V.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Long horizontal photo essay — alternating image/text */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto space-y-32">
        {[bigRoses[0], featured[2], balloons[0]].filter(Boolean).map((b, i) => (
          <FadeUp key={b!.slug} y={48} duration={1.0}>
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className={`col-span-12 md:col-span-7 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
              <Link href={`/buket/${b!.slug}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={b!.primaryImageUrl}
                    alt={b!.imageAlt}
                    fill
                    sizes="60vw"
                    className="object-cover"
                  />
                </div>
              </Link>
            </div>
            <div className={`col-span-12 md:col-span-4 ${i % 2 === 1 ? 'md:order-1 md:col-start-2' : ''}`}>
              <p className="text-[10px] uppercase tracking-[0.32em] opacity-50 mb-4">
                Series {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="font-[var(--font-display)] text-3xl mb-6 font-light">
                {b!.name}
              </h2>
              <p className="text-sm leading-[1.85] opacity-75">
                Авторська композиція в палітрі бренду. Сезонні квіти підбираються
                флористом — кожен букет складається вручну.
              </p>
              <p className="text-sm mt-6 opacity-60">
                {b!.price.toLocaleString('uk-UA')} грн
              </p>
              <Link
                href={`/buket/${b!.slug}`}
                className="inline-block mt-8 text-[11px] uppercase tracking-[0.3em] border-b border-current pb-1"
              >
                Read on →
              </Link>
            </div>
          </div>
          </FadeUp>
        ))}
      </section>

      {/* Catalog grid — small thumbnails, lots of breathing room */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-20 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.32em] opacity-50">
              Catalogue
            </p>
            <h2 className="font-[var(--font-display)] text-3xl mt-4 font-light">
              The shortlist
            </h2>
          </div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {featured.slice(0, 8).map((b) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group">
              <div className="relative aspect-[3/4] overflow-hidden mb-4">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="text-sm mb-1">{b.name}</p>
              <p className="text-xs opacity-55">{b.price.toLocaleString('uk-UA')} грн</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="py-20 text-center px-6">
        <p className="text-[10px] uppercase tracking-[0.42em] opacity-50">
          Florenza · Florists in residence · Ірпінь · 2026
        </p>
      </footer>
    </main>
  );
}
