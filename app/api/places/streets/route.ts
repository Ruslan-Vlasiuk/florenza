import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Street/address autocomplete proxy to Nominatim (OpenStreetMap).
 *
 *   GET /api/places/streets?city=Ірпінь&q=київська
 *
 * Why proxy:
 *   - We control the User-Agent header (Nominatim requires one).
 *   - We can rate-limit / cache here without exposing it client-side.
 *   - Single in-memory LRU keeps hot queries cheap.
 *
 * Nominatim usage policy: <= 1 req/sec per IP. We don't hammer it
 * because the client debounces input, and we cache for 24h.
 */

type Suggestion = {
  street: string;
  displayName: string;
  lat: string;
  lon: string;
  osmId: string;
};

const CITIES: Record<string, { name: string; viewbox: string }> = {
  irpin: {
    name: 'Ірпінь',
    // bbox slightly larger than Irpin city
    viewbox: '30.10,50.59,30.30,50.48',
  },
  bucha: {
    name: 'Буча',
    viewbox: '30.18,50.58,30.30,50.51',
  },
  hostomel: {
    name: 'Гостомель',
    viewbox: '30.20,50.62,30.34,50.55',
  },
  kyiv: {
    name: 'Київ',
    viewbox: '30.20,50.59,30.83,50.21',
  },
};

const cache = new Map<string, { data: Suggestion[]; until: number }>();
const TTL_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const cityKey = (params.get('city') ?? '').toLowerCase();
  const q = (params.get('q') ?? '').trim();

  const city = CITIES[cityKey];
  if (!city) {
    return NextResponse.json({ error: 'unknown city' }, { status: 400 });
  }
  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const cacheKey = `${cityKey}::${q.toLowerCase()}`;
  const hit = cache.get(cacheKey);
  if (hit && hit.until > Date.now()) {
    return NextResponse.json({ suggestions: hit.data, cached: true });
  }

  // Nominatim structured query: street + city + country
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('street', q);
  url.searchParams.set('city', city.name);
  url.searchParams.set('country', 'Україна');
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('accept-language', 'uk');
  url.searchParams.set('limit', '8');
  url.searchParams.set('viewbox', city.viewbox);
  url.searchParams.set('bounded', '1');

  try {
    const res = await fetch(url.toString(), {
      headers: {
        // Required by Nominatim usage policy
        'User-Agent': 'florenza-irpin.com (street-autocomplete)',
        Accept: 'application/json',
      },
      // Nominatim recommends not parallelising; one request per call is fine.
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const raw: any[] = await res.json();
    const seen = new Set<string>();
    const suggestions: Suggestion[] = [];

    for (const r of raw) {
      const a = r.address ?? {};
      const street = a.road ?? a.pedestrian ?? a.cycleway ?? a.path ?? a.residential;
      if (!street) continue;
      if (seen.has(street)) continue;
      seen.add(street);
      suggestions.push({
        street,
        displayName: r.display_name,
        lat: r.lat,
        lon: r.lon,
        osmId: String(r.osm_id),
      });
      if (suggestions.length >= 7) break;
    }

    cache.set(cacheKey, { data: suggestions, until: Date.now() + TTL_MS });

    // Naive cache eviction: keep cache size <500 entries
    if (cache.size > 500) {
      const oldest = [...cache.entries()].sort((a, b) => a[1].until - b[1].until).slice(0, 100);
      for (const [k] of oldest) cache.delete(k);
    }

    return NextResponse.json({ suggestions });
  } catch (e) {
    console.error('[/api/places/streets] error:', e);
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
