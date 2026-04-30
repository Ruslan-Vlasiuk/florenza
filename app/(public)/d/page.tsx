import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Florenza — 25 design directions',
  robots: { index: false, follow: false },
};

const VARIANTS = [
  { slug: 'v01', name: 'Aesop · Quiet minimalism', mood: 'cream / wide whitespace / serif type' },
  { slug: 'v02', name: 'Vogue · Magazine editorial', mood: 'oversized type / asymmetric grid' },
  { slug: 'v03', name: 'Burberry · Cinematic', mood: 'full-bleed video / dark moody' },
  { slug: 'v04', name: 'Cereal · Photography-driven', mood: 'minimal copy / wide images' },
  { slug: 'v05', name: 'Loewe · Bold blocks', mood: 'saturated colour blocks / type-art' },
  { slug: 'v06', name: 'Tom Ford · Luxe noir', mood: 'black ground / gold accent / spacious' },
  { slug: 'v07', name: 'Margiela · Experimental type', mood: 'unsettled type / off-grid' },
  { slug: 'v08', name: 'Hermès · Retro premium', mood: 'cognac & cream / classical layout' },
  { slug: 'v09', name: 'Glossier · Soft pastel', mood: 'blush & dusty rose / round shapes' },
  { slug: 'v10', name: 'Apple · Gallery clean', mood: 'white / generous grid / centered' },
  { slug: 'v11', name: 'Stripe · Mesh gradient', mood: 'animated gradient / technical premium' },
  { slug: 'v12', name: 'Linear · Dark glow', mood: 'midnight base / luminous accents' },
  { slug: 'v13', name: 'Notion · Color-coded', mood: 'tagged sections / playful but tasteful' },
  { slug: 'v14', name: 'Kinfolk · Slow living', mood: 'paper grain / hand-drawn marks' },
  { slug: 'v15', name: 'Brutalist · Architectural B/W', mood: 'mono / bold ratios / hard edges' },
  { slug: 'v16', name: 'Mid-century · Editorial', mood: 'mustard / teal / geometric' },
  { slug: 'v17', name: 'Japanese · Ma negative space', mood: 'extreme whitespace / vertical type' },
  { slug: 'v18', name: 'Italian villa · Terracotta', mood: 'sun-baked clay / olive / stone' },
  { slug: 'v19', name: 'Provence · Wedding rustic', mood: 'lavender / linen / paper' },
  { slug: 'v20', name: 'Scandinavian · Linen', mood: 'pale wood / muted greens / clean grid' },
  { slug: 'v21', name: 'NY gallery · White cube', mood: 'pure white / single hero / strict grid' },
  { slug: 'v22', name: 'Parisian · Art nouveau', mood: 'curved frames / ornate type / botanicals' },
  { slug: 'v23', name: 'Sketch · Hand-drawn', mood: 'pencil illustrations / paper texture' },
  { slug: 'v24', name: 'Type-as-art', mood: 'enormous type / image inside letters' },
  { slug: 'v25', name: 'Cinematic · Widescreen', mood: 'letterboxed / horizontal scroll feel' },
];

export default function DesignIndex() {
  return (
    <section className="editorial-container py-20 md:py-28">
      <header className="max-w-2xl mb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-sage-deep)] mb-4">
          25 напрямів дизайну
        </p>
        <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-[var(--color-deep-forest)] mb-6">
          Florenza · landing directions
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
          25 повноцінних варіантів головної сторінки в різних естетиках. Прев'ю
          одного дизайну вже видно в карточці; клік відкриває повну сторінку.
          Поточний продакшн-дизайн доступний на{' '}
          <Link href="/" className="underline">
            «/»
          </Link>
          .
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {VARIANTS.map((v, i) => (
          <Link
            key={v.slug}
            href={`/d/${v.slug}`}
            className="group block"
          >
            <div className="aspect-[4/5] relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-cream-soft)] border border-[var(--color-border-soft)] transition-all duration-500 group-hover:shadow-[var(--shadow-hover)]">
              <iframe
                src={`/d/${v.slug}`}
                className="w-[1280px] h-[1600px] origin-top-left scale-[0.25] pointer-events-none"
                aria-hidden="true"
                title={v.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-deep-forest)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)]">
                {String(i + 1).padStart(2, '0')} · {v.slug}
              </p>
              <h2 className="mt-2 font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)] leading-tight">
                {v.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{v.mood}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
