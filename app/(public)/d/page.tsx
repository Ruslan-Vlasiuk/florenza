import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Florenza — 25 design directions',
  robots: { index: false, follow: false },
};

interface VariantMeta {
  slug: string;
  name: string;
  mood: string;
  /** Background colour pair used for the preview card. */
  bg: string;
  fg: string;
  accent?: string;
  /** Font weight & style hint shown in preview. */
  display?: 'serif' | 'mono' | 'display';
  italic?: boolean;
}

const VARIANTS: VariantMeta[] = [
  { slug: 'v01', name: 'Aesop · Quiet minimalism',     mood: 'cream / wide whitespace / serif',         bg: '#f5f0e8', fg: '#2c3e2d', italic: true },
  { slug: 'v02', name: 'Vogue · Magazine editorial',   mood: 'oversized type / asymmetric grid',        bg: '#fafafa', fg: '#0a0a0a', italic: true },
  { slug: 'v03', name: 'Burberry · Cinematic',         mood: 'full-bleed images / dark moody',          bg: '#0e0d0c', fg: '#f0e7da' },
  { slug: 'v04', name: 'Cereal · Photography-driven',  mood: 'wide landscape hero',                     bg: '#f1ede5', fg: '#1f1d18' },
  { slug: 'v05', name: 'Loewe · Bold blocks',          mood: 'rust + cream colour blocks',              bg: '#c84a32', fg: '#f3e8d6', accent: '#1a1612' },
  { slug: 'v06', name: 'Tom Ford · Luxe noir',         mood: 'black + gold thread',                     bg: '#0c0a08', fg: '#e8dec9', accent: '#c9a868', italic: true },
  { slug: 'v07', name: 'Margiela · Experimental type', mood: 'numbered tags / off-grid',                bg: '#fbfbf9', fg: '#111', display: 'mono' },
  { slug: 'v08', name: 'Hermès · Retro premium',       mood: 'cognac + parchment',                      bg: '#f4ecd8', fg: '#2a1d10', accent: '#a0633a', italic: true },
  { slug: 'v09', name: 'Glossier · Soft pastel',       mood: 'blush + round shapes',                    bg: '#fde6e3', fg: '#3a2a26', accent: '#d97a72' },
  { slug: 'v10', name: 'Apple · Gallery clean',        mood: 'white / generous grid',                   bg: '#ffffff', fg: '#1d1d1f', accent: '#0071e3' },
  { slug: 'v11', name: 'Stripe · Mesh gradient',       mood: 'animated gradient mesh',                  bg: '#fbfafe', fg: '#0b1c3d', accent: '#635bff' },
  { slug: 'v12', name: 'Linear · Dark glow',           mood: 'midnight + luminous glow',                bg: '#08080b', fg: '#e8e9ee', accent: '#7b6dd6', display: 'mono' },
  { slug: 'v13', name: 'Notion · Color-coded',         mood: 'tagged sections / playful',               bg: '#fbfaf8', fg: '#191919', accent: '#a8312a' },
  { slug: 'v14', name: 'Kinfolk · Slow living',        mood: 'paper grain / journal',                   bg: '#f0e9da', fg: '#3a2e20', accent: '#7d8463', italic: true },
  { slug: 'v15', name: 'Brutalist · B/W',              mood: 'hard borders / mono',                     bg: '#ffffff', fg: '#000000', display: 'display' },
  { slug: 'v16', name: 'Mid-century · Editorial',      mood: 'mustard / teal / rust',                   bg: '#f4ede0', fg: '#2a201a', accent: '#d4a83e' },
  { slug: 'v17', name: 'Japanese · Ma negative space', mood: 'sparse vertical / kanji',                 bg: '#f3eee5', fg: '#1a1612', accent: '#b03a2e', italic: true },
  { slug: 'v18', name: 'Italian villa · Terracotta',   mood: 'sun-baked clay / arches',                 bg: '#e6dcc8', fg: '#3a221a', accent: '#c66c4e' },
  { slug: 'v19', name: 'Provence · Wedding rustic',    mood: 'lavender / linen',                        bg: '#f7f3ea', fg: '#3d2f3a', accent: '#a08fc4', italic: true },
  { slug: 'v20', name: 'Scandinavian · Linen',         mood: 'sand / forest / clean',                   bg: '#f3eee2', fg: '#1f1d18', accent: '#3a4a3c' },
  { slug: 'v21', name: 'NY gallery · White cube',      mood: 'pure white / strict grid',                bg: '#ffffff', fg: '#000000', display: 'mono' },
  { slug: 'v22', name: 'Parisian · Art nouveau',       mood: 'ornate gold vines',                       bg: '#f1e7d0', fg: '#28201a', accent: '#a98538', italic: true },
  { slug: 'v23', name: 'Sketch · Hand-drawn',          mood: 'paper / polaroid / pencil',               bg: '#fbf6ec', fg: '#3a342c', accent: '#a83f30', italic: true },
  { slug: 'v24', name: 'Type-as-art',                  mood: 'image-clipped letterforms',               bg: '#ffffff', fg: '#000000', display: 'display' },
  { slug: 'v25', name: 'Cinematic · Widescreen',       mood: 'letterboxed 21:9 / film',                 bg: '#0a0a0a', fg: '#f3eee5', italic: true },
];

