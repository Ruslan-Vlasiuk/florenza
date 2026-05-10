#!/usr/bin/env node
// Regenerate the chosen sage-green box variant with proper portrait aspect
// ratio and tighter framing so the bouquet fits without horizontal cropping.
import fs from 'node:fs/promises';
import path from 'node:path';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = path.resolve(process.cwd(), 'public/images/hero');

const PROMPT = `
A loose hand-tied bouquet of cream peonies, pale-pink garden roses, and
soft eucalyptus leaves, presented inside a small square decorative
flower-box wrapped in elegant matte deep sage-green premium florist paper
(color #6B7A5E / #5C6B50), with a single thin cream silk ribbon tied at
the base. Fine herringbone-like paper texture, crisp folds.

Composition: vertical portrait framing. The bouquet sits in the upper-center,
the box centered below. There is generous breathing room on the LEFT and
RIGHT sides of the bouquet — the bouquet width occupies about 60% of the
frame width. The box should not touch the frame edges.

The box rests on a pale oak table; a curl of natural jute twine lies
beside the box on the right. Soft morning light from the left,
warm sage-tinted soft shadow on the right. Shallow depth of field on
the bouquet; the box edges crisply defined.

Brand aesthetic: editorial florist boutique. Aesop meets Studio Mondine.
Magazine still-life quality. Generous whitespace, organic asymmetry.
Tactile texture — fine paper grain, oak grain, raw twine.
Mood: quiet luxury, contemplative, slow craft.

Strict negatives: NO text, NO typography, NO printed brand logos,
NO labels, NO watermarks, NO faces, NO bodies, NO hands, NO cellophane,
NO plastic, NO ribbons with prints, NO digital-looking gradients,
NO oversaturation, NO obvious AI artifacts, NO neon colors.

VERY IMPORTANT: bouquet must be FULLY visible within the frame with
margins on every side. Do not crop the bouquet at the edges.
`.trim();

const sharp = (await import('sharp')).default;

console.log('Regenerating hero-1b (sage green) with 3:4 portrait aspect...');
const t0 = Date.now();

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: PROMPT }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '3:4' },
      },
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

const tmpPath = path.join(OUT_DIR, 'hero-final.tmp.png');
await fs.writeFile(tmpPath, Buffer.from(data, 'base64'));

// Save as the canonical hero-1.jpg replacing the cardboard variant
const finalPath = path.join(OUT_DIR, 'hero-1.jpg');
await sharp(tmpPath).jpeg({ quality: 88, mozjpeg: true }).toFile(finalPath);
await fs.unlink(tmpPath);

const stat = await fs.stat(finalPath);
const meta = await sharp(finalPath).metadata();
console.log(`Saved hero-1.jpg ${meta.width}x${meta.height} (${(stat.size / 1024).toFixed(0)} KB) in ${Date.now() - t0}ms`);
