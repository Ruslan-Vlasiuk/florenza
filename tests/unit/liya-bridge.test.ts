import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  LIYA_OPEN_EVENT,
  isGeneralContext,
  isOrderContext,
  isQuestionContext,
  openLiya,
  subscribeLiyaOpen,
  type LiyaEntryContext,
} from '@/lib/liya-bridge';

const orderCtx: LiyaEntryContext = {
  intent: 'order',
  source: 'web_card',
  bouquetSlug: 'svitanok',
  bouquetId: '1',
  bouquetName: 'Світанок',
};

const questionCtx: LiyaEntryContext = {
  intent: 'question',
  source: 'web_card',
  bouquetSlug: 'svitanok',
  bouquetId: '1',
  bouquetName: 'Світанок',
};

const generalCtx: LiyaEntryContext = {
  intent: 'general',
  source: 'header',
};

describe('liya-bridge', () => {
  beforeEach(() => {
    // happy-dom resets the document between tests, but listeners remain on window.
    // Recreate window to avoid leaks across tests.
  });

  it('exposes a stable event name', () => {
    expect(LIYA_OPEN_EVENT).toBe('liya:open');
  });

  it('dispatches a CustomEvent with the supplied detail', () => {
    const handler = vi.fn();
    const cleanup = subscribeLiyaOpen(handler);

    openLiya(orderCtx);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(orderCtx);

    cleanup();
  });

  it('cleanup unsubscribes the listener', () => {
    const handler = vi.fn();
    const cleanup = subscribeLiyaOpen(handler);
    openLiya(generalCtx);
    cleanup();
    openLiya(generalCtx);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('multiple subscribers all receive the event', () => {
    const a = vi.fn();
    const b = vi.fn();
    const cleanupA = subscribeLiyaOpen(a);
    const cleanupB = subscribeLiyaOpen(b);
    openLiya(questionCtx);
    expect(a).toHaveBeenCalledWith(questionCtx);
    expect(b).toHaveBeenCalledWith(questionCtx);
    cleanupA();
    cleanupB();
  });

  it('is SSR-safe — no throw and cleanup is a no-op when window is undefined', () => {
    const originalWindow = globalThis.window;
    // Force a server-like env.
    // @ts-expect-error — intentional teardown for the test
    delete globalThis.window;

    expect(() => openLiya(generalCtx)).not.toThrow();
    const cleanup = subscribeLiyaOpen(() => {});
    expect(typeof cleanup).toBe('function');
    expect(() => cleanup()).not.toThrow();

    globalThis.window = originalWindow;
  });

  it('type guards discriminate the union correctly', () => {
    expect(isOrderContext(orderCtx)).toBe(true);
    expect(isOrderContext(questionCtx)).toBe(false);
    expect(isQuestionContext(questionCtx)).toBe(true);
    expect(isQuestionContext(orderCtx)).toBe(false);
    expect(isGeneralContext(generalCtx)).toBe(true);
    expect(isGeneralContext(orderCtx)).toBe(false);
  });
});
