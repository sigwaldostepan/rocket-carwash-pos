import { z } from "zod";

// Match backend's PaymentMethod enum
export const PaymentMethodSchema = z.enum([
  "Tunai",
  "QRIS",
  "EDC",
  "Transfer",
  "Komplimen",
]);

export const transactionItemSchema = z.object({
  itemId: z.string().min(1, "ID item gk boleh kosong"),
  quantity: z.number().min(0, "Quantity gk boleh negatif"),
  redeemedQuantity: z
    .number()
    .min(0, "Jumlah item yg diredeem gk boleh negatif")
    .optional(),
});

export const createTransactionSchema = z.object({
  customerId: z.string().optional(),
  items: z.array(transactionItemSchema).min(1, "Item tidak boleh kosong"),
  paymentMethod: PaymentMethodSchema,
  isCompliment: z.boolean().optional(),
  complimentAmount: z
    .number()
    .min(0, "Nilai komplimen gak boleh negatif")
    .optional(),
  isNightShift: z.boolean().optional(),
});

export type TransactionItemSchema = z.infer<typeof transactionItemSchema>;
export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
