import { NextRequest, NextResponse } from 'next/server';
import { generateImage, isGeminiConfigured } from '@/lib/ai/gemini';
import { getPayloadClient } from '@/lib/payload-client';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const payload = await getPayloadClient();
  const auth = await payload.auth({ headers: req.headers });
  if (!auth.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (!isGeminiConfigured()) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY not configured. Add to .env to enable AI photo generation.' },
      { status: 503 },
    );
  }

  const body = await req.json();
  const { prompt, referenceImageBase64, referenceImageMimeType, aspectRatio } = body;

  const photoStyleGlobal: any = await payload.findGlobal({ slug: 'global-photo-style' as any });

  try {
    const result = await generateImage({
      prompt,
      globalStylePrompt: photoStyleGlobal?.globalStylePrompt ?? '',
      negativePrompt: photoStyleGlobal?.negativePrompt,
      referenceImageBase64,
      referenceImageMimeType,
      aspectRatio,
    });

    return NextResponse.json({
      images: result.imagesBase64.map((b64) => `data:${result.mimeType};base64,${b64}`),
      promptUsed: result.promptUsed,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
