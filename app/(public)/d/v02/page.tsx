import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V02 · Vogue · Magazine editorial' };
export const revalidate = 300;

export default async function V02() {
  const { featured, bigRoses, author } = await fetchVariantData();

  return (
    <main style={{ background: '#fafafa', color: '#0a0a0a' }}>
      {/* Hero — magazine cover composition */}
      <section className="relative min-h-screen grid grid-cols-12 gap-0 overflow-hidden">
        {/* Left: enormous serif headline */}
        <div className="col-span-12 md:col-span-7 flex items-center px-6 md:px-16 py-20">
          <div>
            <div className="flex items-center gap-4 mb-12">
              <span className="block w-12 h-px bg-current" />
              <span className="text-[10px] uppercase tracking-[0.5em]">Issue 01 · Spring</span>
            </div>
            <h1
              className="font-[var(--font-display)] text-[clamp(3rem,9vw,9rem)] leading-[0.92] tracking-[-0.04em]"
              style={{ fontVariationSettings: "'opsz' 144, 'wght' 380" }}
            >
              Florenza
              <br />
              <em style={{ fontStyle: 'italic', fontWeight: 320 }}>en fleurs</em>
            </h1>
            <div className="mt-12 grid grid-cols-2 gap-8 max-w-2xl">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] opacity-50 mb-2">
                  Story I
                </p>
                <p className="text-sm leading-relaxed">
                  Премʼєра весняної колекції — півонія Sarah Bernhardt, дельфініум,
                  лізіантус.
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] opacity-50 mb-2">
                  Story II
                </p>
                <p className="text-sm leading-relaxed">
                  101 троянда — як новий ритуал освідчення в епоху коротких переписок.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right: full-bleed image */}
        <div className="col-span-12 md:col-span-5 relative aspect-[4/5] md:aspect-auto">
          {featured[0] && (
            <Image
              src={featured[0].primaryImageUrl}
              alt={featured[0].imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
            />
          )}
          <div className="absolute bottom-8 right-8 text-right text-white">
            <p className="text-[10px] uppercase tracking-[0.32em] mb-1 opacity-90">
              Cover · {featured[0]?.name ?? 'Florenza'}
            </p>
            <p className="font-[var(--font-display)] text-3xl">
              {featured[0]?.price.toLocaleString('uk-UA')} грн
            </p>
          </div>
        </div>
      </section>

      {/* Editorial spread — drop caps, columns */}
      <section className="px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.42em] mb-8 opacity-50">
              Editor's letter · 02
            </p>
            <h2 className="font-[var(--font-display)] text-5xl leading-[0.95] mb-12">
              Букет як редакторський жест.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <p
              className="text-base leading-[1.85]"
              style={{ columnCount: 2, columnGap: '2.5rem' }}
            >
              <span
                className="float-left mr-3 mt-1 font-[var(--font-display)] text-7xl leading-[0.85] font-light"
                style={{ fontStyle: 'italic' }}
              >
                Ф
              </span>
              лоренца — це повільна флористика. Ми не складаємо букети «під ключ» — кожна
              композиція починається з розмови про привід, настрій, людину. Палітра тихий
              крем, шавлія, припилена троянда. Жодних агресивних кольорів. Букет
              поєднується з обличчям клієнтки, з настроєм дня, з інтер&apos;єром — не кричить
              про себе.
            </p>
          </div>
        </div>
      </section>

      {/* 4-up product spread */}
      <section className="bg-[#0a0a0a] text-white py-32 px-6 md:px-16">
        <header className="mb-20 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] opacity-60 mb-4">
              Featured · Spring shortlist
            </p>
            <h2 className="font-[var(--font-display)] text-5xl md:text-6xl leading-[0.95]">
              The Edit
            </h2>
          </div>
          <Link
            href="/buketu"
            className="hidden md:inline-block text-xs uppercase tracking-[0.3em] border-b border-white/40 pb-1"
          >
            Full collection →
          </Link>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
          {featured.slice(0, 4).map((b, i) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group">
              <p className="text-[10px] uppercase tracking-[0.32em] opacity-50 mb-3">
                №{String(i + 1).padStart(2, '0')}
              </p>
              <div className="relative aspect-[3/4] overflow-hidden mb-5">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="font-[var(--font-display)] text-xl">{b.name}</h3>
              <p className="text-sm mt-2 opacity-70">
                {b.price.toLocaleString('uk-UA')} грн
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses spread — half image, half oversize quote */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[80svh]">
        <div className="relative aspect-square md:aspect-auto order-2 md:order-1">
          {bigRoses[0] && (
            <Image
              src={bigRoses[0].primaryImageUrl}
              alt={bigRoses[0].imageAlt}
              fill
              sizes="50vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="order-1 md:order-2 flex items-center px-6 md:px-16 py-20 bg-[#fafafa]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] opacity-50 mb-6">
              Story · 101
            </p>
            <p
              className="font-[var(--font-display)] text-[clamp(2rem,4.5vw,4rem)] leading-[1.05]"
              style={{ fontStyle: 'italic', fontWeight: 320 }}
            >
              «Не за приводом — за відчуттям, що інакше і не сказати».
            </p>
            <Link
              href="/buketu?type=veliki-troyandy"
              className="inline-block mt-12 text-xs uppercase tracking-[0.3em] border-b border-current pb-1"
            >
              51, 101, 201 троянда →
            </Link>
          </div>
        </div>
      </section>

      {/* Closing colophon */}
      <footer className="px-6 md:px-16 py-24 text-center">
        <p className="font-[var(--font-display)] text-3xl md:text-4xl leading-tight max-w-2xl mx-auto">
          Florenza, fin.
        </p>
        <p className="text-[10px] uppercase tracking-[0.42em] mt-6 opacity-50">
          Issue 01 · 2026 · Ірпінь
        </p>
      </footer>
    </main>
  );
}
