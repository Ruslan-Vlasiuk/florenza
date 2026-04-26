import { NextRequest, NextResponse } from 'next/server';
import { handleIncomingMessage } from '@/lib/ai/conversation-manager';
import { sendViberMessage } from '@/lib/messengers/viber';
import { getPayloadClient } from '@/lib/payload-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // Conversation started — send welcome
    if (event.event === 'conversation_started') {
      const userId = event.user?.id;
      if (userId) {
        await sendViberMessage(
          userId,
          'Вітаю! Я Лія — AI-консультантка Florenza. Допоможу обрати букет та оформити замовлення.\n\nЧим можу допомогти?',
        );
      }
      return NextResponse.json({ status: 0, status_message: 'ok' });
    }

    // Subscribed
    if (event.event === 'subscribed') {
      return NextResponse.json({ status: 0, status_message: 'ok' });
    }

    // Unsubscribed → blacklist
    if (event.event === 'unsubscribed') {
      const payload = await getPayloadClient();
      await payload.create({
        collection: 'client-blacklist',
        data: {
          phone: `viber:${event.user_id}`,
          reason: 'stop_command',
          addedAt: new Date().toISOString(),
        } as any,
      }).catch(() => {});
      return NextResponse.json({ status: 0 });
    }

    // Message
    if (event.event === 'message') {
      const userId = event.sender?.id;
      const senderName = event.sender?.name;
      const text = event.message?.text ?? '';

      if (!userId || !text.trim()) {
        return NextResponse.json({ status: 0 });
      }

      if (text.trim().toLowerCase() === '/stop') {
        await sendViberMessage(
          userId,
          'Записала. Більше не турбую розсилками.',
        );
        return NextResponse.json({ status: 0 });
      }

      const result = await handleIncomingMessage({
        channel: 'viber',
        externalId: userId,
        customerName: senderName,
        customerViberId: userId,
        text,
      });

      if (result.text) {
        await sendViberMessage(userId, result.text);
      }
    }

    return NextResponse.json({ status: 0, status_message: 'ok' });
  } catch (e) {
    console.error('[viber webhook] error:', e);
    return NextResponse.json({ status: 0 });
  }
}
