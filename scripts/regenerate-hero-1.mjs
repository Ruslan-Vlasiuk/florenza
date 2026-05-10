#!/usr/bin/env node
// Regenerate hero-1 with cardboard box wrapping instead of linen fabric.
import fs from 'node:fs/promises';
import path from 'node:path';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = path.resolve(process.cwd(), 'public/images/hero');

const STYLE = `
Brand aesthetic: editorial florist boutique. Aesop meets Studio Mondine.
Muted, sophisticated palette — cream (#F5F0E8), sage green (#8A9A7B),
dusty rose (#C9A395), deep forest (#2C3E2D). No saturated reds, no neon.

Composition: magazine still-life quality. Soft natural window light from the
left, golden-hour warmth, gentle shadow on the right. Generous whitespace,
organic asymmetry. Tactile texture — kraft cardboard, oak grain, raw twine.

Mood: quiet luxury, contemplative, slow craft. Premium, restrained.

Strict negatives: NO text, NO typography on the box, NO logos, NO watermarks,
NO faces or full bodies, NO cellophane, NO ribbons with prints, NO plastic,
NO digital-looking gradients, NO oversaturation, NO obvious AI artifacts.

Aspect ratio: 3:4 portrait. Vertical composition.
`.trim();

const PROMPT = `
A loose hand-tied bouquet of cream peonies and pale-pink garden roses
arranged inside a small natural unbleached kraft-cardboard bouquet box
(plain corrugated cardboard, no print, no labels, square or hat-style).
The box sits on a pale oak table; a curl of natural jute twine lies beside it.
Soft morning light from the left, sage-tinted soft shadow on the right.
Shallow depth of field on the bouquet; the box edges crisply defined.

# Brand style
${STYLE}
`.trim();

console.log('Regenerating hero-1 with cardboard box...');
const t0 = Date.now();

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: PROMPT }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  },
);

if (!res.ok) {
  console.error(`HTTP ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const json = await res.json();
const inline = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData ?? p.inline_data);
const data = inline?.inlineData?.data ?? inline?.inline_data?.data;
if (!data) {
  console.error('No image returned:', JSON.stringify(json).slice(0, 500));
  process.exit(1);
}

// Save PNG temp, then convert to JPG
const tmpPath = path.join(OUT_DIR, 'hero-1.tmp.png');
await fs.writeFile(tmpPath, Buffer.from(data, 'base64'));

const sharp = (await import('sharp')).default;
const finalPath = path.join(OUT_DIR, 'hero-1.jpg');
await sharp(tmpPath).jpeg({ quality: 86, mozjpeg: true }).toFile(finalPath);
await fs.unlink(tmpPath);

const stat = await fs.stat(finalPath);
console.log(`Saved hero-1.jpg (${(stat.size / 1024).toFixed(0)} KB) in ${Date.now() - t0}ms`);
