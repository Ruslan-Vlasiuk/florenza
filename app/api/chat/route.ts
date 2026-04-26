import { NextRequest, NextResponse } from 'next/server';
import { handleIncomingMessage } from '@/lib/ai/conversation-manager';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, message, customerPhone, customerName } = body;

    if (!sessionId || !message?.trim()) {
      return NextResponse.json({ error: 'Missing sessionId or message' }, { status: 400 });
    }

    const result = await handleIncomingMessage({
      channel: 'web_chat',
      externalId: sessionId,
      customerPhone,
      customerName,
      text: message,
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
