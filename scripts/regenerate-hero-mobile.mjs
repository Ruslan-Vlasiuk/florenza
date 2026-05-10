#!/usr/bin/env node
// Generate a landscape (3:2) variant of the hero image for the mobile
// magazine-spread card. Same sage-green box composition, but framed
// horizontally so the card sits roughly half the previous height.
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

Composition: HORIZONTAL landscape framing. The bouquet+box sits in the
center, taking about 55% of the frame width vertically centered. There is
generous breathing room on the LEFT and RIGHT sides of the bouquet — wider
empty space on each side than the bouquet width. The composition reads as
a magazine spread photo from above-eye-level perspective.

Pale oak table beneath the box; a curl of natural jute twine to the right
of the box. Soft morning light from the left, warm sage-tinted soft shadow
on the right. Shallow depth of field on the bouquet.

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
Do not stretch the bouquet horizontally.
`.trim();

const sharp = (await import('sharp')).default;

console.log('Generating hero-1-mobile.jpg with 3:2 landscape aspect...');
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
        imageConfig: { aspectRatio: '3:2' },
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

const tmpPath = path.join(OUT_DIR, 'hero-mobile.tmp.png');
await fs.writeFile(tmpPath, Buffer.from(data, 'base64'));

const finalPath = path.join(OUT_DIR, 'hero-1-mobile.jpg');
await sharp(tmpPath).jpeg({ quality: 88, mozjpeg: true }).toFile(finalPath);
await fs.unlink(tmpPath);

const stat = await fs.stat(finalPath);
const meta = await sharp(finalPath).metadata();
console.log(`Saved hero-1-mobile.jpg ${meta.width}x${meta.height} (${(stat.size / 1024).toFixed(0)} KB) in ${Date.now() - t0}ms`);
