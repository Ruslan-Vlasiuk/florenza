/**
 * Bridge between UI components and LiyaChatLauncher.
 *
 * Uses native CustomEvent transport — no global state, no extra deps.
 *
 *   import { openLiya } from '@/lib/liya-bridge';
 *   openLiya({ intent: 'order', source: 'web_card', bouquetSlug, bouquetId, bouquetName });
 *
 *   // In Launcher:
 *   useEffect(() => subscribeLiyaOpen((ctx) => {
 *     setOpen(true);
 *     setEntryContext(ctx);
 *   }), []);
 */

export type LiyaEntryContext =
  | {
      intent: 'order';
      source: 'web_card';
      bouquetSlug: string;
      bouquetId: string;
      bouquetName: string;
    }
  | {
      intent: 'question';
      source: 'web_card';
      bouquetSlug: string;
      bouquetId: string;
      bouquetName: string;
    }
  | {
      intent: 'general';
      source: 'header' | 'fab' | 'footer';
    };

export const LIYA_OPEN_EVENT = 'liya:open' as const;

type LiyaOpenHandler = (context: LiyaEntryContext) => void;

/** SSR-safe. No-op on the server. */
export function openLiya(context: LiyaEntryContext): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<LiyaEntryContext>(LIYA_OPEN_EVENT, { detail: context }));
}

/** SSR-safe. Returns a cleanup function for useEffect. */
export function subscribeLiyaOpen(handler: LiyaOpenHandler): () => void {
  if (typeof window === 'undefined') return () => {};

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<LiyaEntryContext>;
    handler(customEvent.detail);
  };

  window.addEventListener(LIYA_OPEN_EVENT, listener);
  return () => window.removeEventListener(LIYA_OPEN_EVENT, listener);
}

export function isOrderContext(
  ctx: LiyaEntryContext,
): ctx is Extract<LiyaEntryContext, { intent: 'order' }> {
  return ctx.intent === 'order';
}

export function isQuestionContext(
  ctx: LiyaEntryContext,
): ctx is Extract<LiyaEntryContext, { intent: 'question' }> {
  return ctx.intent === 'question';
}

export function isGeneralContext(
  ctx: LiyaEntryContext,
): ctx is Extract<LiyaEntryContext, { intent: 'general' }> {
  return ctx.intent === 'general';
}
