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

  function dedupeSuggestions(raw: any[]): Suggestion[] {
    const seen = new Set<string>();
    const out: Suggestion[] = [];
    for (const r of raw) {
      const a = r.address ?? {};
      const street = a.road ?? a.pedestrian ?? a.cycleway ?? a.path ?? a.residential;
      if (!street) continue;
      const k = street.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({
        street,
        displayName: r.display_name,
        lat: r.lat,
        lon: r.lon,
        osmId: String(r.osm_id),
      });
      if (out.length >= 7) break;
    }
    return out;
  }

  async function nominatim(params: Record<string, string>) {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'florenza-irpin.com (street-autocomplete)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [] as any[];
    return (await res.json()) as any[];
  }

  try {
    // Stage 1: strict structured search — fast and exact when user types correctly.
    const strict = await nominatim({
      street: q,
      city: city.name,
      country: 'Україна',
      format: 'json',
      addressdetails: '1',
      'accept-language': 'uk',
      limit: '8',
      viewbox: city.viewbox,
      bounded: '1',
    });
    let suggestions = dedupeSuggestions(strict);

    // Stage 2: fuzzy free-form fallback when strict returns nothing.
    // Nominatim's `q=` accepts typos, partial words, and transliteration.
    if (suggestions.length === 0) {
      const fuzzy = await nominatim({
        q: `${q} ${city.name}`,
        format: 'json',
        addressdetails: '1',
        'accept-language': 'uk',
        limit: '12',
        viewbox: city.viewbox,
        bounded: '1',
        countrycodes: 'ua',
      });
      suggestions = dedupeSuggestions(fuzzy);
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
