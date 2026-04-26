/**
 * Viber bot wrapper.
 * Uses native fetch to Viber Public Account API.
 */

const VIBER_API = 'https://chatapi.viber.com/pa';

function getToken(): string {
  const t = process.env.VIBER_BOT_TOKEN;
  if (!t) throw new Error('VIBER_BOT_TOKEN not set');
  return t;
}

export async function sendViberMessage(
  receiverId: string,
  text: string,
  opts: { keyboard?: any } = {},
): Promise<void> {
  if (!process.env.VIBER_BOT_TOKEN) {
    console.warn('[viber] not configured, skipping send');
    return;
  }

  const body: any = {
    receiver: receiverId,
    type: 'text',
    text,
    sender: {
      name: process.env.VIBER_BOT_NAME || 'Florenza',
      avatar: process.env.VIBER_BOT_AVATAR,
    },
  };
  if (opts.keyboard) body.keyboard = opts.keyboard;

  await fetch(`${VIBER_API}/send_message`, {
    method: 'POST',
    headers: {
      'X-Viber-Auth-Token': getToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function setViberWebhook(url: string): Promise<void> {
  await fetch(`${VIBER_API}/set_webhook`, {
    method: 'POST',
    headers: {
      'X-Viber-Auth-Token': getToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      event_types: ['delivered', 'seen', 'failed', 'subscribed', 'unsubscribed', 'conversation_started', 'message'],
    }),
  });
}
