import Image from 'next/image';
import Link from 'next/link';
import { fetchVariantData } from '@/lib/design-variants/data';

export const metadata = { title: 'V17 · Japanese · Ma negative space' };
export const revalidate = 300;

const WASHI = '#f3eee5';
const SUMI = '#1a1612';
const SHU = '#b03a2e';
const KIN = '#a98a4f';

export default async function V17() {
  const { featured, bigRoses, balloons } = await fetchVariantData();

  return (
    <main style={{ background: WASHI, color: SUMI }}>
      {/* Vertical hero — minimal characters, lots of breath */}
      <section className="relative min-h-screen flex">
        <div className="flex-1 flex items-center justify-center px-12 py-20">
          <div className="max-w-md text-center">
            {/* Tiny vertical line of Japanese-style characters */}
            <div className="mx-auto w-px h-32 mb-12" style={{ background: SUMI, opacity: 0.4 }} />
            <p
              className="text-[10px] uppercase tracking-[0.6em] mb-12"
              style={{ color: SHU }}
            >
              フロレンザ · Florenza
            </p>
            <h1
              className="font-[var(--font-display)] leading-[1.1] mb-12"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontVariationSettings: "'opsz' 144, 'wght' 280",
                fontStyle: 'italic',
              }}
            >
              花。
              <br />
              <span style={{ fontStyle: 'normal' }}>Тиша між квітами.</span>
            </h1>
            <div className="mx-auto w-px h-24 mb-12" style={{ background: SUMI, opacity: 0.4 }} />
            <p className="text-sm leading-[2.2] opacity-75 max-w-xs mx-auto">
              Авторська флористика. Простота. Жодного зайвого. Доставка від однієї
              години в Ірпінь, Бучу та Гостомель.
            </p>
            <div className="mt-16">
              <Link
                href="/buketu"
                className="inline-block text-[10px] uppercase tracking-[0.6em] border-b pb-1"
                style={{ borderColor: SHU, color: SHU }}
              >
                ➜ catalogue
              </Link>
            </div>
          </div>
        </div>
        {/* Single thin red column — like a temple gate hint */}
        <div className="hidden md:block w-[2px] h-screen" style={{ background: SHU, opacity: 0.3 }} />
        <div className="hidden md:flex w-[40vw] items-center justify-center">
          {featured[0] && (
            <div className="relative aspect-[3/4] w-[60%]">
              <Image
                src={featured[0].primaryImageUrl}
                alt={featured[0].imageAlt}
                fill
                priority
                sizes="40vw"
                className="object-cover"
                style={{ filter: 'saturate(0.85) contrast(1.05)' }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Single huge ideogram-style typographic moment */}
      <section className="py-32 text-center px-6">
        <p className="text-[10px] uppercase tracking-[0.6em] mb-12 opacity-50">
          一 · primo
        </p>
        <p
          className="font-[var(--font-display)] text-[clamp(8rem,20vw,20rem)] leading-[0.85]"
          style={{
            fontVariationSettings: "'opsz' 144, 'wght' 240",
            color: SHU,
          }}
        >
          花
        </p>
        <p className="text-xs uppercase tracking-[0.6em] mt-6 opacity-60">
          hana · the flower itself
        </p>
      </section>

      {/* Catalogue — sparse vertical scroll, one bouquet at a time */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto py-32 space-y-32">
        {featured.slice(0, 4).map((b, i) => (
          <Link key={b.slug} href={`/buket/${b.slug}`} className="block group">
            <div className="grid grid-cols-12 gap-8 items-end">
              <div className="col-span-12 md:col-span-7">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={b.primaryImageUrl}
                    alt={b.imageAlt}
                    fill
                    sizes="60vw"
                    className="object-cover transition-transform duration-[1500ms] group-hover:scale-[1.02]"
                    style={{ filter: 'saturate(0.88)' }}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 pb-4">
                <p
                  className="text-[10px] uppercase tracking-[0.6em] mb-6"
                  style={{ color: SHU }}
                >
                  No. {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="font-[var(--font-display)] text-3xl mb-6"
                  style={{ fontVariationSettings: "'opsz' 36, 'wght' 280", fontStyle: 'italic' }}
                >
                  {b.name}
                </h3>
                <div
                  className="my-6 w-12 h-px"
                  style={{ background: SUMI, opacity: 0.4 }}
                />
                <p className="text-sm opacity-75 leading-[1.95]">
                  Авторська композиція. Складена вручну. {b.preparationHours ?? 1}h prep.
                </p>
                <p className="mt-4 text-sm" style={{ color: KIN }}>
                  {b.price.toLocaleString('uk-UA')} 円
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Roses moment — single line of poetry */}
      <section className="py-32 text-center px-6 border-y" style={{ borderColor: 'rgba(26,22,18,0.1)' }}>
        <p className="text-[10px] uppercase tracking-[0.6em] mb-10 opacity-50">
          二 · secondo
        </p>
        <p
          className="font-[var(--font-display)] text-3xl md:text-5xl leading-[1.4] max-w-3xl mx-auto"
          style={{ fontStyle: 'italic', fontVariationSettings: "'opsz' 144, 'wght' 280" }}
        >
          «五一. 一〇一. 三〇一.
          <br />
          The hundred-and-one rose
          <br />
          carries no need for words.»
        </p>
        <Link
          href="/buketu?type=veliki-troyandy"
          className="inline-block mt-16 text-[10px] uppercase tracking-[0.6em] border-b pb-1"
          style={{ borderColor: SHU, color: SHU }}
        >
          ➜ roses by count
        </Link>
      </section>

      {/* Single horizontal line of small balloons */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <p className="text-center text-[10px] uppercase tracking-[0.6em] mb-12 opacity-50">
          三 · ballons · набори
        </p>
        <div className="flex justify-center gap-8 flex-wrap">
          {balloons.slice(0, 6).map((b) => (
            <Link key={b.slug} href={`/buket/${b.slug}`} className="group block w-32">
              <div className="relative aspect-[4/5] overflow-hidden mb-3">
                <Image
                  src={b.primaryImageUrl}
                  alt={b.imageAlt}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-center opacity-80">{b.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="py-32 text-center px-6">
        <div
          className="mx-auto w-px h-24 mb-12"
          style={{ background: SUMI, opacity: 0.3 }}
        />
        <p
          className="font-[var(--font-display)] text-2xl mb-6"
          style={{ fontStyle: 'italic' }}
        >
          フロレンザ
        </p>
        <p className="text-[10px] uppercase tracking-[0.6em] opacity-50">
          Florenza · Ірпінь · MMXXVI
        </p>
      </footer>
    </main>
  );
}
