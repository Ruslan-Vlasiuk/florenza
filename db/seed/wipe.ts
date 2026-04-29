/* eslint-disable no-console */
/**
 * Wipe all is_demo: true entities. Use after Варвара populated real content.
 * Run with: pnpm seed:wipe-demo
 */
import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../../payload.config';

const COLLECTIONS_WITH_DEMO = [
  'bouquets',
  'categories-type',
  'flowers',
  'occasions',
  'reviews',
  'wedding-briefs',
  'corporate-inquiries',
  'blog-posts',
  'legal-documents',
];

async function main() {
  console.log('🧹 Wiping demo content...\n');
  const payload = await getPayload({ config });

  for (const slug of COLLECTIONS_WITH_DEMO) {
    const r = await payload.find({
      collection: slug as any,
      where: { isDemo: { equals: true } },
      limit: 10000,
    });
    let deleted = 0;
    for (const doc of r.docs) {
      try {
        await payload.delete({ collection: slug as any, id: doc.id });
        deleted++;
      } catch {}
    }
    console.log(`  ✓ ${slug}: deleted ${deleted}`);
  }

  // Wipe blog-pipeline demo entries
  const pipeline = await payload.find({
    collection: 'blog-pipeline',
    where: { source: { equals: 'demo_seed' } },
    limit: 1000,
  });
  for (const doc of pipeline.docs) {
    await payload.delete({ collection: 'blog-pipeline', id: doc.id });
  }
  console.log(`  ✓ blog-pipeline: deleted ${pipeline.docs.length} demo topics`);

  console.log('\n✓ Demo wiped. Real content preserved.');
  process.exit(0);
}

main().catch((e) => {
  console.error('wipe failed:', e);
  process.exit(1);
});
