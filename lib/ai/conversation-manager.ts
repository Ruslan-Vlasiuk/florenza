/**
 * Conversation Manager — orchestrates a single Лія dialog turn.
 *
 * Flow:
 *  1. Find or create conversation by (channel, externalId)
 *  2. Load message history (last 20 messages)
 *  3. Load global context (BrandVoice, LiyaRules, BrandSettings, active discounts, zones)
 *  4. Build system prompt
 *  5. Call Claude with tools loop
 *  6. Persist user message + assistant message + tool calls
 *  7. Return final assistant text
 */
import { chat, estimateCostUSD, isClaudeConfigured, MODELS } from './claude';
import { routeComplexity } from './router';
import { buildSystemPrompt, type SystemPromptContext } from './system-prompt-builder';
import { getToolDefinitions, executeTool, type ToolContext } from './tools';
import { getPayloadClient } from '../payload-client';

export interface IncomingMessage {
  channel: 'web_chat' | 'telegram' | 'viber';
  externalId: string;
  customerPhone?: string;
  customerName?: string;
  customerTelegramChatId?: string;
  customerViberId?: string;
  text: string;
  isVoiceTranscript?: boolean;
  attachments?: Array<{ type: 'image' | 'voice' | 'file'; url: string }>;
}

export interface LiyaResponse {
  conversationId: string;
  text: string;
  escalated: boolean;
  toolsCalled: string[];
  costUSD: number;
  latencyMs: number;
}

const MAX_TOOL_LOOPS = 8;
const HISTORY_LIMIT = 20;

