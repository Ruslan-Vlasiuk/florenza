/**
 * Anthropic Claude SDK wrapper.
 *
 * Used for:
 *  - AI-Concierge "Лія" (sonnet default, haiku for simple FAQ, opus for complex/sensitive)
 *  - AI-content (cards copy, blog draft + critique + fix passes)
 *
 * Auto-routing logic in router.ts. This file provides the raw client + chat() helper.
 */
import Anthropic from '@anthropic-ai/sdk';

export type ClaudeComplexity = 'simple' | 'standard' | 'complex';

export type ClaudeModel = string;

export const MODELS: Record<ClaudeComplexity, string> = {
  simple: process.env.CLAUDE_MODEL_SIMPLE || 'claude-haiku-4-5-20251001',
  standard: process.env.CLAUDE_MODEL_DEFAULT || 'claude-sonnet-4-6',
  complex: process.env.CLAUDE_MODEL_COMPLEX || 'claude-opus-4-7',
};

let _client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set. Add it to .env to enable Claude features.');
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

export function isClaudeConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export interface ChatRequest {
  system: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content:
      | string
      | Array<
          | { type: 'text'; text: string }
          | { type: 'tool_use'; id: string; name: string; input: unknown }
          | { type: 'tool_result'; tool_use_id: string; content: string }
        >;
  }>;
  tools?: Anthropic.Messages.Tool[];
  complexity?: ClaudeComplexity;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  content: Anthropic.Messages.ContentBlock[];
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  stopReason: Anthropic.Messages.Message['stop_reason'];
}

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const client = getClaudeClient();
  const model = MODELS[req.complexity ?? 'standard'];
  const startedAt = Date.now();

  const response = await client.messages.create({
    model,
    max_tokens: req.maxTokens ?? 4096,
    temperature: req.temperature ?? 0.7,
    system: req.system,
    // Cast to any because the SDK's typings for content blocks vary by version.
    messages: req.messages as Anthropic.Messages.MessageParam[],
    tools: req.tools,
  });

  return {
    content: response.content,
    model: response.model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    latencyMs: Date.now() - startedAt,
    stopReason: response.stop_reason,
  };
}

/**
 * Estimate cost in USD for a request.
 * Pricing (April 2026, approximate):
 *  - Haiku 4.5: $0.80 / 1M input, $4 / 1M output
 *  - Sonnet 4.6: $3 / 1M input, $15 / 1M output
 *  - Opus 4.7:  $15 / 1M input, $75 / 1M output
 */
export function estimateCostUSD(model: string, inputTokens: number, outputTokens: number): number {
  const lower = model.toLowerCase();
  let inputRate = 3 / 1_000_000;
  let outputRate = 15 / 1_000_000;
  if (lower.includes('haiku')) {
    inputRate = 0.8 / 1_000_000;
    outputRate = 4 / 1_000_000;
  } else if (lower.includes('opus')) {
    inputRate = 15 / 1_000_000;
    outputRate = 75 / 1_000_000;
  }
  return inputTokens * inputRate + outputTokens * outputRate;
}
