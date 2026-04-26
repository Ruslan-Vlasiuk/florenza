/**
 * Telegram bot wrapper. Uses native fetch to Bot API instead of node-telegram-bot-api
 * to avoid heavy polling deps in serverless / Next.js context. Webhook-only mode.
 */

const TG_API = (token: string) => `https://api.telegram.org/bot${token}`;

function getToken(adminBot = false): string {
  const t = adminBot
    ? process.env.TELEGRAM_ADMIN_BOT_TOKEN
    : process.env.TELEGRAM_BOT_TOKEN;
  if (!t) {
    throw new Error(
      adminBot
        ? 'TELEGRAM_ADMIN_BOT_TOKEN not set'
        : 'TELEGRAM_BOT_TOKEN not set',
    );
  }
  return t;
}

export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  opts: { parseMode?: 'Markdown' | 'HTML'; replyMarkup?: any } = {},
): Promise<void> {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.warn('[telegram] not configured, skipping send');
    return;
  }
  const url = `${TG_API(getToken())}/sendMessage`;
  const body: any = {
    chat_id: chatId,
    text,
    parse_mode: opts.parseMode ?? 'HTML',
    disable_web_page_preview: false,
  };
  if (opts.replyMarkup) body.reply_markup = opts.replyMarkup;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function sendTelegramAdminAlert(
  text: string,
  opts: { urgency?: 'low' | 'normal' | 'high' | 'urgent' } = {},
): Promise<void> {
  const token = process.env.TELEGRAM_ADMIN_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) {
    console.warn('[telegram admin] not configured, skipping alert');
    return;
  }
  const prefix = {
    low: '',
    normal: '',
    high: '⚠️ ',
    urgent: '🚨 ',
  }[opts.urgency ?? 'normal'];

  await fetch(`${TG_API(token)}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: prefix + text,
      parse_mode: 'HTML',
    }),
  });
}

export async function downloadTelegramFile(fileId: string): Promise<Buffer> {
  const token = getToken();
  const fileInfo = await fetch(`${TG_API(token)}/getFile?file_id=${fileId}`).then((r) => r.json());
  if (!(fileInfo as any).ok) throw new Error('Failed to get file info');
  const filePath = (fileInfo as any).result.file_path;
  const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
  const res = await fetch(downloadUrl);
  return Buffer.from(await res.arrayBuffer());
}

export async function setTelegramWebhook(url: string, secret?: string): Promise<void> {
  const token = getToken();
  await fetch(`${TG_API(token)}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      secret_token: secret,
      allowed_updates: ['message', 'callback_query'],
    }),
  });
}
