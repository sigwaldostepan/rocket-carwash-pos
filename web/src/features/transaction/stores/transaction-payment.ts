import { PaymentMethod } from "@/constants/transaction";
import { StateCreator } from "zustand";

export type TransactionPaymentSlice = {
  paidAmount: number;
  paymentMethod: PaymentMethod;
  complimentAmount: number;
  isCompliment?: boolean;
  isNightShift?: boolean;
  setPaidAmount: (paidAmount: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCompliment: (amount: number) => void;
  setNightShiftCompliment: (amount: number) => void;
  setNightShift: (isNightShift: boolean) => void;
  resetPaymentStates: () => void;
};

export const transactionPaymentSlice: StateCreator<TransactionPaymentSlice> = (
  set,
) => ({
  paidAmount: 0,
  paymentMethod: PaymentMethod.CASH,
  complimentAmount: 0,
  isCompliment: undefined,
  isNightShift: undefined,
  setPaidAmount: (paidAmount) => set(() => ({ paidAmount })),
  setPaymentMethod: (method) => set(() => ({ paymentMethod: method })),
  setCompliment: (amount) => set(() => ({ complimentAmount: amount })),
  setNightShiftCompliment: (amount) =>
    set(() => ({ complimentAmount: amount, isNightShift: true })),
  setNightShift: (isNightShift) => set(() => ({ isNightShift })),
  resetPaymentStates: () =>
    set(() => ({
      paidAmount: 0,
      isCompliment: undefined,
      isNightShift: undefined,
      paymentMethod: PaymentMethod.CASH,
      complimentAmount: 0,
    })),
});
