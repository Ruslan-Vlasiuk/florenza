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

/**
 * Per-city corpus of all known street names (fetched from OSM Overpass).
 * Hydrated lazily on first query and reused for fuzzy fallback.
 */
type StreetCorpus = { names: string[]; until: number };
const corpusCache = new Map<string, StreetCorpus>();
const CORPUS_TTL_MS = 24 * 60 * 60 * 1000;

async function loadStreetCorpus(cityName: string, viewbox: string): Promise<string[]> {
  const hit = corpusCache.get(cityName);
  if (hit && hit.until > Date.now()) return hit.names;

  // Overpass query: all named highways inside the city's bbox.
  // viewbox is "minLon,maxLat,maxLon,minLat" — Overpass bbox is "south,west,north,east".
  const [minLon, maxLat, maxLon, minLat] = viewbox.split(',').map(Number);
  const south = Math.min(minLat, maxLat);
  const north = Math.max(minLat, maxLat);
  const west = Math.min(minLon, maxLon);
  const east = Math.max(minLon, maxLon);

  const query = `[out:json][timeout:20];
way["highway"]["name"](${south},${west},${north},${east});
out tags;`;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'florenza-irpin.com (street-corpus)',
      },
      body: 'data=' + encodeURIComponent(query),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { elements: { tags?: { name?: string } }[] };
    const seen = new Set<string>();
    for (const el of data.elements ?? []) {
      const n = el.tags?.name;
      if (n && !seen.has(n)) seen.add(n);
    }
    const names = [...seen];
    corpusCache.set(cityName, { names, until: Date.now() + CORPUS_TTL_MS });
    return names;
  } catch (e) {
    console.error('[overpass] corpus load failed for', cityName, e);
    return [];
  }
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/^(вул\.?\s*|вулиця\s+|пров\.?\s*|провулок\s+|просп\.?\s*|проспект\s+|бул\.?\s*|бульвар\s+|пл\.?\s*|площа\s+)/u, '')
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

function fuzzyMatchStreets(query: string, corpus: string[]): string[] {
  const q = normalize(query);
  if (!q) return [];

  // Score each candidate; lower = better. Heavy weight to substring match,
  // then Levenshtein distance.
  const scored = corpus
    .map((name) => {
      const norm = normalize(name);
      let score: number;
      if (norm.startsWith(q)) score = -1000;
      else if (norm.includes(q)) score = -500 + (norm.length - q.length) * 0.1;
      else {
        const dist = levenshtein(q, norm);
        const ratio = dist / Math.max(q.length, norm.length);
        // Reject if too dissimilar
        if (ratio > 0.45) return null;
        score = dist * 10 + ratio * 100;
      }
      return { name, score };
    })
    .filter((x): x is { name: string; score: number } => x !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 7)
    .map((x) => x.name);

  return scored;
}

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
    // Nominatim's `q=` accepts partials and transliteration but NOT typos.
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

    // Stage 3: typo-tolerant fallback against the local Overpass corpus.
    // Uses Levenshtein distance + substring scoring to handle real typos.
    if (suggestions.length === 0) {
      const corpus = await loadStreetCorpus(city.name, city.viewbox);
      const fuzzyNames = fuzzyMatchStreets(q, corpus);
      suggestions = fuzzyNames.map((name, idx) => ({
        street: name,
        displayName: `${name}, ${city.name}, Україна`,
        lat: '',
        lon: '',
        osmId: `corpus-${cityKey}-${idx}`,
      }));
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
