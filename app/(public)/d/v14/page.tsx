import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V14 · Kinfolk · Slow living' };
export const revalidate = 300;

const PAPER = '#f0e9da';
const PAPER_DEEP = '#e3d8c0';
const INK = '#3a2e20';
const ACCENT = '#7d8463';

export default async function V14() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main
      style={{
        background: PAPER,
        color: INK,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.2'/></svg>")`,
        backgroundSize: '180px',
        backgroundBlendMode: 'multiply',
      }}
    >
      {/* Hero — slow journal-like opening */}
      <section className="pt-20 pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.42em] mb-12 opacity-50">
            № 01 — Spring 2026
          </p>
          <h1
            className="font-[var(--font-display)] leading-[1.05] mb-8"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
              fontVariationSettings: "'opsz' 144, 'wght' 320",
            }}
          >
            On <em style={{ fontStyle: 'italic', color: ACCENT }}>flowers</em>,
            <br />
            and the patience of bringing them home.
          </h1>
          <div
            className="my-10 h-px w-32"
            style={{ background: INK, opacity: 0.3 }}
          />
          <p className="text-base leading-[1.95] max-w-2xl opacity-80">
            Florenza — це повільна квіткарня в Ірпені. Тут не складають букети «на
            швидку руку». Тут пам&apos;ятають як звуть постійних клієнток, які квіти
            ставила мама, і які ароматами наповнював дитинство дім. Кожен букет —
            нагадування про звичайну красу, яку легко не помітити.
          </p>
        </div>
      </section>

      {/* Hero illustration / photo with vintage paper feel */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto">
        {featured[0] && (
          <figure>
            <div
              className="relative aspect-[3/2] overflow-hidden"
              style={{ filter: 'sepia(0.05) saturate(0.92)' }}
            >
              <Image
                src={featured[0].primaryImageUrl}
                alt={featured[0].imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-sm opacity-65 italic">
              На фото: {featured[0].name}. Photo by Каракой В.
            </figcaption>
          </figure>
        )}
      </section>

      {/* Story chapters with hand-drawn divider */}
      <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto">
        <div className="space-y-20">
          {[
            {
              n: 'I',
              t: 'Сезон',
              b: 'Весняні квіти приходять у певному порядку — ранні тюльпани, потім ранункулюси, нарциси, і нарешті півонії. Ми не змушуємо квіти бути там, де їм рано — букет завжди в гармонії з порою року.',
            },
            {
              n: 'II',
              t: 'Колір',
              b: 'У Florenza немає неонів. Палітра тиха: вершковий, шавлія, припилена троянда. Кольори, які жінка може носити, з якими може жити — не «впадають в очі», а тиха підтримка.',
            },
            {
              n: 'III',
              t: 'Деталь',
              b: 'Льон, крафт, оксамит, шовк. Обгортка обирається під настрій букета, ніколи механічно. Стрічка зав\'язується вручну, з вузликом у потрібному місці. П\'ять зайвих хвилин роблять букет подарунком.',
            },
          ].map((c) => (
            <article key={c.n}>
              <div className="flex items-center gap-4 mb-6">
                <span
                  className="font-[var(--font-display)] text-3xl"
                  style={{ color: ACCENT, fontStyle: 'italic' }}
                >
                  {c.n}.
                </span>
                <h3
                  className="font-[var(--font-display)] text-2xl"
                  style={{ fontVariationSettings: "'opsz' 36, 'wght' 320" }}
                >
                  {c.t}
                </h3>
              </div>
              <p className="text-base leading-[1.95] opacity-85">{c.b}</p>
            </article>
          ))}
        </div>

        {/* Hand-drawn sprig divider */}
        <div className="mt-24 flex justify-center opacity-50">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none" stroke={INK} strokeWidth="0.6">
            <path d="M40 5 L40 35" />
            <path d="M40 12 C32 10, 28 12, 26 16 C30 16, 36 14, 40 12" fill={INK} fillOpacity="0.15" />
            <path d="M40 22 C48 20, 52 22, 54 26 C50 26, 44 24, 40 22" fill={INK} fillOpacity="0.15" />
            <path d="M40 30 C32 28, 28 30, 26 34 C30 34, 36 32, 40 30" fill={INK} fillOpacity="0.15" />
          </svg>
        </div>
      </section>

      {/* Catalog — sparse, journaled */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <header className="mb-16">
          <p className="text-[11px] uppercase tracking-[0.42em] opacity-50 mb-3">
            № 04 — Catalogue
          </p>
          <h2
            className="font-[var(--font-display)] text-4xl md:text-5xl mb-4"
            style={{ fontVariationSettings: "'opsz' 144, 'wght' 320" }}
          >
            Кілька <em style={{ fontStyle: 'italic' }}>фаворитів</em>
          </h2>
          <p className="text-base opacity-70 max-w-md">
            Авторські композиції цього сезону. 36 загалом — у каталозі.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featured.slice(0, 4).map((b, i) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block">
              <div
                className="relative aspect-[5/6] overflow-hidden mb-5"
                style={{ filter: 'sepia(0.05) saturate(0.92)' }}
              >
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="50vw"
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-[1.02]"
                />
              </div>
              <p className="text-[11px] uppercase tracking-[0.42em] opacity-50 mb-2">
                Series {String(i + 1).padStart(2, '0')}
              </p>
              <h3
                className="font-[var(--font-display)] text-2xl mb-2"
                style={{ fontVariationSettings: "'opsz' 36, 'wght' 320", fontStyle: 'italic' }}
              >
                {b.name}
              </h3>
              <p className="text-sm opacity-70 leading-relaxed mb-3 max-w-md">
                Авторська композиція, складена вручну. Доставка від однієї години.
              </p>
              <p className="text-sm opacity-60">{b.price.toLocaleString('uk-UA')} грн</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Roses — quiet typographic statement */}
      <section
        className="py-32 px-6 md:px-12 text-center"
        style={{ background: PAPER_DEEP }}
      >
        <p className="text-[11px] uppercase tracking-[0.42em] opacity-50 mb-6">
          № 06 — On a single gesture
        </p>
        <h2
          className="font-[var(--font-display)] text-3xl md:text-5xl leading-[1.2] max-w-3xl mx-auto mb-10"
          style={{ fontStyle: 'italic', fontVariationSettings: "'opsz' 144, 'wght' 320" }}
        >
          «Букет з 51 троянди — це не голос. Це просто тиша, яка більше за слова».
        </h2>
        <Link
          href="/buketu?type=veliki-troyandy"
          className="inline-block text-xs uppercase tracking-[0.32em] border-b pb-1"
          style={{ borderColor: INK }}
        >
          51 → 301 троянд
        </Link>
      </section>

      <footer className="py-16 text-center px-6">
        <p className="text-[11px] uppercase tracking-[0.42em] opacity-50">
          Florenza · Спокійна флористика · Ірпінь · MMXXVI
        </p>
      </footer>
    </main>
  );
}
