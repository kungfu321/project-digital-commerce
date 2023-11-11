import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Coupon } from '@prisma/client';

import { AffiliateCheck, CartItem } from '@/types';

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  coupon?: Coupon,
  affiliateDiscount?: AffiliateCheck,
  handleAddAffiliateDiscount: (affiliateDiscount?: AffiliateCheck) => void;
  handleAddCoupon: (coupon?: Coupon) => void;
  handleAddProductToCart: (item: CartItem) => void;
  handleUpdateItemQuantity: (id: number, action: string) => void;
  handleGetItemQuantityById: (id: number) => number;
  handleResetCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      handleResetCart: () => {
        set({
          items: [],
          totalQuantity: 0,
          coupon: undefined,
          affiliateDiscount: undefined
        });
      },
      handleAddProductToCart: (item) => {
        const items = get().items;
        const newItems = [...items];

        const idx = newItems.findIndex(newItem => newItem.id === item.id);

        if (idx > -1) {
          newItems[idx].quantity += 1;
        } else {
          newItems.push(item);
        }

        const totalQuantity = newItems.reduce((p, c) => p + c.quantity, 0);

        set((state) => ({
          ...state,
          items: newItems,
          totalQuantity
        }));
      },
      handleGetItemQuantityById: (id) => {
        const items = get().items;

        const [item] = items.filter(item => item.id === id);

        return item?.quantity || 0;
      },
      handleUpdateItemQuantity: (id, action = 'INCREMENT') => {
        const items = get().items;
        const newItems = [...items];

        const idx = newItems.findIndex(newItem => newItem.id === id);

        if (idx > -1) {
          if (action === 'INCREMENT') {
            newItems[idx].quantity += 1;
          }

          if (action === 'DECREMENT') {
            if (newItems[idx].quantity === 1) {
              newItems.splice(idx, 1);
            } else {
              newItems[idx].quantity -= 1;
            }
          }
        }

        const totalQuantity = newItems.reduce((p, c) => p + c.quantity, 0);

        set((state) => ({
          ...state,
          items: newItems,
          totalQuantity
        }));
      },
      handleAddCoupon: (coupon) => {
        set((state) => ({
          ...state,
          coupon
        }));
      },
      handleAddAffiliateDiscount: (affiliateDiscount) => {
        set((state) => ({
          ...state,
          affiliateDiscount
        }));
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
