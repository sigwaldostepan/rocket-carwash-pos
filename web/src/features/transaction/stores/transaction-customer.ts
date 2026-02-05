import { Customer } from "@/types/api/customer";
import { StateCreator } from "zustand";

export type TransactionCustomerSlice = {
  customer: Customer | undefined;
  setCustomer: (customer: Customer | undefined) => void;
};

export const transactionCustomerSlice: StateCreator<
  TransactionCustomerSlice
> = (set) => ({
  customer: undefined,
  setCustomer: (customer) => set(() => ({ customer })),
});
