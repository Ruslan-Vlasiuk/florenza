/**
 * Free stock image source for demo seed: picsum (lorem-picsum) — no API key, CC0.
 * For better results, swap to Unsplash if API key configured.
 */

export async function downloadStockImage(_keywords: string[]): Promise<{
  buffer: Buffer;
  mime: string;
} | null> {
  try {
    const seed = Math.floor(Math.random() * 1000);
    const url = `https://picsum.photos/seed/florenza-${seed}/1280/1600`;
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Florenza Seed Bot' },
    });
    if (!res.ok) throw new Error(`stock image fetch ${res.status}`);
    const arr = await res.arrayBuffer();
    return { buffer: Buffer.from(arr), mime: 'image/jpeg' };
  } catch (e) {
    console.warn('[stock-image]', (e as Error).message);
    return null;
  }
}
