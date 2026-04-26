import type { MetadataRoute } from 'next';
import { getPayloadClient } from '@/lib/payload-client';

export const dynamic = 'force-dynamic';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://florenza-irpin.com';

const STATIC_PATHS = [
  '/',
  '/buketu',
  '/about',
  '/contacts',
  '/vesilna-floristyka',
  '/korporatyvna-floristyka',
  '/zhurnal',
  '/dostavka-kvitiv-irpin',
  '/dostavka-kvitiv-bucha',
  '/dostavka-kvitiv-hostomel',
  '/oferta',
  '/polityka-konfidentsiynosti',
  '/cookie-policy',
  '/terms',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p === '/' ? 1 : 0.7,
  }));

  try {
    const payload = await getPayloadClient();
    const bouquets = await payload.find({
      collection: 'bouquets',
      where: { status: { equals: 'published' } },
      limit: 500,
    });
    bouquets.docs.forEach((b: any) => {
      entries.push({
        url: `${SITE}/buket/${b.slug}`,
        lastModified: new Date(b.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });

    const blogs = await payload.find({
      collection: 'blog-posts',
      where: { status: { equals: 'published' } },
      limit: 500,
    });
    blogs.docs.forEach((p: any) => {
      entries.push({
        url: `${SITE}/zhurnal/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    });

    const seoPages = await payload.find({
      collection: 'seo-pages',
      where: { status: { equals: 'published' } },
      limit: 500,
    });
    seoPages.docs.forEach((s: any) => {
      entries.push({
        url: `${SITE}${s.urlPath}`,
        lastModified: new Date(s.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    });
  } catch (e) {
    console.error('[sitemap] error', e);
  }

  return entries;
}
