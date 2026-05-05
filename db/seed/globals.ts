/**
 * Idempotent seed for BrandVoice / LiyaRules / DeliverySettings / etc.
 *
 * Strategy: each global already declares rich defaultValue blocks in its
 * schema. We just need to trigger Payload's first-load population by calling
 * `findGlobal` and (when needed) writing the result back via `updateGlobal`
 * — that materializes the defaults into the DB row.
 *
 * Safe to re-run: existing values are not overwritten unless a field is null
 * AND a default exists.
 */

import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../../payload.config';

const GLOBAL_SLUGS = [
  'brand-settings',
  'brand-voice',
  'liya-rules',
  'delivery-settings',
  'payment-settings',
  'global-photo-style',
] as const;

async function seedGlobals() {
  const payload = await getPayload({ config });

  for (const slug of GLOBAL_SLUGS) {
    try {
      // Always do an empty update — Payload merges with existing values and
      // writes the row, materializing defaultValue blocks on first run. On
      // subsequent runs nothing actually changes because we pass {}.
      await payload.updateGlobal({ slug: slug as any, data: {} as any });
      console.log(`[seed:globals] Touched: ${slug}`);
    } catch (e) {
      console.error(`[seed:globals] Failed for ${slug}:`, (e as Error).message);
    }
  }

  await payload.destroy();
}

seedGlobals()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed:globals] FAILED:', err);
    process.exit(1);
  });
