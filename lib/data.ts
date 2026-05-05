/**
 * Server-only data fetchers for public pages.
 * All read from Payload via getPayloadClient.
 */
import { getPayloadClient } from './payload-client';
import type { BouquetCardData } from '@/components/florenza/BouquetCard';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://florenza-irpin.com';

function bouquetToCard(b: any): BouquetCardData {
  const primary = b.primaryImage?.url || b.primaryImage?.sizes?.card?.url;
  const galleryFirst = b.gallery?.[0]?.image?.url;
  return {
    id: String(b.id),
    slug: b.slug,
    name: b.name,
    price: b.price,
    primaryImageUrl: primary || `${SITE_URL}/images/placeholder.jpg`,
    hoverImageUrl: galleryFirst,
    imageAlt: b.primaryImage?.alt || b.name,
    discount: b.discount?.enabled
      ? {
          enabled: true,
          type: b.discount.type,
          amount: b.discount.amount,
          endAt: b.discount.endAt,
          campaignName: b.discount.campaignName,
        }
      : null,
    emotionalTone: b.emotionalTone,
    preparationHours: b.preparationHours,
  };
}

export async function fetchFeaturedBouquets(limit = 8): Promise<BouquetCardData[]> {
  try {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'bouquets',
      where: { status: { equals: 'published' } },
      limit,
      sort: '-publishedAt',
      depth: 1,
    });
    return r.docs.map(bouquetToCard);
  } catch (e) {
    console.error('[fetchFeaturedBouquets] error:', e);
    return [];
  }
}

export async function fetchBouquetsByType(typeSlug: string, limit = 6, sortBy: string = 'price'): Promise<BouquetCardData[]> {
  try {
    const payload = await getPayloadClient();
    const types = await payload.find({
      collection: 'categories-type',
      where: { slug: { equals: typeSlug } },
      limit: 1,
    });
    const typeId = types.docs[0]?.id;
    if (!typeId) return [];
    const r = await payload.find({
      collection: 'bouquets',
      where: {
        and: [
          { status: { equals: 'published' } },
          { type: { equals: typeId } },
        ],
      },
      limit,
      sort: sortBy,
      depth: 1,
    });
    return r.docs.map(bouquetToCard);
  } catch (e) {
    console.error(`[fetchBouquetsByType ${typeSlug}] error:`, e);
    return [];
  }
}

export async function fetchBalloons(limit = 6): Promise<BouquetCardData[]> {
  return fetchBouquetsByType('shari', limit, 'price');
}

export async function fetchAuthorBouquets(limit = 6): Promise<BouquetCardData[]> {
  return fetchBouquetsByType('avtorski', limit, '-publishedAt');
}

export async function fetchBigRoseBouquets(limit = 6): Promise<BouquetCardData[]> {
  try {
    const payload = await getPayloadClient();
    const types = await payload.find({
      collection: 'categories-type',
      where: { slug: { equals: 'veliki-troyandy' } },
      limit: 1,
    });
    const typeId = types.docs[0]?.id;
    if (!typeId) return [];
    const r = await payload.find({
      collection: 'bouquets',
      where: {
        and: [
          { status: { equals: 'published' } },
          { type: { equals: typeId } },
        ],
      },
      limit,
      sort: 'price',
      depth: 1,
    });
    return r.docs.map(bouquetToCard);
  } catch (e) {
    console.error('[fetchBigRoseBouquets] error:', e);
    return [];
  }
}

export async function fetchActiveDiscounts(limit = 6): Promise<BouquetCardData[]> {
  try {
    const payload = await getPayloadClient();
    const now = new Date().toISOString();
    const r = await payload.find({
      collection: 'bouquets',
      where: {
        and: [
          { status: { equals: 'published' } },
          { 'discount.enabled': { equals: true } },
          {
            or: [
              { 'discount.endAt': { exists: false } },
              { 'discount.endAt': { greater_than: now } },
            ],
          },
        ],
      },
      limit,
      depth: 1,
    });
    return r.docs.map(bouquetToCard);
  } catch (e) {
    console.error('[fetchActiveDiscounts] error:', e);
    return [];
  }
}

export async function fetchFeaturedReviews(limit = 8) {
  try {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { isPublished: { equals: true } },
          { isFeatured: { equals: true } },
        ],
      },
      limit,
      depth: 0,
    });
    return r.docs.map((rv: any) => ({
      authorName: rv.authorName,
      rating: rv.rating,
      content: rv.content,
      source: rv.source === 'gbp' ? 'Google' : undefined,
    }));
  } catch (e) {
    console.error('[fetchFeaturedReviews] error:', e);
    return [];
  }
}

export async function fetchAllBouquets(filter: any = {}, limit = 100): Promise<BouquetCardData[]> {
  try {
    const payload = await getPayloadClient();
    const where: any = { status: { equals: 'published' }, ...filter };
    const r = await payload.find({
      collection: 'bouquets',
      where,
      limit,
      depth: 1,
    });
    return r.docs.map(bouquetToCard);
  } catch (e) {
    console.error('[fetchAllBouquets] error:', e);
    return [];
  }
}

export async function fetchBouquetBySlug(slug: string) {
  try {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'bouquets',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    return r.docs[0] ?? null;
  } catch (e) {
    console.error('[fetchBouquetBySlug] error:', e);
    return null;
  }
}

export async function fetchSeoPage(urlPath: string) {
  try {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'seo-pages',
      where: { urlPath: { equals: urlPath } },
      limit: 1,
      depth: 1,
    });
    return r.docs[0] ?? null;
  } catch (e) {
    return null;
  }
}

export async function fetchBlogPosts(limit = 30) {
  try {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      limit,
      sort: '-publishedAt',
      depth: 1,
    });
    return r.docs;
  } catch {
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string) {
  try {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    return r.docs[0] ?? null;
  } catch {
    return null;
  }
}

export async function fetchDeliveryZones() {
  try {
    const payload = await getPayloadClient();
    const r = await payload.find({
      collection: 'delivery-zones',
      where: { isActive: { equals: true } },
      limit: 50,
    });
    return r.docs;
  } catch {
    return [];
  }
}
