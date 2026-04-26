/**
 * Claude tools registry for Лія.
 * Each tool has: definition (for Claude API) + handler (server-side execution).
 */
import type Anthropic from '@anthropic-ai/sdk';
import { searchBouquets } from './search-bouquets';
import { getBouquetDetails } from './get-bouquet-details';
import { getDeliveryZones } from './get-delivery-zones';
import { getDeliverySlots } from './get-delivery-slots';
import { checkTodayAvailability } from './check-today-availability';
import { calculateOrderPrice } from './calculate-order-price';
import { createPendingOrder } from './create-pending-order';
import { generatePaymentLink } from './generate-payment-link';
import { escalateToVarvara } from './escalate-to-varvara';
import { lookupPreviousOrder } from './lookup-previous-order';
import { saveClientPreference } from './save-client-preference';
import { getActivePromotions } from './get-active-promotions';

export type ToolHandler = (input: any, context: ToolContext) => Promise<any>;

export interface ToolContext {
  conversationId: string;
  customerId?: string;
  channel: 'web_chat' | 'telegram' | 'viber';
}

export interface ToolDef {
  name: string;
  description: string;
  input_schema: Anthropic.Messages.Tool.InputSchema;
  handler: ToolHandler;
}

export const TOOLS: ToolDef[] = [
  searchBouquets,
  getBouquetDetails,
  getDeliveryZones,
  getDeliverySlots,
  checkTodayAvailability,
  calculateOrderPrice,
  createPendingOrder,
  generatePaymentLink,
  escalateToVarvara,
  lookupPreviousOrder,
  saveClientPreference,
  getActivePromotions,
];

export function getToolDefinitions(): Anthropic.Messages.Tool[] {
  return TOOLS.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema,
  }));
}

export async function executeTool(
  name: string,
  input: any,
  context: ToolContext,
): Promise<any> {
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }
  try {
    return await tool.handler(input, context);
  } catch (error) {
    return {
      error: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
