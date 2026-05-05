'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  bouquetId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (bouquetId: string) => void;
  setQuantity: (bouquetId: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.bouquetId === item.bouquetId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.bouquetId === item.bouquetId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),

      removeItem: (bouquetId) =>
        set((state) => ({
          items: state.items.filter((i) => i.bouquetId !== bouquetId),
        })),

      setQuantity: (bouquetId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.bouquetId === bouquetId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'florenza-cart',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const cartCount = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0);
