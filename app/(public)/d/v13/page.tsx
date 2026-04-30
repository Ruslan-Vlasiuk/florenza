import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V13 · Notion · Color-coded' };
export const revalidate = 300;

export default async function V13() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: '#fbfaf8', color: '#191919' }}>
      {/* Header — Notion-like nav with emoji breadcrumb */}
      <nav className="sticky top-0 z-30 bg-[#fbfaf8] border-b border-[#e9e6df] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <span className="opacity-50">🌸</span>
          <span className="opacity-80">Florenza</span>
          <span className="opacity-30">/</span>
          <span className="opacity-80">Catalogue</span>
          <span className="opacity-30">/</span>
          <span className="font-medium">Spring 2026</span>
        </div>
      </nav>

      {/* Hero — clean centered with friendly emojis */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <p className="text-base mb-4 opacity-70">🌷 Spring 2026 collection</p>
        <h1
          className="font-[var(--font-display)] leading-[1.1] mb-6 tracking-[-0.02em]"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600 }}
        >
          A simple, organised
          <br />
          <em style={{ fontStyle: 'italic' }}>florist</em> for every reason.
        </h1>
        <p className="text-lg leading-relaxed opacity-75 max-w-2xl mb-10">
          Florenza — це 36 авторських композицій, ясні описи складу, чесна ціна.
          Замовляйте за 1 хв через сайт або в Telegram.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/buketu"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#191919] hover:text-white transition-colors border border-[#191919]"
          >
            ▸ Browse catalogue
          </Link>
          <Link
            href="#highlights"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#f0eee9]"
          >
            ⌘K Quick lookup
          </Link>
        </div>
      </section>

      {/* Tag system — color-coded categories */}
      <section className="px-6 mb-12 max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-wider mb-4 opacity-60">Tags</p>
        <div className="flex flex-wrap gap-2">
          {[
            { l: '🌹 Roses', c: '#fde2dd', t: '#a8312a' },
            { l: '🎈 Balloons', c: '#dde9fb', t: '#1f4ea3' },
            { l: '💐 Mixed', c: '#e6f4dc', t: '#3b6c1f' },
            { l: '🥀 Single', c: '#f6ecdb', t: '#7c4f1c' },
            { l: '🤍 Wedding', c: '#f1eaf6', t: '#5a3878' },
            { l: '🎁 Gifts', c: '#fdf3d3', t: '#76571f' },
          ].map((t) => (
            <span
              key={t.l}
              className="px-3 py-1.5 rounded-md text-sm font-medium"
              style={{ background: t.c, color: t.t }}
            >
              {t.l}
            </span>
          ))}
        </div>
      </section>

      {/* Featured grid — gallery style with notion-like cards */}
      <section id="highlights" className="px-6 py-12 max-w-7xl mx-auto">
        <h2
          className="font-[var(--font-display)] text-3xl md:text-4xl mb-8"
          style={{ fontWeight: 600 }}
        >
          ⭐ Highlights
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.slice(0, 8).map((b) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="group block rounded-xl border border-[#e9e6df] p-3 hover:border-[#19191955] hover:bg-white transition-colors"
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-3 bg-[#f0eee9]">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <span
                  className="inline-block px-2 py-0.5 rounded text-[11px] font-medium"
                  style={{ background: '#fde2dd', color: '#a8312a' }}
                >
                  🌹 mixed
                </span>
                <h3 className="font-medium text-sm">{b.name}</h3>
                <p className="text-xs opacity-60">
                  {b.price.toLocaleString('uk-UA')} грн · in stock
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses table — Notion table style */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <h2
          className="font-[var(--font-display)] text-3xl md:text-4xl mb-2"
          style={{ fontWeight: 600 }}
        >
          🌹 Big rose bouquets
        </h2>
        <p className="text-base opacity-65 mb-8">
          Premium 60 cm red roses · hand-tied · velvet ribbon
        </p>
        <div className="rounded-lg border border-[#e9e6df] overflow-hidden bg-white">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs uppercase tracking-wider opacity-60 border-b border-[#e9e6df]">
            <span className="col-span-1">№</span>
            <span className="col-span-2">Image</span>
            <span className="col-span-4">Name</span>
            <span className="col-span-3">Stems</span>
            <span className="col-span-2 text-right">Price</span>
          </div>
          {bigRoses.map((b, i) => (
            <Link
              key={b.slug}
              href={`/buket/${b.slug}`}
              className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-[#fafaf8] transition-colors"
              style={{ borderBottom: i < bigRoses.length - 1 ? '1px solid #f0eee9' : undefined }}
            >
              <p className="col-span-1 text-sm opacity-50">{i + 1}</p>
              <div className="col-span-2 relative aspect-square rounded-md overflow-hidden">
                <Image src={b.primaryImageUrl} alt="" fill sizes="10vw" className="object-cover" />
              </div>
              <p className="col-span-4 font-medium text-sm">{b.name}</p>
              <p className="col-span-3 text-sm">
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{ background: '#fde2dd', color: '#a8312a' }}
                >
                  {b.name.match(/\d+/)?.[0] ?? '—'} stems
                </span>
              </p>
              <p className="col-span-2 text-sm text-right font-medium">
                {b.price.toLocaleString('uk-UA')} грн
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Callouts row — colored info blocks */}
      <section className="px-6 py-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { e: '🚚', t: 'Доставка', d: '60–90 хв в Ірпені, Бучі та Гостомелі', bg: '#dde9fb' },
          { e: '✓', t: 'Гарантія', d: '5 днів свіжість або заміна букета', bg: '#e6f4dc' },
          { e: '💬', t: '24/7', d: 'Telegram, чат, телефон', bg: '#fdf3d3' },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded-xl p-6"
            style={{ background: c.bg }}
          >
            <p className="text-2xl mb-2">{c.e}</p>
            <p className="font-medium text-base mb-1">{c.t}</p>
            <p className="text-sm opacity-75">{c.d}</p>
          </div>
        ))}
      </section>

      <footer className="px-6 py-12 text-center border-t border-[#e9e6df] mt-12">
        <p className="text-sm opacity-50">
          🌸 Florenza · made with care in Ірпінь
        </p>
      </footer>
    </main>
  );
}
