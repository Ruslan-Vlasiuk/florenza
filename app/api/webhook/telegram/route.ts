import { NextRequest, NextResponse } from 'next/server';
import { handleIncomingMessage } from '@/lib/ai/conversation-manager';
import { sendTelegramMessage, downloadTelegramFile } from '@/lib/messengers/telegram';
import { transcribeVoice } from '@/lib/ai/whisper';
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

    let text = message.text ?? '';
    let isVoiceTranscript = false;
    const attachments: any[] = [];

    // Voice handling
    if (message.voice && process.env.TELEGRAM_BOT_TOKEN) {
      try {
        const buf = await downloadTelegramFile(message.voice.file_id);
        const t = await transcribeVoice({
          audioBuffer: buf,
          mimeType: 'audio/ogg',
          language: 'uk',
        });
        text = t.text;
        isVoiceTranscript = !t.isStub;
        attachments.push({ type: 'voice', url: `tg-file:${message.voice.file_id}` });
      } catch (e) {
        console.error('[telegram voice]', e);
        await sendTelegramMessage(
          chatId,
          'Виникли проблеми з розпізнаванням голосового. Можете коротко написати або повторити?',
        );
        return NextResponse.json({ ok: true });
      }
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
