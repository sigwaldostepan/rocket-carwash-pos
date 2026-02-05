import { Item } from "@/types/api/item";

export type TransactionItem = Item & {
  quantity: number;
  redeemedQuantity?: number;
};
