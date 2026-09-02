import { Customer } from "@/types/api/customer";
import { Item } from "@/types/api/item";

export type DraftItem = {
  itemId: string;
  quantity: number;
  redeemedQuantity: number;
};

export type DraftDetail = {
  id: string;
  quantity: number;
  redeemedQuantity: number;
  item: Item | null;
};

export type DraftWithCustomer = {
  id: string;
  createdAt: string;
  customer: Customer | null;
  detail: DraftDetail[];
};