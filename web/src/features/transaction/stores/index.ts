import { REDEEM_POINT_COST } from "@/constants/transaction";
import { create } from "zustand";
import { pointRedeemSlice, PointRedeemSlice } from "./point-redeem";
import { transactionItemSlice, TransactionItemSlice } from "./transaction-cart";
import {
  transactionCustomerSlice,
  TransactionCustomerSlice,
} from "./transaction-customer";
import {
  transactionPaymentSlice,
  TransactionPaymentSlice,
} from "./transaction-payment";
import { CreateTransactionSchema } from "../forms/create-transaction";

type TransactionStore = TransactionItemSlice &
  TransactionCustomerSlice &
  TransactionPaymentSlice &
  PointRedeemSlice;

export const useTransactionStore = create<TransactionStore>((...a) => ({
  ...transactionItemSlice(...a),
  ...transactionPaymentSlice(...a),
  ...transactionCustomerSlice(...a),
  ...pointRedeemSlice(...a),
}));

export const useTransactionCartStore = () => {
  const cartItems = useTransactionStore((state) => state.cartItems);
  const addItem = useTransactionStore((state) => state.addItem);
  const removeItem = useTransactionStore((state) => state.removeItem);
  const updateItemQuantity = useTransactionStore(
    (state) => state.updateItemQuantity,
  );

  return {
    cartItems,
    addItem,
    removeItem,
    updateItemQuantity,
  };
};

export const useTransactionCustomerStore = () => {
  const customer = useTransactionStore((state) => state.customer);
  const setCustomer = useTransactionStore((state) => state.setCustomer);

  return {
    customer,
    setCustomer,
  };
};

export const useTransactionPaymentStore = () => {
  const subtotalPrice = useTransactionStore(
    transactionStoreSelectors.getCartSubtotalPrice(),
  );
  const totalPrice = useTransactionStore(
    transactionStoreSelectors.getCartTotalPrice(),
  );
  const paidAmount = useTransactionStore((state) => state.paidAmount);
  const paymentMethod = useTransactionStore((state) => state.paymentMethod);
  const complimentAmount = useTransactionStore(
    (state) => state.complimentAmount,
  );
  const isCompliment = useTransactionStore((state) => state.isCompliment);
  const isNightShift = useTransactionStore((state) => state.isNightShift);

  const setPaidAmount = useTransactionStore((state) => state.setPaidAmount);
  const setPaymentMethod = useTransactionStore(
    (state) => state.setPaymentMethod,
  );
  const setCompliment = useTransactionStore((state) => state.setCompliment);
  const setNightShift = useTransactionStore((state) => state.setNightShift);
  const resetPaymentStates = useTransactionStore(
    (state) => state.resetPaymentStates,
  );

  const discount = subtotalPrice - totalPrice;

  return {
    subtotalPrice,
    totalPrice,
    discount,
    paidAmount,
    paymentMethod,
    complimentAmount,
    isCompliment,
    isNightShift,
    setPaidAmount,
    setPaymentMethod,
    setCompliment,
    setNightShift,
    resetPaymentStates,
  };
};

export const useRedeemPointStore = () => {
  const incrementRedeemedItem = useTransactionStore(
    (state) => state.incrementRedeemedItem,
  );
  const decrementRedeemedItem = useTransactionStore(
    (state) => state.decrementRedeemedItem,
  );
  const resetRedeemedItem = useTransactionStore(
    (state) => state.resetRedeemedItem,
  );

  const customerPoint =
    useTransactionStore((state) => state.customer?.point) ?? 0;
  const usedPoint = useTransactionStore((state) =>
    state.cartItems.reduce(
      (total, item) =>
        total + (item?.redeemedQuantity ?? 0) * REDEEM_POINT_COST,
      0,
    ),
  );

  const availablePoint = customerPoint - usedPoint;

  return {
    usedPoint,
    availablePoint,
    incrementRedeemedItem,
    decrementRedeemedItem,
    resetRedeemedItem,
  };
};

// additional selectors
export const transactionStoreSelectors = {
  getCartSubtotalPrice: () => (state: TransactionStore) => {
    return state.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  },
  getCartTotalPrice: () => (state: TransactionStore) => {
    const subtotalPrice = state.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const redeemDiscount = state.cartItems.reduce(
      (total, item) => total + (item.redeemedQuantity ?? 0) * item.price,
      0,
    );
    const complimentDiscount = state.complimentAmount;

    return subtotalPrice - redeemDiscount - complimentDiscount;
  },
  getItemRedeemedQuantity: (itemId: string) => (state: TransactionStore) => {
    const item = state.cartItems.find((item) => item.id === itemId);

    return item?.redeemedQuantity ?? 0;
  },
  getItemPriceTotal: (itemId: string) => (state: TransactionStore) => {
    const item = state.cartItems.find((item) => item.id === itemId);

    const itemPrice = item?.price ?? 0;
    const itemQuantity = item?.quantity ?? 0;

    return itemPrice * itemQuantity;
  },
  getItemDiscountedPriceTotal:
    (itemId: string) => (state: TransactionStore) => {
      const item = state.cartItems.find((item) => item.id === itemId);

      const itemPrice = item?.price ?? 0;
      const itemQuantity = item?.quantity ?? 0;
      const itemRedeemedQty = item?.redeemedQuantity ?? 0;

      // each redeemed item = item price
      // so if item price is 10000 and redeemed 2 items, then it will be 20000
      const discountAmount = itemRedeemedQty * itemPrice;
      return itemPrice * itemQuantity - discountAmount;
    },
  // should use useShallow
  getCreateTransactionPayload:
    () =>
    (state: TransactionStore): CreateTransactionSchema => {
      const customerId = state.customer?.id;
      const items = state.cartItems.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
        redeemedQuantity: item.redeemedQuantity,
      }));
      const paymentMethod = state.paymentMethod;
      const isCompliment = state.isCompliment ?? state.complimentAmount > 0;
      const complimentAmount = state.complimentAmount;
      const isNightShift = state.isNightShift;

      return {
        customerId,
        items,
        paymentMethod,
        isCompliment,
        complimentAmount,
        isNightShift,
      };
    },
};

export const useResetTransaction = () => {
  const resetCart = useTransactionStore((state) => state.resetCart);
  const setCustomer = useTransactionStore((state) => state.setCustomer);
  const resetPaymentStates = useTransactionStore(
    (state) => state.resetPaymentStates,
  );

  const resetTransaction = () => {
    resetCart();
    setCustomer(undefined);
    resetPaymentStates();
  };

  return { resetTransaction };
};
