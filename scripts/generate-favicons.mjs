#!/usr/bin/env node
/**
 * Generate favicon pack + apple-touch-icon + og-default.png from public/logo.svg.
 *
 * Run via: node scripts/generate-favicons.mjs
 */

import sharp from 'sharp';
import toIco from 'to-ico';
import fs from 'node:fs';
import path from 'node:path';

const LOGO = 'public/logo.svg';
const PUBLIC = 'public';
const BG = { r: 245, g: 240, b: 232, alpha: 1 }; // #F5F0E8 cream

const PNG_SIZES = [16, 32, 48, 96, 180, 192, 512];

function logo() {
  return fs.readFileSync(LOGO);
}

async function generatePng(size) {
  const out = path.join(PUBLIC, `favicon-${size}x${size}.png`);
  await sharp(logo())
    .resize(size, size, { fit: 'contain', background: BG })
    .flatten({ background: BG })
    .png()
    .toFile(out);
  console.log(`✓ ${out}`);
}

async function generateIco() {
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(
    sizes.map((s) =>
      sharp(logo())
        .resize(s, s, { fit: 'contain', background: BG })
        .flatten({ background: BG })
        .png()
        .toBuffer(),
    ),
  );
  const ico = await toIco(buffers);
  const out = path.join(PUBLIC, 'favicon.ico');
  fs.writeFileSync(out, ico);
  console.log(`✓ ${out}`);
}

async function generateAppleTouch() {
  const out = path.join(PUBLIC, 'apple-touch-icon.png');
  await sharp(logo())
    .resize(180, 180, { fit: 'contain', background: BG })
    .flatten({ background: BG })
    .png()
    .toFile(out);
  console.log(`✓ ${out}`);
}

async function generateOgDefault() {
  const out = path.join(PUBLIC, 'og-default.png');
  // 1200×630 OG card. Logo centered, scaled to ~50% width.
  const canvas = await sharp({
    create: { width: 1200, height: 630, channels: 4, background: BG },
  })
    .png()
    .toBuffer();

  const logoOverlay = await sharp(logo())
    .resize({ width: 720, height: null, fit: 'contain', background: BG })
    .png()
    .toBuffer();

  await sharp(canvas)
    .composite([{ input: logoOverlay, gravity: 'center' }])
    .png()
    .toFile(out);
  console.log(`✓ ${out}`);
}

(async () => {
  for (const size of PNG_SIZES) await generatePng(size);
  await generateIco();
  await generateAppleTouch();
  await generateOgDefault();
  console.log('\nAll assets generated.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
