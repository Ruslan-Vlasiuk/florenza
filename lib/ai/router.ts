/**
 * Auto-routing logic for AI-Concierge "Лія".
 * Decides which Claude model to use based on conversation context.
 */
import type { ClaudeComplexity } from './claude';

export interface RoutingContext {
  message: string;
  conversationLength: number;
  hasEscalationKeywords: boolean;
  isVoiceTranscript: boolean;
  containsAttachment: boolean;
  isFirstMessage: boolean;
}

const SIMPLE_KEYWORDS = [
  'привіт', 'привет', 'hello', 'добрий день', 'добрий ранок',
  'дякую', 'спасибо', 'thanks',
  'скільки коштує', 'ціна', 'вартість',
  'години', 'час роботи', 'коли працюєте',
];

const COMPLEX_KEYWORDS = [
  // Sensitive
  'похорон', 'поминк', 'кладовищ', 'втрат', 'помер', 'річниця смерті',
  // Complaints
  'скарг', 'розчаров', 'не таке', 'не доставили', 'в\'ялий', 'погано',
  // Wedding/B2B
  'весілля', 'наречен', 'wedding',
  'корпорат', 'офіс', 'компанія', 'ресторан', 'готель', 'регулярн',
  // Custom
  'кастом', 'спеціальн', 'індивідуальн',
];

export function routeComplexity(ctx: RoutingContext): ClaudeComplexity {
  const lower = ctx.message.toLowerCase();

  // Sensitive / escalation always → complex
  if (ctx.hasEscalationKeywords || COMPLEX_KEYWORDS.some((k) => lower.includes(k))) {
    return 'complex';
  }

  // Simple greetings, FAQ-like → haiku
  if (
    !ctx.containsAttachment &&
    ctx.message.length < 80 &&
    SIMPLE_KEYWORDS.some((k) => lower.includes(k))
  ) {
    return 'simple';
  }

  // Voice transcripts often longer + emotional → standard at minimum
  // Default: standard (sonnet)
  return 'standard';
}
