import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";
import { z } from "zod";

export const expenseFormSchema = z.object({
  description: z
    .string()
    .max(255, "Deskripsi maksimal 255 karakter")
    .optional(),
  amount: z
    .number({
      error: "Harga item harus berupa angka",
    })
    .min(0, "Harga item gak boleh negatif")
    .max(1000000000, "Harga item maksimal 1.000.000.000"),
  categoryId: z.uuid("Kategori harus dipilih"),
});

export type ExpenseFormSchema = z.infer<typeof expenseFormSchema>;

type UseExpenseFormProps = Omit<
  UseFormProps<ExpenseFormSchema>,
  "defaultValues"
>;

export const useExpenseForm = (props: UseExpenseFormProps) => {
  return useForm<ExpenseFormSchema>({
    defaultValues: {
      description: "",
      amount: 0,
      categoryId: "",
    },
    resolver: zodResolver(expenseFormSchema),
    ...props,
  });
};
