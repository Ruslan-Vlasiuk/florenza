#!/usr/bin/env node
// Generate 10 hero-image variations via Gemini 2.5 Flash Image (Nano Banana).
// Saves JPEGs to public/images/hero/hero-1.jpg ... hero-10.jpg.
//
// Run:  GEMINI_API_KEY=AIzaSy... node scripts/generate-hero-images.mjs

import fs from 'node:fs/promises';
import path from 'node:path';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error('GEMINI_API_KEY not set');
  process.exit(1);
}

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const OUT_DIR = path.resolve(process.cwd(), 'public/images/hero');
await fs.mkdir(OUT_DIR, { recursive: true });

const STYLE = `
Brand aesthetic: editorial florist boutique. Aesop meets Studio Mondine.
Muted, sophisticated color palette — cream (#F5F0E8), sage green (#8A9A7B),
dusty rose (#C9A395), deep forest (#2C3E2D). No saturated reds, no neon.

Composition: magazine still-life quality. Soft natural window light,
golden-hour warmth, no harsh shadows. Generous whitespace, organic asymmetry.
Tactile texture — linen, raw paper, marble, oak.

Mood: quiet luxury, contemplative, slow craft. Premium, restrained, refined.

Strict negatives: NO text, NO typography, NO logos, NO watermarks,
NO faces or full bodies (hands or partial torso are okay), NO neon colors,
NO plastic, NO cellophane wrapping, NO ribbons with prints, NO gradients
that look digital, NO HDR oversaturation, NO obvious AI artifacts.

Aspect ratio: 3:4 portrait. Vertical composition.
`.trim();

const PROMPTS = [
  'A loose hand-tied bouquet of cream peonies and pale-pink garden roses, wrapped in unbleached linen, resting on a pale oak table beside a curl of natural twine. Morning light from the side. Shallow depth of field, sage-tinted shadow.',
  'Single open garden rose, dewy petals catching window light, isolated against a soft cream wall. Macro detail, the rest fades into blur. Stem visible at bottom, partially out of frame.',
  'Florist in linen apron (only torso and hands visible), trimming flower stems on a wooden block. Petals on the surface. Sunlight from a tall window behind. Studio Mondine atmosphere.',
  'Top-down flat lay of a finished bouquet on washed linen — eucalyptus, white anemones, ranunculus, scattered loose petals around it. Cream backdrop. Editorial magazine spread feel.',
  'Tall hand-blown glass vase holding garden roses, scabiosa, and trailing eucalyptus, against a dusty-rose plaster wall. Side morning light, vase casts a long soft shadow on the table.',
  'Bouquet wrapped in raw kraft paper tied with jute, placed on dark slate stone. Top-down. A single petal has fallen aside. Cream / sage tones, deep contrast against the slate.',
  'Wildflower meadow bouquet — daisies, wild grasses, queen-anne lace, cornflowers — laid on coarse linen cloth on a weathered wood floor. Soft afternoon light streaming through.',
  'Minimal still life: a single long-stemmed white tulip lying on a washed-linen tablecloth, three petals scattered around it. Cream-on-cream. Aesop-style restraint.',
  'A composition of branches with early-blossom buds (magnolia or quince) emerging from a ceramic bud-vase on a beige plaster wall. Tall vertical composition, negative space above.',
  'Detail of tied bouquet stems wrapped with raffia twine knot, monochrome cream-and-sage palette, ultra close-up macro, soft window light from left, slight warm grain.',
];

const REQ_BODY = (text) => ({
  contents: [{ role: 'user', parts: [{ text }] }],
  generationConfig: {
    // For Gemini 2.5 Flash Image — must request IMAGE modality
    responseModalities: ['IMAGE'],
  },
});

for (let i = 0; i < PROMPTS.length; i++) {
  const idx = i + 1;
  const prompt = `${PROMPTS[i]}\n\n# Brand style\n${STYLE}`;

  process.stdout.write(`[${idx}/10] generating... `);
  const t0 = Date.now();

  let res;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(REQ_BODY(prompt)),
      },
    );
  } catch (e) {
    console.log(`FAIL (network): ${e.message}`);
    continue;
  }

  if (!res.ok) {
    const body = await res.text();
    console.log(`FAIL (HTTP ${res.status}): ${body.slice(0, 300)}`);
    continue;
  }

  const json = await res.json();
  const candidates = json?.candidates ?? [];
  let saved = false;
  for (const cand of candidates) {
    for (const part of cand?.content?.parts ?? []) {
      const inline = part?.inlineData ?? part?.inline_data;
      if (inline?.data) {
        const ext = (inline.mimeType ?? inline.mime_type ?? 'image/jpeg').split('/')[1] || 'jpg';
        const out = path.join(OUT_DIR, `hero-${idx}.${ext === 'jpeg' ? 'jpg' : ext}`);
        await fs.writeFile(out, Buffer.from(inline.data, 'base64'));
        const ms = Date.now() - t0;
        console.log(`saved ${path.basename(out)} (${(Buffer.byteLength(inline.data, 'base64') / 1024).toFixed(0)} KB, ${ms}ms)`);
        saved = true;
        break;
      }
    }
    if (saved) break;
  }

  if (!saved) {
    console.log(`NO IMAGE — response: ${JSON.stringify(json).slice(0, 300)}`);
  }

  // Brief pause to be polite to the API
  await new Promise((r) => setTimeout(r, 500));
}

console.log('\nDone. Files in', OUT_DIR);
const files = await fs.readdir(OUT_DIR);
console.log(files.filter((f) => f.startsWith('hero-')).sort());
