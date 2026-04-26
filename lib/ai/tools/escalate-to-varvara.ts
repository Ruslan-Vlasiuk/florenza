import type { ToolDef } from './index';
import { getPayloadClient } from '../../payload-client';
import { sendAdminAlert } from '../../messengers/admin-notify';

export const escalateToVarvara: ToolDef = {
  name: 'escalate_to_varvara',
  description:
    'Передає розмову Варварі (реальній людині). Викликай для весіль, корпоративу >5000, скарг, делікатних тем, кастомних замовлень, прямих запитів на людину.',
  input_schema: {
    type: 'object',
    properties: {
      reason: {
        type: 'string',
        enum: [
          'wedding',
          'corporate',
          'funeral',
          'complaint',
          'custom',
          'unpaid',
          'human_requested',
          'ai_stuck',
        ],
      },
      urgency: { type: 'string', enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
      context: {
        type: 'string',
        description:
          'Що вже зрозуміло з розмови, що потрібно від Варвари. Лія сама пише собі нотатку.',
      },
    },
    required: ['reason', 'context'],
  },
  handler: async (input, ctx) => {
    const payload = await getPayloadClient();

    const conversation = (await payload.findByID({
      collection: 'conversations',
      id: ctx.conversationId,
    })) as any;

    await payload.update({
      collection: 'conversations',
      id: ctx.conversationId,
      data: {
        status: 'escalated',
        escalationReason: input.reason as any,
        escalatedAt: new Date().toISOString(),
      },
    });

    const escalation = await payload.create({
      collection: 'escalations',
      data: {
        conversation: ctx.conversationId,
        customer: conversation.customer,
        reason: input.reason as any,
        urgency: input.urgency ?? 'normal',
        context: input.context,
        status: 'open',
      },
    });

    await sendAdminAlert({
      kind: 'escalation',
      title: `🔔 Ескалація: ${input.reason}`,
      body: input.context,
      urgency: input.urgency ?? 'normal',
      meta: {
        conversationId: ctx.conversationId,
        escalationId: escalation.id,
      },
    });

    return {
      escalated: true,
      escalationId: escalation.id,
      message: 'Передано Варварі. Скажи клієнту: "Передаю розмову Варварі — вона особисто допоможе."',
    };
  },
};