function PreviewCard({ v }: { v: VariantMeta }) {
  const fontStyle = v.italic ? 'italic' : 'normal';
  const fontFamily =
    v.display === 'mono' ? 'var(--font-mono)' : 'var(--font-display)';
  return (
    <div
      className="aspect-[4/5] relative overflow-hidden rounded-[var(--radius-lg)] border border-black/5 transition-all duration-500 group-hover:shadow-[var(--shadow-hover)] flex flex-col"
      style={{ background: v.bg, color: v.fg }}
    >
      {/* Decorative top label */}
      <div className="px-6 pt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.32em]">
        <span style={{ color: v.accent ?? v.fg, opacity: 0.7 }}>{v.slug}</span>
        <span style={{ opacity: 0.5 }}>preview</span>
      </div>

      {/* Centered "type sample" */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p
          className="leading-[0.92] tracking-[-0.02em]"
          style={{
            fontFamily,
            fontStyle,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: v.fg,
            fontWeight: v.display === 'display' ? 700 : 400,
          }}
        >
          Florenza
        </p>
        {v.accent && (
          <div
            className="my-3 h-px w-10"
            style={{ background: v.accent, opacity: 0.7 }}
          />
        )}
        <p
          className="text-[10px] uppercase tracking-[0.32em]"
          style={{ color: v.accent ?? v.fg, opacity: 0.7 }}
        >
          {v.mood}
        </p>
      </div>

      {/* Decorative bottom indicator */}
      <div className="px-6 pb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
        <span style={{ opacity: 0.5 }}>open ↗</span>
        <span style={{ opacity: 0.5 }}>{v.slug.replace('v', '')}/25</span>
      </div>

      {/* Decorative big number watermark */}
      <span
        className="absolute -bottom-6 -right-2 font-[var(--font-display)] leading-none pointer-events-none select-none"
        style={{
          fontSize: '12rem',
          color: v.accent ?? v.fg,
          opacity: 0.04,
          fontWeight: 700,
        }}
      >
        {v.slug.replace('v', '')}
      </span>
    </div>
  );
}

export default function DesignIndex() {
  return (
    <section className="editorial-container py-20 md:py-28">
      <header className="max-w-2xl mb-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-sage-deep)] mb-4">
          25 design directions
        </p>
        <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-[var(--color-deep-forest)] mb-6">
          Florenza · choose a direction
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
          25 повноцінних варіантів головної в різних естетиках. Прев&apos;юшки нижче —
          це паспорти варіантів (швидко завантажуються). Клік відкриває справжню
          сторінку.
        </p>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Поточний продакшн-дизайн —{' '}
          <Link href="/" className="underline">
            «/»
          </Link>
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
        {VARIANTS.map((v, i) => (
          <Link key={v.slug} href={`/d/${v.slug}`} className="group block">
            <PreviewCard v={v} />
            <div className="mt-3">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-sage-deep)]">
                {String(i + 1).padStart(2, '0')} · {v.slug}
              </p>
              <h2 className="mt-1 font-[var(--font-display)] text-xl text-[var(--color-deep-forest)] leading-tight">
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
