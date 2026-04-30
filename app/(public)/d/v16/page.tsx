import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V16 · Mid-century · Editorial' };
export const revalidate = 300;

const MUSTARD = '#d4a83e';
const TEAL = '#3a6b6e';
const RUST = '#b85c3e';
const CREAM = '#f4ede0';
const INK = '#2a201a';

export default async function V16() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: CREAM, color: INK }}>
      {/* Hero with geometric retro shapes */}
      <section className="relative min-h-[92svh] overflow-hidden">
        {/* Decorative geometric shapes */}
        <svg
          aria-hidden="true"
          className="absolute -right-12 -top-12 w-[60vw] h-[60vw] opacity-90 pointer-events-none"
          viewBox="0 0 400 400"
        >
          <circle cx="200" cy="200" r="180" fill={MUSTARD} />
          <circle cx="200" cy="200" r="140" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="100" fill={RUST} />
        </svg>
        <svg
          aria-hidden="true"
          className="absolute -left-20 bottom-12 w-[40vw] h-[40vw] opacity-80 pointer-events-none"
          viewBox="0 0 200 200"
        >
          <rect x="30" y="30" width="140" height="140" fill={TEAL} />
          <rect x="50" y="50" width="100" height="100" fill="none" stroke={CREAM} strokeWidth="2" />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-8 min-h-[92svh] items-center">
          <div className="col-span-12 md:col-span-7">
            <p className="text-xs uppercase tracking-[0.42em] mb-8" style={{ color: RUST }}>
              ✦ The Florenza Quarterly · Spring '26 ✦
            </p>
            <h1
              className="font-[var(--font-display)] leading-[0.92] tracking-[-0.03em] mb-8"
              style={{
                fontSize: 'clamp(3rem, 9vw, 8rem)',
                fontWeight: 600,
              }}
            >
              <span>А new</span>
              <br />
              <span style={{ color: TEAL }}>arrange&shy;</span>
              <span style={{ color: RUST }}>ment</span>
              <br />
              <em style={{ fontStyle: 'italic', color: MUSTARD }}>of flowers.</em>
            </h1>
            <p className="text-base md:text-lg max-w-md mb-10 leading-relaxed">
              Авторська флористика з дотиком mid-century. Геометрія, композиція, колір.
              Доставка по Ірпеню — від однієї години.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/buketu"
                className="inline-block px-7 py-3 text-sm uppercase tracking-[0.32em] font-medium transition-transform hover:-translate-y-0.5"
                style={{ background: INK, color: CREAM }}
              >
                Каталог →
              </Link>
              <Link
                href="/about"
                className="inline-block px-7 py-3 text-sm uppercase tracking-[0.32em] font-medium border-2"
                style={{ borderColor: INK, color: INK }}
              >
                Про маєток
              </Link>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 relative">
            {featured[0] && (
              <div className="relative aspect-[4/5]">
                <div
                  className="absolute inset-3 z-0"
                  style={{
                    background: TEAL,
                    transform: 'translate(20px, 20px)',
                  }}
                />
                <Image
                  src={featured[0].primaryImageUrl}
                  alt={featured[0].imageAlt}
                  fill
                  priority
                  sizes="40vw"
                  className="object-cover relative z-10"
                  style={{ filter: 'saturate(0.92) contrast(1.05)' }}
                />
                <div
                  className="absolute -bottom-6 -left-6 z-20 px-4 py-2 text-xs uppercase tracking-wider font-mono"
                  style={{ background: MUSTARD, color: INK }}
                >
                  Plate I · Cover
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Marquee tape strip */}
      <section
        className="overflow-hidden py-3 border-y-2"
        style={{ background: INK, color: CREAM, borderColor: MUSTARD }}
      >
        <p
          className="font-[var(--font-display)] text-2xl md:text-3xl whitespace-nowrap"
          style={{ fontWeight: 600 }}
        >
          ◆ FLORENZA ◆ Преміум флористика ◆ Ірпінь · Буча · Гостомель ◆ Доставка 60 хв ◆
          1200+ букетів за рік ◆ FLORENZA ◆
        </p>
      </section>

      {/* Featured — asymmetric mid-century grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="grid grid-cols-12 mb-16">
          <div className="col-span-12 md:col-span-5">
            <p className="text-xs uppercase tracking-[0.42em] mb-3" style={{ color: RUST }}>
              Каталог · 02 / 06
            </p>
            <h2
              className="font-[var(--font-display)] text-5xl md:text-6xl tracking-[-0.02em]"
              style={{ fontWeight: 600 }}
            >
              Букети сезону
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 mt-6 md:mt-0">
            <p className="text-base leading-[1.85] opacity-80">
              Шість фаворитів цього сезону. Кожен — окрема композиція, складена за
              принципом золотого перетину: один акцент, два другорядних, безліч деталей.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {featured.slice(0, 6).map((b, i) => {
            const colors = [MUSTARD, TEAL, RUST];
            const color = colors[i % 3];
            const span = i === 0 ? 'col-span-12 md:col-span-7' : i === 1 ? 'col-span-12 md:col-span-5' : 'col-span-6 md:col-span-4';
            const aspect = i < 2 ? 'aspect-[4/5]' : 'aspect-[3/4]';
            return (
              <Link key={b.slug} href={`/buket/${b.slug}`} className={`group block ${span}`}>
                <div className={`relative ${aspect} overflow-hidden`}>
                  <div
                    className="absolute inset-2 z-0"
                    style={{ background: color, transform: 'translate(8px, 8px)' }}
                  />
                  <div className="absolute inset-0 z-10 overflow-hidden">
                    <Image
                      src={b.primaryImageUrl}
                      alt={b.imageAlt}
                      fill
                      sizes="50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div
                    className="absolute top-4 left-4 z-20 px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
                    style={{ background: CREAM, color: INK }}
                  >
                    Plate {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3
                    className="font-[var(--font-display)] text-xl md:text-2xl"
                    style={{ fontWeight: 600 }}
                  >
                    {b.name}
                  </h3>
                  <p
                    className="text-sm font-mono px-2 py-0.5"
                    style={{ background: color, color: i === 1 ? CREAM : INK }}
                  >
                    {b.price.toLocaleString('uk-UA')} ₴
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats with mid-century geometric icons */}
      <section
        className="py-20 px-6 md:px-12 border-y-2"
        style={{ background: TEAL, color: CREAM, borderColor: INK }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: '36', l: 'композицій', icon: <circle cx="20" cy="20" r="16" fill={MUSTARD} /> },
            { v: '60′', l: 'доставка', icon: <rect x="6" y="6" width="28" height="28" fill={RUST} /> },
            { v: '5d', l: 'гарантія', icon: <polygon points="20,4 36,36 4,36" fill={MUSTARD} /> },
            { v: '24/7', l: 'прийом', icon: <rect x="4" y="14" width="32" height="12" fill={RUST} /> },
          ].map((s) => (
            <div key={s.l}>
              <svg viewBox="0 0 40 40" className="w-12 h-12 mx-auto mb-4">{s.icon}</svg>
              <p
                className="font-[var(--font-display)] text-5xl md:text-6xl"
                style={{ fontWeight: 600 }}
              >
                {s.v}
              </p>
              <p className="text-xs uppercase tracking-[0.32em] mt-3 opacity-80">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roses with retro shape composition */}
      <section className="py-24 px-6 md:px-12 relative overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute right-0 top-0 w-[35vw] h-[35vw] pointer-events-none opacity-90"
          viewBox="0 0 200 200"
        >
          <polygon points="100,20 180,180 20,180" fill={RUST} />
        </svg>
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-5">
            <p className="text-xs uppercase tracking-[0.42em] mb-6" style={{ color: RUST }}>
              Plate 04 · Roses by quantity
            </p>
            <h2
              className="font-[var(--font-display)] leading-[0.95] mb-6 tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600 }}
            >
              <span style={{ color: TEAL }}>51.</span>
              <span style={{ color: MUSTARD }}> 75.</span>
              <span style={{ color: RUST }}> 101.</span>
              <br />
              151. 201. 301.
            </h2>
            <p className="text-base mb-8 max-w-md leading-relaxed">
              Преміум червоні троянди 60 см. Класичне оформлення з оксамитовою
              стрічкою. Зміни за один день.
            </p>
            <Link
              href="/buketu?type=veliki-troyandy"
              className="inline-block px-7 py-3 text-sm uppercase tracking-[0.32em] font-medium"
              style={{ background: INK, color: CREAM }}
            >
              Усі великі →
            </Link>
          </div>
          <div className="col-span-12 md:col-span-7 grid grid-cols-3 gap-3">
            {bigRoses.slice(0, 6).map((b, i) => (
              <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden">
                  <div
                    className="absolute inset-1 z-0"
                    style={{
                      background: [MUSTARD, TEAL, RUST][i % 3],
                      transform: 'translate(4px, 4px)',
                    }}
                  />
                  <div className="absolute inset-0 z-10">
                    <Image
                      src={b.primaryImageUrl}
                      alt={b.imageAlt}
                      fill
                      sizes="20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs uppercase tracking-wider opacity-80">
                  {b.name.match(/\d+/)?.[0] ?? '—'} stems
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Balloons row */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto" style={{ background: MUSTARD }}>
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.42em] mb-4">Plate 05 · Balloons</p>
          <h2
            className="font-[var(--font-display)] text-5xl md:text-6xl leading-[0.95]"
            style={{ fontWeight: 600 }}
          >
            <em style={{ fontStyle: 'italic', color: TEAL }}>Atmosphere</em>
            <br />
            in helium.
          </h2>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {balloons.slice(0, 3).map((b) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block bg-[#f4ede0] p-3">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-2 py-3 flex items-center justify-between">
                <p className="font-[var(--font-display)] text-base font-bold">{b.name}</p>
                <p className="font-mono text-xs">{b.price.toLocaleString('uk-UA')} ₴</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center" style={{ background: INK, color: CREAM }}>
        <p className="font-[var(--font-display)] text-3xl mb-3" style={{ fontWeight: 600 }}>
          Florenza ◆ Quarterly
        </p>
        <p className="text-xs uppercase tracking-[0.42em] opacity-70">
          Issue 01 · Spring 2026 · Ірпінь · Україна · End of catalogue
        </p>
      </footer>
    </main>
  );
}
