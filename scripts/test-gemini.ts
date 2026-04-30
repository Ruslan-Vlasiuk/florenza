import { config } from 'dotenv';
config({ path: '.env.local' });
import { generateImage } from '../lib/ai/gemini';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
  console.log('Calling Gemini image gen...');
  const start = Date.now();
  const r = await generateImage({
    prompt:
      'A premium editorial photograph of a luxury florist bouquet: a romantic mixed composition with 3 white hydrangeas, 5 pink dianthus, 4 blush spray roses, 2 white lisianthus, eucalyptus, wrapped in soft cream linen with a silk ribbon. Soft natural daylight, shallow depth of field, on a warm marble surface. Editorial Vogue/Cereal magazine quality, hyperrealistic, professional florist photography.',
    globalStylePrompt:
      'Editorial florist boutique aesthetic. Aesop × Studio Mondine. Quiet, elegant, premium. Cream/sage/dusty-rose palette. Soft window light, natural shadows. Magazine-quality composition.',
    aspectRatio: '4:5',
  });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`✅ Got ${r.imagesBase64.length} image(s) in ${elapsed}s, mime: ${r.mimeType}`);

  if (r.imagesBase64.length > 0) {
    const ext = r.mimeType.split('/')[1] || 'png';
    const outPath = path.join(process.cwd(), `public/media/_gemini-test.${ext}`);
    fs.writeFileSync(outPath, Buffer.from(r.imagesBase64[0], 'base64'));
    const size = fs.statSync(outPath).size;
    console.log(`✅ Saved ${outPath} (${(size / 1024).toFixed(0)} KB)`);
    console.log(`Open in browser: http://localhost:3000/media/_gemini-test.${ext}`);
  } else {
    console.log('❌ No image returned. Response was text-only or empty.');
    console.log('Likely cause: model returned text-only or your key has no image gen access.');
  }
})().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
