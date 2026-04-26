/**
 * Google Gemini SDK wrapper — image generation only.
 * Uses Gemini 2.5 Flash Image (Nano Banana) for both text-to-image and image-edit.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

let _client: GoogleGenerativeAI | null = null;

const MODEL_ID = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image-preview';

export function getGeminiClient(): GoogleGenerativeAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set. AI photo generation disabled.');
    }
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export interface ImageGenRequest {
  prompt: string;
  globalStylePrompt: string;
  negativePrompt?: string;
  referenceImageBase64?: string;
  referenceImageMimeType?: string;
  aspectRatio?: '1:1' | '4:5' | '16:9' | '3:2';
}

export interface ImageGenResponse {
  imagesBase64: string[];
  mimeType: string;
  promptUsed: string;
}

/**
 * Generate one or more images. Returns base64-encoded PNG/JPEG strings.
 *
 * If referenceImageBase64 is provided — uses image-edit mode (transform reference).
 * Otherwise — text-to-image.
 *
 * In real production this calls Gemini API. In demo mode without GEMINI_API_KEY,
 * the seed script falls back to Unsplash CC0 photos.
 */
export async function generateImage(req: ImageGenRequest): Promise<ImageGenResponse> {
  const client = getGeminiClient();

  const compiledPrompt = buildCompiledPrompt(req);
  const model = client.getGenerativeModel({ model: MODEL_ID });

  const parts: any[] = [{ text: compiledPrompt }];

  if (req.referenceImageBase64) {
    parts.push({
      inlineData: {
        data: req.referenceImageBase64,
        mimeType: req.referenceImageMimeType ?? 'image/jpeg',
      },
    });
  }

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
  });

  const response = result.response;
  const images: string[] = [];
  let mimeType = 'image/png';

  for (const candidate of response.candidates ?? []) {
    for (const part of candidate.content.parts ?? []) {
      if ((part as any).inlineData) {
        images.push((part as any).inlineData.data);
        mimeType = (part as any).inlineData.mimeType ?? mimeType;
      }
    }
  }

  return {
    imagesBase64: images,
    mimeType,
    promptUsed: compiledPrompt,
  };
}

function buildCompiledPrompt(req: ImageGenRequest): string {
  const parts: string[] = [];
  parts.push(req.prompt.trim());
  parts.push('');
  parts.push('# Global brand style');
  parts.push(req.globalStylePrompt.trim());
  if (req.negativePrompt) {
    parts.push('');
    parts.push('# Negative (avoid)');
    parts.push(req.negativePrompt.trim());
  }
  if (req.aspectRatio) {
    parts.push('');
    parts.push(`Aspect ratio: ${req.aspectRatio}`);
  }
  return parts.join('\n');
}