export async function handleIncomingMessage(msg: IncomingMessage): Promise<LiyaResponse> {
  if (!isClaudeConfigured()) {
    return {
      conversationId: '',
      text:
        'AI-консультантка тимчасово недоступна (немає ANTHROPIC_API_KEY). Залиште номер у формі — Варвара зв\'яжеться з вами.',
      escalated: false,
      toolsCalled: [],
      costUSD: 0,
      latencyMs: 0,
    };
  }

  const payload = await getPayloadClient();

  // 1. Find or create conversation
  const existing = await payload.find({
    collection: 'conversations',
    where: {
      and: [
        { channel: { equals: msg.channel } },
        { externalId: { equals: msg.externalId } },
      ],
    },
    limit: 1,
  });

  let conversation: any = existing.docs[0];
  let isFirstMessageInSession = false;

  // Find or create customer (if we have a phone)
  let customerId: string | undefined;
  if (msg.customerPhone) {
    const cust = await payload.find({
      collection: 'customers',
      where: { phone: { equals: msg.customerPhone } },
      limit: 1,
    });
    if (cust.docs[0]) {
      customerId = cust.docs[0].id as string;
    } else {
      const created = await payload.create({
        collection: 'customers',
        data: {
          phone: msg.customerPhone,
          name: msg.customerName,
          preferredChannel: msg.channel,
          telegramChatId: msg.customerTelegramChatId,
          viberId: msg.customerViberId,
        },
      });
      customerId = created.id as string;
    }
  }

  if (!conversation) {
    isFirstMessageInSession = true;
    conversation = await payload.create({
      collection: 'conversations',
      data: {
        channel: msg.channel,
        externalId: msg.externalId,
        customer: customerId,
        status: 'active',
      },
    });
  } else {
    // Determine if first message in session = if last message was >24h ago
    const lastMsgAt = conversation.lastMessageAt ? new Date(conversation.lastMessageAt) : null;
    if (!lastMsgAt || Date.now() - lastMsgAt.getTime() > 24 * 60 * 60 * 1000) {
      isFirstMessageInSession = true;
    }
  }

  // 2. Save user message
  const userMessageContent = msg.isVoiceTranscript
    ? `[голосове, транскрипт]: ${msg.text}`
    : msg.text;

  await payload.create({
    collection: 'messages',
    data: {
      conversation: conversation.id,
      role: 'user',
      content: userMessageContent,
      voiceTranscription: msg.isVoiceTranscript ? msg.text : undefined,
      attachments: msg.attachments,
    },
  });

  // 3. Load history
  const historyResult = await payload.find({
    collection: 'messages',
    where: { conversation: { equals: conversation.id } },
    sort: '-createdAt',
    limit: HISTORY_LIMIT,
  });
  const history = historyResult.docs.reverse();

  // 4. Load global context
  const [brandVoice, liyaRules, brandSettings, paymentSettings, deliverySettings] =
    await Promise.all([
      payload.findGlobal({ slug: 'brand-voice' as any }).catch(() => ({})),
      payload.findGlobal({ slug: 'liya-rules' as any }).catch(() => ({})),
      payload.findGlobal({ slug: 'brand-settings' as any }).catch(() => ({})),
      payload.findGlobal({ slug: 'payment-settings' as any }).catch(() => ({})),
      payload.findGlobal({ slug: 'delivery-settings' as any }).catch(() => ({})),
    ]);

  const now = new Date().toISOString();
  const activeDiscounts = await payload
    .find({
      collection: 'bouquets',
      where: {
        and: [
          { status: { equals: 'published' } },
          { 'discount.enabled': { equals: true } },
          {
            or: [
              { 'discount.endAt': { exists: false } },
              { 'discount.endAt': { greater_than: now } },
            ],
          },
        ],
      },
      limit: 10,
    })
    .then((r) =>
      r.docs.map((b: any) => ({
        name: b.name,
        price: b.price,
        discountAmount:
          b.discount?.type === 'percent'
            ? Math.round(b.price * (b.discount.amount / 100))
            : (b.discount?.amount ?? 0),
        endAt: b.discount?.endAt,
      })),
    );

  const activeZones = await payload
    .find({
      collection: 'delivery-zones',
      where: { isActive: { equals: true } },
      limit: 10,
    })
    .then((r) =>
      r.docs.map((z: any) => ({
        name: z.name,
        tariff: z.tariff,
        timeFrom: z.timeFrom,
        timeTo: z.timeTo,
        isActive: z.isActive,
      })),
    );

  const promptContext: SystemPromptContext = {
    brandVoice,
    liyaRules,
    brandSettings,
    paymentSettings,
    deliverySettings,
    activeDiscounts,
    activeDeliveryZones: activeZones,
    customerName: msg.customerName,
    isFirstMessageInSession,
    channel: msg.channel,
  };

  const systemPrompt = buildSystemPrompt(promptContext);

  // 5. Build messages array for Claude
  const claudeMessages: any[] = history.map((m: any) => ({
    role: m.role === 'assistant' || m.role === 'human_admin' ? 'assistant' : 'user',
    content: m.role === 'human_admin' ? `[Варвара]: ${m.content}` : m.content,
  }));

  const complexity = routeComplexity({
    message: msg.text,
    conversationLength: claudeMessages.length,
    hasEscalationKeywords: false,
    isVoiceTranscript: msg.isVoiceTranscript ?? false,
    containsAttachment: !!msg.attachments?.length,
    isFirstMessage: isFirstMessageInSession,
  });

  const tools = getToolDefinitions();
  const toolContext: ToolContext = {
    conversationId: conversation.id,
    customerId,
    channel: msg.channel,
  };

  // 6. Tool loop
  let toolsCalled: string[] = [];
  let totalCost = 0;
  let totalLatency = 0;
  let assistantText = '';
  let escalated = false;
  let stopReason: string | null = null;

  for (let loop = 0; loop < MAX_TOOL_LOOPS; loop++) {
    const response = await chat({
      system: systemPrompt,
      messages: claudeMessages,
      tools,
      complexity,
    });

    totalCost += estimateCostUSD(response.model, response.inputTokens, response.outputTokens);
    totalLatency += response.latencyMs;
    stopReason = response.stopReason;

    // Append assistant content (text + tool_uses) to messages
    claudeMessages.push({ role: 'assistant', content: response.content });

    // Extract any text
    const textBlocks = response.content.filter((c: any) => c.type === 'text');
    if (textBlocks.length) {
      assistantText = textBlocks.map((t: any) => t.text).join('\n').trim();
    }

    // Check for tool_use
    const toolUses = response.content.filter((c: any) => c.type === 'tool_use');
    if (!toolUses.length || response.stopReason === 'end_turn') {
      break;
    }

    // Execute tools and append tool_results
    const toolResults: any[] = [];
    for (const tu of toolUses as any[]) {
      toolsCalled.push(tu.name);
      const result = await executeTool(tu.name, tu.input, toolContext);
      toolResults.push({
        type: 'tool_result',
        tool_use_id: tu.id,
        content: JSON.stringify(result),
      });
      if (tu.name === 'escalate_to_varvara') {
        escalated = true;
      }
    }
    claudeMessages.push({ role: 'user', content: toolResults });
  }

  // 7. Save assistant message
  await payload.create({
    collection: 'messages',
    data: {
      conversation: conversation.id,
      role: 'assistant',
      content: assistantText,
      aiMeta: {
        model: MODELS[complexity],
        toolsCalled,
        latencyMs: totalLatency,
      },
    },
  });

  // Update conversation last message preview
  await payload.update({
    collection: 'conversations',
    id: conversation.id,
    data: {
      lastMessageAt: new Date().toISOString(),
      lastMessagePreview: assistantText.slice(0, 200),
      unreadByAdmin: escalated,
    },
  });

  return {
    conversationId: conversation.id,
    text: assistantText,
    escalated,
    toolsCalled,
    costUSD: totalCost,
    latencyMs: totalLatency,
  };
}
