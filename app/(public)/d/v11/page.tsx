import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V11 · Stripe · Mesh gradient' };
export const revalidate = 300;

export default async function V11() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: '#fbfafe', color: '#0b1c3d' }}>
      {/* Hero with animated mesh gradient */}
      <section className="relative min-h-[88svh] flex items-center overflow-hidden">
        {/* Layered animated mesh */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 15% 20%, rgba(255, 180, 200, 0.7) 0%, transparent 50%),
              radial-gradient(ellipse 80% 70% at 85% 30%, rgba(180, 200, 255, 0.7) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 30% 90%, rgba(220, 255, 200, 0.5) 0%, transparent 50%),
              radial-gradient(ellipse 70% 60% at 90% 90%, rgba(255, 220, 180, 0.5) 0%, transparent 50%),
              linear-gradient(180deg, #fbfafe 0%, #f5f0fc 100%)
            `,
            animation: 'mesh-drift 30s ease-in-out infinite alternate',
          }}
        />
        <style>{`
          @keyframes mesh-drift {
            0% { transform: scale(1) translate(0,0); }
            100% { transform: scale(1.1) translate(-3%, 2%); }
          }
        `}</style>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-24 grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 mb-8 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Доставка за 60 хв · Ірпінь, Буча, Гостомель
            </div>
            <h1
              className="font-[var(--font-display)] leading-[1] tracking-[-0.03em] mb-8"
              style={{
                fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #0b1c3d 0%, #6c5fc9 60%, #d97a72 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Авторська
              <br />
              флористика,
              <br />
              без зусиль.
            </h1>
            <p className="text-lg md:text-xl max-w-xl mb-10 opacity-75 leading-relaxed">
              36 композицій від Florenza. Замовлення в 3 кліки, оплата Apple Pay,
              кур&apos;єр через 60 хвилин.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/buketu"
                className="inline-block px-6 py-3 rounded-lg text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #635bff 0%, #c83a9e 100%)',
                  boxShadow: '0 8px 24px rgba(99,91,255,0.35)',
                }}
              >
                Перейти до каталогу →
              </Link>
              <Link
                href="/about"
                className="inline-block px-6 py-3 rounded-lg text-base font-medium bg-white/80 backdrop-blur-md border border-white/90 hover:bg-white"
              >
                Про нас
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            {/* Floating product card */}
            {featured[0] && (
              <div
                className="relative rounded-3xl overflow-hidden bg-white/40 backdrop-blur-xl p-3 border border-white/80"
                style={{ boxShadow: '0 30px 80px rgba(99,91,255,0.18)' }}
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src={featured[0].primaryImageUrl}
                    alt={featured[0].imageAlt}
                    fill
                    priority
                    sizes="40vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-50">
                      Featured
                    </p>
                    <p className="font-[var(--font-display)] text-xl">
                      {featured[0].name}
                    </p>
                  </div>
                  <p
                    className="px-4 py-2 rounded-full text-sm font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #635bff, #c83a9e)',
                    }}
                  >
                    {featured[0].price.toLocaleString('uk-UA')} ₴
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust bar with logos / stats */}
      <section className="border-y border-black/5 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: '1 200+', l: 'букетів за рік' },
            { v: '60 хв', l: 'термінова доставка' },
            { v: '24/7', l: 'приймаємо замовлення' },
            { v: '5 днів', l: 'гарантія свіжості' },
          ].map((s) => (
            <div key={s.l}>
              <p
                className="font-[var(--font-display)] text-3xl md:text-4xl font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #635bff 0%, #c83a9e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {s.v}
              </p>
              <p className="text-sm opacity-60 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog with floating cards */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-16">
          <p className="text-sm font-medium mb-3" style={{ color: '#635bff' }}>
            Каталог · Spring 2026
          </p>
          <h2 className="font-[var(--font-display)] text-5xl md:text-6xl tracking-tight">
            Букети сезону
          </h2>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 6).map((b) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden p-3 transition-all hover:-translate-y-1"
              style={{ boxShadow: '0 4px 24px rgba(11,28,61,0.04)' }}
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#f5f0fc]">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-3 flex items-center justify-between">
                <h3 className="font-[var(--font-display)] text-lg">{b.name}</h3>
                <p
                  className="text-sm font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #635bff, #c83a9e)' }}
                >
                  {b.price.toLocaleString('uk-UA')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses CTA — gradient block */}
      <section className="py-24 px-6 md:px-12">
        <div
          className="max-w-7xl mx-auto rounded-[32px] p-10 md:p-16 text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #635bff 0%, #c83a9e 50%, #ff6a3d 100%)',
          }}
        >
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-7">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-4">
                Великі букети троянд
              </p>
              <h2
                className="font-[var(--font-display)] leading-[0.95] mb-6"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
              >
                51, 75, 101, 151, 201, 301
                <br />
                <em style={{ fontStyle: 'italic' }}>premium roses.</em>
              </h2>
              <Link
                href="/buketu?type=veliki-troyandy"
                className="inline-block px-7 py-3 rounded-lg bg-white text-base font-medium"
                style={{ color: '#635bff' }}
              >
                Подивитись усі →
              </Link>
            </div>
            <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-3">
              {bigRoses.slice(0, 4).map((b) => (
                <div
                  key={b.slug}
                  className="relative aspect-square rounded-xl overflow-hidden"
                >
                  <Image
                    src={b.primaryImageUrl}
                    alt={b.imageAlt}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center">
        <p className="text-sm opacity-60">Florenza · Ірпінь · 2026</p>
      </footer>
    </main>
  );
}
