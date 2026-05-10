#!/usr/bin/env node
// Regenerate all missing bouquet/balloon photos via Gemini.
// Reads media filenames + bouquet metadata over SSH from the VPS Postgres,
// generates each image, and uploads back into the docker volume directory.
//
// Run:  GEMINI_API_KEY=... node scripts/regenerate-bouquet-photos.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

const VPS = 'root@178.105.38.223';
const VOLUME_PATH = '/var/lib/docker/volumes/florenza_media_uploads/_data';
const MODEL = 'gemini-2.5-flash-image';
const TMP_DIR = path.resolve(process.cwd(), '.tmp/bouquet-photos');
await fs.mkdir(TMP_DIR, { recursive: true });

console.log('Fetching media + bouquet metadata from VPS...');
const { stdout } = await execFileP('ssh', [VPS,
  `docker exec florenza-postgres psql -U florenza -d florenza -tAF'|' -c "
    SELECT m.filename, COALESCE(b.name, ''), '', COALESCE(m.alt, '')
    FROM media m
    LEFT JOIN bouquets b ON b.primary_image_id = m.id
    ORDER BY m.id
  "`,
]);

const records = stdout
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [filename, name, palette, alt] = line.split('|');
    return { filename, name: name || alt, palette };
  });

console.log(`${records.length} images to generate`);

const STYLE = `
Brand aesthetic: editorial florist boutique. Aesop meets Studio Mondine.
Muted, sophisticated palette — cream (#F5F0E8), sage green (#8A9A7B),
dusty rose (#C9A395), deep forest (#2C3E2D). Soft natural window light,
golden-hour warmth, magazine still-life quality. Generous whitespace,
organic asymmetry. Tactile texture — fine paper, oak grain, linen.
Mood: quiet luxury, contemplative.

Strict negatives: NO text, NO typography, NO printed brand logos, NO labels,
NO watermarks, NO faces, NO bodies, NO hands, NO cellophane, NO plastic,
NO ribbons with prints, NO oversaturation, NO neon colors, NO digital
gradients, NO obvious AI artifacts.

VERY IMPORTANT: subject (bouquet or balloon) must be FULLY visible within
the frame, with margins on every side.
`.trim();

const promptFor = ({ filename, name, palette }) => {
  // Detect type from filename
  const isBalloon = /shari|sharik|balloon|fol-/.test(filename);
  if (isBalloon) {
    return `
A bouquet of helium foil and latex balloons in muted-pastel cream, dusty-rose,
and sage tones${palette ? ` (${palette})` : ''}, gathered with a long ribbon,
floating against a cream wall with soft side light. Clean editorial composition.

# Brand style
${STYLE}
`.trim();
  }
  // Bouquet
  return `
A premium florist bouquet${name ? ` "${name}"` : ''}${palette ? ` in ${palette} palette` : ''} ,
loose hand-tied composition with peonies, garden roses, eucalyptus and seasonal
greenery, presented in a small natural decorative box wrapped in soft matte
paper, tied with a thin silk ribbon. The box rests on a pale oak surface,
soft morning window light from the left, gentle sage-tinted shadow.
Vertical portrait composition, bouquet centered with breathing room.

# Brand style
${STYLE}
`.trim();
};

const failed = [];
let done = 0;
const t0 = Date.now();

for (const rec of records) {
  done++;
  const localPath = path.join(TMP_DIR, rec.filename);
  process.stdout.write(`[${done}/${records.length}] ${rec.filename}... `);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptFor(rec) }] }],
          generationConfig: {
            responseModalities: ['IMAGE'],
            imageConfig: { aspectRatio: '4:5' },
          },
        }),
      },
    );

    if (!res.ok) {
      console.log(`HTTP ${res.status}`);
      failed.push(rec.filename);
      continue;
    }

    const json = await res.json();
    const inline = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData ?? p.inline_data);
    const data = inline?.inlineData?.data ?? inline?.inline_data?.data;
    if (!data) {
      console.log('no image');
      failed.push(rec.filename);
      continue;
    }

    // Save PNG temp, convert to JPG matching original filename extension
    const tmpPng = localPath + '.png';
    await fs.writeFile(tmpPng, Buffer.from(data, 'base64'));

    const sharp = (await import('sharp')).default;
    await sharp(tmpPng).jpeg({ quality: 86, mozjpeg: true }).toFile(localPath);
    await fs.unlink(tmpPng);

    const stat = await fs.stat(localPath);
    console.log(`${(stat.size / 1024).toFixed(0)} KB`);
  } catch (e) {
    console.log('ERR:', e.message);
    failed.push(rec.filename);
  }

  await new Promise((r) => setTimeout(r, 300));
}

console.log(`\nGenerated locally in ${((Date.now() - t0) / 1000).toFixed(0)}s.`);
console.log(`Failed: ${failed.length}`, failed.slice(0, 5));

console.log('\nUploading to VPS volume...');
const tarPath = path.resolve(process.cwd(), '.tmp/bouquet-photos.tar');
await execFileP('tar', ['-cf', tarPath, '-C', TMP_DIR, '.']);
await execFileP('scp', [tarPath, `${VPS}:/tmp/bouquet-photos.tar`]);
const remote = `mkdir -p ${VOLUME_PATH} && tar -xf /tmp/bouquet-photos.tar -C ${VOLUME_PATH} && chown -R 1001:1001 ${VOLUME_PATH} && ls ${VOLUME_PATH} | wc -l`;
const { stdout: lsOut } = await execFileP('ssh', [VPS, remote]);
console.log(`Files in volume: ${lsOut.trim()}`);

console.log('Done.');
