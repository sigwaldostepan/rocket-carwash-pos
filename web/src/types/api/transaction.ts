import { Customer } from "./customer";

export type Transaction = {
  id: string;
  invoiceNo: string;
  paymentMethod: string;
  isCompliment: boolean;
  createdAt: string;
  customerId: string | null;
  complimentValue: number;
  total: number;
  subtotal: number;
  isNightShift: boolean;
};

export type TransactionWithCustomer = Transaction & {
  customer: Customer;
};
