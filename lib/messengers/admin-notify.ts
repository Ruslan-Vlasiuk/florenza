/**
 * Unified admin notification dispatcher. Send Telegram alerts to Варвара for:
 *  - escalations
 *  - new paid orders (so she starts assembling)
 *  - failed payments / system errors
 *  - daily morning digest
 */
import { sendTelegramAdminAlert } from './telegram';

export interface AdminAlert {
  kind:
    | 'escalation'
    | 'new_paid_order'
    | 'unpaid_followup'
    | 'system_error'
    | 'daily_digest'
    | 'broadcast_finished';
  title: string;
  body: string;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
  meta?: Record<string, any>;
}

export async function sendAdminAlert(alert: AdminAlert): Promise<void> {
  const text = `<b>${alert.title}</b>\n\n${alert.body}${
    alert.meta ? `\n\n<code>${JSON.stringify(alert.meta, null, 2)}</code>` : ''
  }`;
  await sendTelegramAdminAlert(text, { urgency: alert.urgency });
}
