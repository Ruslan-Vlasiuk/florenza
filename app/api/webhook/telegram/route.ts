import { NextRequest, NextResponse } from 'next/server';
import { handleIncomingMessage } from '@/lib/ai/conversation-manager';
import { sendTelegramMessage } from '@/lib/messengers/telegram';
import { getPayloadClient } from '@/lib/payload-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Verify secret token if configured
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get('x-telegram-bot-api-secret-token');
    if (header !== secret) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }

  try {
    const update = await req.json();

    // Handle text or voice message
    const message = update.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);
    const fromName =
      [message.from?.first_name, message.from?.last_name].filter(Boolean).join(' ') ||
      message.from?.username;

    const text = message.text ?? '';
    const isVoiceTranscript = false;
    const attachments: any[] = [];

    // Voice handling — DISABLED for soft-launch.
    // Whisper is not yet wired (no docker service / VPS install). Politely
    // redirect to text. Re-enable after Whisper integration is shipped.
    if (message.voice) {
      await sendTelegramMessage(
        chatId,
        'Поки що приймаю тільки текст. Опишіть коротко що цікавить — допоможу обрати букет.',
      );
      return NextResponse.json({ ok: true });
    }

    if (!text.trim()) {
      return NextResponse.json({ ok: true });
    }

    // Handle /stop command for blacklist
    if (text.trim().toLowerCase() === '/stop') {
      const payload = await getPayloadClient();
      // Find customer by telegramChatId or create blacklist entry by external id
      await payload.create({
        collection: 'client-blacklist',
        data: {
          phone: `telegram:${chatId}`,
          reason: 'stop_command',
          addedAt: new Date().toISOString(),
        } as any,
      }).catch(() => {});

      await sendTelegramMessage(
        chatId,
        'Записала. Більше не турбую розсилками. Якщо знадобимось — пишіть.',
      );
      return NextResponse.json({ ok: true });
    }

    // Pass to Лія
    const result = await handleIncomingMessage({
      channel: 'telegram',
      externalId: chatId,
      customerName: fromName,
      customerTelegramChatId: chatId,
      text,
      isVoiceTranscript,
      attachments,
    });

    if (result.text) {
      await sendTelegramMessage(chatId, result.text);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[telegram webhook] error:', e);
    return NextResponse.json({ ok: true }); // always 200 to telegram
  }
}
