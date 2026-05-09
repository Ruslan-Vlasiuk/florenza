import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handleIncomingMessage } from '@/lib/ai/conversation-manager';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_MESSAGE_LEN = 2000;

const liyaEntryContextSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('order'),
    source: z.literal('web_card'),
    bouquetSlug: z.string().min(1),
    bouquetId: z.string().min(1),
    bouquetName: z.string().min(1),
  }),
  z.object({
    intent: z.literal('question'),
    source: z.literal('web_card'),
    bouquetSlug: z.string().min(1),
    bouquetId: z.string().min(1),
    bouquetName: z.string().min(1),
  }),
  z.object({
    intent: z.literal('general'),
    source: z.enum(['header', 'fab', 'footer']),
  }),
]);

const chatRequestSchema = z
  .object({
    sessionId: z.string().min(1).max(128),
    message: z.string().max(MAX_MESSAGE_LEN).nullable(),
    entryContext: liyaEntryContextSchema.optional(),
    customerPhone: z.string().max(32).optional(),
    customerName: z.string().max(128).optional(),
  })
  .refine((d) => d.message !== null || d.entryContext !== undefined, {
    message: 'Either message or entryContext must be provided',
  });

export async function POST(req: NextRequest) {
  try {
    // Rate limit FIRST — before parsing body or hitting Anthropic.
    const ip = getClientIp(req);
    const ipLimit = rateLimit(`chat:ip:${ip}`, 12, 60_000); // 12/min per IP
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Забагато запитів. Спробуйте через хвилину.' },
        { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfterSec) } },
      );
    }
    const dailyLimit = rateLimit(`chat:ip:daily:${ip}`, 200, 24 * 60 * 60_000);
    if (!dailyLimit.allowed) {
      return NextResponse.json(
        { error: 'Денний ліміт повідомлень вичерпано.' },
        { status: 429, headers: { 'Retry-After': String(dailyLimit.retryAfterSec) } },
      );
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sessionId, message, entryContext, customerPhone, customerName } = parsed.data;

    // Per-session sliding window — 30 messages/hour.
    const sessionLimit = rateLimit(`chat:session:${sessionId}`, 30, 60 * 60_000);
    if (!sessionLimit.allowed) {
      return NextResponse.json(
        { error: 'Забагато повідомлень у цій сесії. Спробуйте пізніше.' },
        { status: 429, headers: { 'Retry-After': String(sessionLimit.retryAfterSec) } },
      );
    }

    const result = await handleIncomingMessage({
      channel: 'web_chat',
      externalId: sessionId,
      customerPhone,
      customerName,
      text: message ?? '',
      entryContext,
    });

    return NextResponse.json({
      text: result.text,
      escalated: result.escalated,
    });
  } catch (e) {
    console.error('[/api/chat] error:', e);
    return NextResponse.json(
      { error: 'Внутрішня помилка. Спробуйте через хвилину.' },
      { status: 500 },
    );
  }
}
