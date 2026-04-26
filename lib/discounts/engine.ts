/**
 * Discount engine — pure functions for calculating bouquet prices.
 */

export interface DiscountSpec {
  enabled: boolean;
  type: 'percent' | 'fixed';
  amount: number;
  startAt?: string | null;
  endAt?: string | null;
}

export function isDiscountActive(d?: DiscountSpec | null, now: Date = new Date()): boolean {
  if (!d?.enabled || !d.amount) return false;
  if (d.startAt && new Date(d.startAt) > now) return false;
  if (d.endAt && new Date(d.endAt) < now) return false;
  return true;
}

export function applyDiscount(price: number, d?: DiscountSpec | null): {
  finalPrice: number;
  discountAmount: number;
} {
  if (!isDiscountActive(d)) return { finalPrice: price, discountAmount: 0 };
  if (d!.type === 'percent') {
    const discountAmount = Math.round(price * (d!.amount / 100));
    return { finalPrice: price - discountAmount, discountAmount };
  }
  return { finalPrice: Math.max(0, price - d!.amount), discountAmount: d!.amount };
}

export function getRemainingMs(endAt: string): number {
  return Math.max(0, new Date(endAt).getTime() - Date.now());
}
