import { StateCreator } from "zustand";
import { TransactionItem } from "../types";

export type TransactionItemSlice = {
  cartItems: TransactionItem[];
  loadedDraftId: string | null;
  addItem: (newItem: TransactionItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  setLoadedDraftId: (id: string | null) => void;
  resetCart: () => void;
};

export const transactionItemSlice: StateCreator<TransactionItemSlice> = (
  set,
) => ({
  cartItems: [],
  loadedDraftId: null,
  addItem: (newItem) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id,
      );

      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return { cartItems: [...state.cartItems, newItem] };
    }),
  removeItem: (itemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== itemId),
    })),
  updateItemQuantity: (itemId, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    })),
  setLoadedDraftId: (id) => set(() => ({ loadedDraftId: id })),
  resetCart: () => set(() => ({ cartItems: [], loadedDraftId: null })),
});
