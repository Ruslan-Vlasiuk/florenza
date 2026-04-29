/* eslint-disable no-console */
/**
 * Regenerate AI photos for all demo bouquets.
 * Run with: pnpm seed:demo:photos (after adding GEMINI_API_KEY).
 */
import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../../payload.config';
import { generateImage, isGeminiConfigured } from '../../lib/ai/gemini';

async function main() {
  if (!isGeminiConfigured()) {
    console.error('GEMINI_API_KEY not set. Add to .env first.');
    process.exit(1);
  }
  const payload = await getPayload({ config });

  const photoStyle: any = await payload.findGlobal({ slug: 'global-photo-style' as any });
  const bouquets = await payload.find({
    collection: 'bouquets',
    where: { isDemo: { equals: true } },
    limit: 100,
  });

  console.log(`🎨 Regenerating ${bouquets.docs.length} bouquet photos via Gemini...\n`);

  for (const b of bouquets.docs as any[]) {
    if (!b.imageGenerationContext) continue;
    try {
      const r = await generateImage({
        prompt: b.imageGenerationContext,
        globalStylePrompt: photoStyle?.globalStylePrompt ?? '',
        negativePrompt: photoStyle?.negativePrompt,
        aspectRatio: '4:5',
      });
      if (r.imagesBase64.length === 0) {
        console.warn(`  ⚠ no image returned for ${b.name}`);
        continue;
      }
      const buf = Buffer.from(r.imagesBase64[0], 'base64');
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: `${b.name} — букет Florenza`,
          aiGenerated: true,
          aiGenerationContext: r.promptUsed,
          sourceProvenance: 'ai_generated',
          isDemo: true as any,
        } as any,
        file: {
          data: buf,
          mimetype: r.mimeType,
          name: `${b.slug}-ai.png`,
          size: buf.length,
        } as any,
      });
      await payload.update({
        collection: 'bouquets',
        id: b.id,
        data: { primaryImage: media.id } as any,
      });
      console.log(`  ✓ ${b.name}`);
    } catch (e) {
      console.error(`  ✗ ${b.name}: ${(e as Error).message}`);
    }
  }

  console.log('\nDone.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
