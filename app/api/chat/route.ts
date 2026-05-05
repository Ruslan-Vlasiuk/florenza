import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { handleIncomingMessage } from '@/lib/ai/conversation-manager';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    sessionId: z.string().min(1),
    message: z.string().nullable(),
    entryContext: liyaEntryContextSchema.optional(),
    customerPhone: z.string().optional(),
    customerName: z.string().optional(),
  })
  .refine((d) => d.message !== null || d.entryContext !== undefined, {
    message: 'Either message or entryContext must be provided',
  });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sessionId, message, entryContext, customerPhone, customerName } = parsed.data;

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
