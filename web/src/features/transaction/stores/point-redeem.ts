import { Customer } from "@/types/api/customer";
import { StateCreator } from "zustand";
import { TransactionItem } from "../types";

type AdditionalStates = {
  cartItems: TransactionItem[];
  customer: Customer | undefined;
};

export type PointRedeemSlice = {
  incrementRedeemedItem: (itemId: string) => void;
  decrementRedeemedItem: (itemId: string) => void;
  resetRedeemedItem: (itemId: string) => void;
};

export const pointRedeemSlice: StateCreator<
  AdditionalStates,
  [],
  [],
  PointRedeemSlice
> = (set) => ({
  decrementRedeemedItem: (itemId: string) =>
    set((state) => {
      const item = state.cartItems.find((item) => item.id === itemId);

      if (!item) {
        return state;
      }

      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                redeemedQuantity: item.redeemedQuantity
                  ? Math.max(item.redeemedQuantity - 1, 0)
                  : 0,
              }
            : item,
        ),
      };
    }),
  incrementRedeemedItem: (itemId: string) =>
    set((state) => {
      const item = state.cartItems.find((item) => item.id === itemId);

      if (!item) {
        return state;
      }

      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                redeemedQuantity: item.redeemedQuantity
                  ? item.redeemedQuantity + 1
                  : 1,
              }
            : item,
        ),
      };
    }),
  resetRedeemedItem: (itemId: string) =>
    set((state) => ({
      ...state,
      cartItems: state.cartItems.map((item) =>
        item.id === itemId ? { ...item, redeemedQuantity: 0 } : item,
      ),
    })),
});
