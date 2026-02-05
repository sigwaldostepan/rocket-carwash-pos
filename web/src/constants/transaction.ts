import { Customer } from "@/types/api/customer";
import { Banknote, CreditCard, Gift, QrCode, Wallet } from "lucide-react";

export const REDEEM_POINT_COST = 10;

export const NO_CUSTOMER: Customer = {
  id: "",
  name: "",
  code: "",
  phoneNumber: "",
  point: 0,
};

export enum PaymentMethod {
  CASH = "Tunai",
  QRIS = "QRIS",
  EDC = "EDC",
  TRANSFER = "Transfer",
  COMPLIMENT = "Komplimen",
}

export const PAYMENT_METHODS = [
  { value: PaymentMethod.CASH, label: "Tunai", icon: Banknote },
  { value: PaymentMethod.QRIS, label: "QRIS", icon: QrCode },
  { value: PaymentMethod.EDC, label: "EDC", icon: CreditCard },
  { value: PaymentMethod.TRANSFER, label: "Transfer", icon: Wallet },
  { value: PaymentMethod.COMPLIMENT, label: "Komplimen", icon: Gift },
] as const;
