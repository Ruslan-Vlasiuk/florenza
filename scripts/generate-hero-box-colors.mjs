#!/usr/bin/env node
// Generate 5 hero-1 variants with different colored decorative paper wrapping the box.
import fs from 'node:fs/promises';
import path from 'node:path';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = path.resolve(process.cwd(), 'public/images/hero');

const STYLE = `
Brand aesthetic: editorial florist boutique. Aesop meets Studio Mondine.
Composition: magazine still-life quality. Soft natural window light from the
left, golden-hour warmth, gentle shadow on the right. Generous whitespace,
organic asymmetry. Tactile texture — fine paper grain, oak grain, raw twine.

Mood: quiet luxury, contemplative, slow craft. Premium, restrained.

Strict negatives: NO text, NO typography on the wrap, NO printed brand logos,
NO labels, NO watermarks, NO faces or full bodies, NO cellophane, NO plastic,
NO ribbons with prints, NO digital-looking gradients, NO oversaturation,
NO obvious AI artifacts, NO neon colors.

Aspect ratio: 3:4 portrait. Vertical composition.
`.trim();

const VARIANTS = [
  {
    suffix: 'a',
    desc: 'dusty-rose / blush-pink wrap',
    color: `wrapped in elegant matte dusty-rose / blush-pink premium florist
paper (color #C9A395 / #D9B5A8), with a single thin cream silk ribbon
tied at the base. The paper is folded with crisp folds, slight texture grain.`,
  },
  {
    suffix: 'b',
    desc: 'deep sage green wrap',
    color: `wrapped in elegant matte deep sage-green premium florist paper
(color #6B7A5E / #5C6B50), with a single thin cream silk ribbon tied at
the base. The paper has fine herringbone-like texture and crisp folds.`,
  },
  {
    suffix: 'c',
    desc: 'burgundy / wine wrap',
    color: `wrapped in elegant matte burgundy / wine-red premium florist paper
(color #6B2C2A / #7A332F), with a single thin antique-brass silk ribbon at
the base. The paper has subtle texture, crisp folds, sophisticated.`,
  },
  {
    suffix: 'd',
    desc: 'warm cream / champagne wrap',
    color: `wrapped in elegant matte warm cream / champagne-beige premium
florist paper (color #E8DCC4 / #DBC7A0), with a single thin sage-green
silk ribbon tied at the base. Subtle texture, crisp folds.`,
  },
  {
    suffix: 'e',
    desc: 'dusty-mauve / lavender wrap',
    color: `wrapped in elegant matte dusty-mauve / lavender-grey premium
florist paper (color #9C8AA0 / #8A7A92), with a single thin cream silk
ribbon at the base. Sophisticated texture, crisp folds, refined.`,
  },
];

const PROMPT_BASE = (variant) => `
A loose hand-tied bouquet of cream peonies, pale-pink garden roses, and
soft eucalyptus leaves, presented inside a small square decorative
flower-box ${variant.color}
The box sits on a pale oak table; a curl of natural jute twine lies beside it.
Soft morning light from the left, warm sage-tinted soft shadow on the right.
Shallow depth of field on the bouquet; the box edges crisply defined.
The colored paper is the visual focus — it should look luxurious, matte,
and tactile, like high-end florist gift wrapping.

# Brand style
${STYLE}
`.trim();

const sharp = (await import('sharp')).default;

for (const variant of VARIANTS) {
  process.stdout.write(`[${variant.suffix}] ${variant.desc}... `);
  const t0 = Date.now();

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: PROMPT_BASE(variant) }] }],
        generationConfig: { responseModalities: ['IMAGE'] },
      }),
    },
  );

  if (!res.ok) {
    console.log(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    continue;
  }

  const json = await res.json();
  const inline = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData ?? p.inline_data);
  const data = inline?.inlineData?.data ?? inline?.inline_data?.data;
  if (!data) {
    console.log('no image returned');
    continue;
  }

  const tmpPath = path.join(OUT_DIR, `hero-1${variant.suffix}.tmp.png`);
  await fs.writeFile(tmpPath, Buffer.from(data, 'base64'));

  const finalPath = path.join(OUT_DIR, `hero-1${variant.suffix}.jpg`);
  await sharp(tmpPath).jpeg({ quality: 86, mozjpeg: true }).toFile(finalPath);
  await fs.unlink(tmpPath);

  const stat = await fs.stat(finalPath);
  console.log(`${(stat.size / 1024).toFixed(0)} KB · ${Date.now() - t0}ms`);

  await new Promise((r) => setTimeout(r, 400));
}

console.log('\nDone. Files:');
const files = (await fs.readdir(OUT_DIR)).filter((f) => /^hero-1[a-e]\.jpg$/.test(f)).sort();
console.log(files);
