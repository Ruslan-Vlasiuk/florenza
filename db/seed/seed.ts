/* eslint-disable no-console */
/**
 * Demo seed orchestrator.
 * Run with: pnpm seed:demo
 *
 * Idempotent — safe to re-run. Marks all created entities with is_demo: true.
 */
import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../../payload.config';

import { TYPES, FLOWERS, OCCASIONS } from './data/taxonomies';
import { DEMO_BOUQUETS } from './data/bouquets';
import { BLOG_TOPICS } from './data/blog-topics';
import { DEMO_REVIEWS } from './data/reviews';
import { DEMO_WEDDING_CASES, DEMO_CORPORATE_CASES } from './data/wedding-cases';
import { seedDeliveryZones } from './delivery-zones';
import { seedDeliverySlots } from './delivery-slots';
import { seedLegalDocs } from './legal-docs';
import { downloadStockImage } from './stock-image';

async function main() {
  console.log('🌸 Florenza demo seed starting...\n');

  const payload = await getPayload({ config });

  // === 1. Taxonomies ===
  console.log('📋 Seeding taxonomies...');
  const typeMap: Record<string, string> = {};
  for (const t of TYPES) {
    const existing = await payload.find({
      collection: 'categories-type',
      where: { slug: { equals: t.slug } },
      limit: 1,
    });
    if (existing.docs[0]) {
      typeMap[t.slug] = existing.docs[0].id as string;
      continue;
    }
    const created = await payload.create({
      collection: 'categories-type',
      data: { ...t, isDemo: true } as any,
    });
    typeMap[t.slug] = created.id as string;
  }
  console.log(`  ✓ ${Object.keys(typeMap).length} types`);

  const flowerMap: Record<string, string> = {};
  for (const f of FLOWERS) {
    const existing = await payload.find({
      collection: 'flowers',
      where: { slug: { equals: f.slug } },
      limit: 1,
    });
    if (existing.docs[0]) {
      flowerMap[f.slug] = existing.docs[0].id as string;
      continue;
    }
    const created = await payload.create({
      collection: 'flowers',
      data: { ...f, isDemo: true } as any,
    });
    flowerMap[f.slug] = created.id as string;
  }
  console.log(`  ✓ ${Object.keys(flowerMap).length} flowers`);

  const occasionMap: Record<string, string> = {};
  for (const o of OCCASIONS) {
    const existing = await payload.find({
      collection: 'occasions',
      where: { slug: { equals: o.slug } },
      limit: 1,
    });
    if (existing.docs[0]) {
      occasionMap[o.slug] = existing.docs[0].id as string;
      continue;
    }
    const created = await payload.create({
      collection: 'occasions',
      data: { ...o, isDemo: true } as any,
    });
    occasionMap[o.slug] = created.id as string;
  }
  console.log(`  ✓ ${Object.keys(occasionMap).length} occasions\n`);

  // === 2. Bouquets ===
  console.log('🌷 Seeding 30 bouquets (with stock photos as fallback)...');
  for (let i = 0; i < DEMO_BOUQUETS.length; i++) {
    const b = DEMO_BOUQUETS[i];
    const existing = await payload.find({
      collection: 'bouquets',
      where: { slug: { equals: b.slug } },
      limit: 1,
    });
    if (existing.docs[0]) {
      console.log(`  ⊘ ${b.name} already exists, skipping`);
      continue;
    }

    let primaryImageId: string | undefined;
    try {
      const image = await downloadStockImage(b.unsplashKeywords);
      if (image) {
        const media = await payload.create({
          collection: 'media',
          data: {
            alt: `${b.name} — букет Florenza`,
            sourceProvenance: 'demo_placeholder',
            isDemo: true as any,
          } as any,
          file: { data: image.buffer, mimetype: image.mime, name: `${b.slug}.jpg`, size: image.buffer.length } as any,
        });
        primaryImageId = media.id as string;
      }
    } catch (e) {
      console.warn(`  ⚠ image fail for ${b.name}: ${(e as Error).message}`);
    }

    const discount = b.discount
      ? {
          enabled: true,
          type: b.discount.type,
          amount: b.discount.amount,
          startAt: new Date().toISOString(),
          endAt: new Date(Date.now() + b.discount.daysFromNow * 24 * 60 * 60 * 1000).toISOString(),
          campaignName: 'Стартова акція',
        }
      : { enabled: false };

    await payload.create({
      collection: 'bouquets',
      data: {
        name: b.name,
        slug: b.slug,
        descriptionShort: b.descriptionShort,
        descriptionFull: { root: { children: [{ type: 'paragraph', children: [{ text: b.descriptionFull }] }] } } as any,
        composition: b.composition,
        price: b.price,
        currency: 'UAH',
        primaryImage: primaryImageId,
        imageGenerationContext: b.imagePrompt,
        type: typeMap[b.type],
        mainFlower: flowerMap[b.mainFlower],
        occasions: b.occasions.map((slug) => occasionMap[slug]).filter(Boolean),
        emotionalTone: b.emotionalTone as any,
        forWhom: b.forWhom as any,
        size: b.size,
        seasonality: { yearRound: true },
        preparationHours: b.preparationHours,
        discount,
        metaTitle: `${b.name} — авторський букет Florenza Ірпінь`,
        metaDescription: b.descriptionShort.slice(0, 158),
        status: 'published',
        publishedAt: new Date().toISOString(),
        isDemo: true,
      } as any,
    });
    console.log(`  ✓ ${i + 1}/${DEMO_BOUQUETS.length}  ${b.name}`);
  }

  // === 3. Reviews ===
  console.log('\n⭐ Seeding reviews...');
  for (const r of DEMO_REVIEWS) {
    const existing = await payload.find({
      collection: 'reviews',
      where: { authorName: { equals: r.authorName }, content: { equals: r.content } } as any,
      limit: 1,
    });
    if (existing.docs[0]) continue;
    await payload.create({
      collection: 'reviews',
      data: {
        ...r,
        isPublished: true,
        submittedAt: new Date().toISOString(),
        isDemo: true,
      } as any,
    });
  }
  console.log(`  ✓ ${DEMO_REVIEWS.length} reviews`);

  // === 4. Wedding & Corporate cases ===
  console.log('\n💒 Seeding wedding/corporate cases...');
  for (const w of DEMO_WEDDING_CASES) {
    await payload
      .create({ collection: 'wedding-briefs', data: w as any })
      .catch(() => null);
  }
  for (const c of DEMO_CORPORATE_CASES) {
    await payload
      .create({ collection: 'corporate-inquiries', data: c as any })
      .catch(() => null);
  }
  console.log(`  ✓ ${DEMO_WEDDING_CASES.length} weddings, ${DEMO_CORPORATE_CASES.length} corporate`);

  // === 5. Delivery zones + slots ===
  console.log('\n🚚 Seeding delivery zones + slots...');
  await seedDeliveryZones(payload);
  await seedDeliverySlots(payload);

  // === 6. Blog pipeline queue (30 topics) ===
  console.log('\n📝 Seeding blog pipeline queue (30 topics)...');
  for (const t of BLOG_TOPICS) {
    const existing = await payload.find({
      collection: 'blog-pipeline',
      where: { topic: { equals: t.topic } } as any,
      limit: 1,
    });
    if (existing.docs[0]) continue;
    await payload.create({
      collection: 'blog-pipeline',
      data: {
        topic: t.topic,
        mainKeyword: t.mainKeyword,
        angle: t.angle,
        priority: t.priority as any,
        status: 'queued',
        source: 'demo_seed',
        attemptsCount: 0,
      } as any,
    });
  }
  console.log(`  ✓ ${BLOG_TOPICS.length} topics queued`);

  // === 7. Legal AI drafts ===
  console.log('\n⚖️  Seeding legal AI drafts...');
  await seedLegalDocs(payload);

  // === 8. Brand settings + photo style ===
  console.log('\n🎨 Confirming brand globals...');
  await payload.updateGlobal({
    slug: 'brand-settings' as any,
    data: {
      brandName: 'Florenza',
      legalEntity: 'ФОП Каракой Варвара Олександрівна',
      address: 'м. Ірпінь, вул. Ірпінська 1',
      addressLat: 50.5126,
      addressLng: 30.2464,
      demoModeEnabled: true,
      demoLastSeededAt: new Date().toISOString(),
      monthlyAIBudgetUSD: 30,
    } as any,
  });

  console.log('\n🌸 Demo seed completed.');
  console.log('   Open http://localhost:3000/admin to log in.');
  process.exit(0);
}

main().catch((e) => {
  console.error('seed failed:', e);
  process.exit(1);
});
