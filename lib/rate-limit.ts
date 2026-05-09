/**
 * In-memory sliding-window rate limiter.
 *
 * Used to throttle public endpoints that fan out to expensive operations
 * (Anthropic API calls, third-party APIs, DB writes).
 *
 * Per-IP and per-session limits. Memory grows linearly with unique callers
 * — pruned every 5 minutes via the global cleanup interval.
 */

type Bucket = { hits: number[] };

const STORE = new Map<string, Bucket>();
const CLEANUP_INTERVAL_MS = 5 * 60_000;

let cleanupStarted = false;
function ensureCleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  setInterval(() => {
    const cutoff = Date.now() - 60 * 60_000;
    for (const [key, bucket] of STORE) {
      bucket.hits = bucket.hits.filter((t) => t > cutoff);
      if (bucket.hits.length === 0) STORE.delete(key);
    }
  }, CLEANUP_INTERVAL_MS).unref?.();
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  ensureCleanup();
  const now = Date.now();
  const cutoff = now - windowMs;
  const bucket = STORE.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => t > cutoff);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((oldest + windowMs - now) / 1000),
    };
  }

  bucket.hits.push(now);
  STORE.set(key, bucket);
  return {
    allowed: true,
    remaining: limit - bucket.hits.length,
    retryAfterSec: 0,
  };
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}
