import { describe, expect, it } from 'vitest';
import { buildEntryContextSection } from '@/lib/ai/system-prompt-builder';
import type { LiyaEntryContext } from '@/lib/liya-bridge';

const orderCtx: LiyaEntryContext = {
  intent: 'order',
  source: 'web_card',
  bouquetSlug: 'svitanok',
  bouquetId: '42',
  bouquetName: 'Світанок',
};

const questionCtx: LiyaEntryContext = {
  intent: 'question',
  source: 'web_card',
  bouquetSlug: 'svitanok',
  bouquetId: '42',
  bouquetName: 'Світанок',
};

const generalCtx: LiyaEntryContext = {
  intent: 'general',
  source: 'header',
};

describe('buildEntryContextSection', () => {
  it('returns empty string for null/undefined', () => {
    expect(buildEntryContextSection(null)).toBe('');
    expect(buildEntryContextSection(undefined)).toBe('');
  });

  it('returns empty string for general intent (no bouquet context)', () => {
    expect(buildEntryContextSection(generalCtx)).toBe('');
  });

  it('order intent — names the bouquet and asks "На коли і кому"', () => {
    const out = buildEntryContextSection(orderCtx);
    expect(out).toContain('Контекст входу користувача');
    expect(out).toContain('«Світанок»');
    expect(out).toContain('замовити');
    expect(out).toContain('На коли і кому везти?');
  });

  it('question intent — does not push for an order, asks what is interesting', () => {
    const out = buildEntryContextSection(questionCtx);
    expect(out).toContain('«Світанок»');
    expect(out).toContain('питання');
    expect(out).toContain('Що цікавить про цей букет?');
    expect(out).not.toContain('На коли і кому');
  });

  it('includes slug and id for traceability', () => {
    const out = buildEntryContextSection(orderCtx);
    expect(out).toContain('svitanok');
    expect(out).toContain('42');
  });
});
