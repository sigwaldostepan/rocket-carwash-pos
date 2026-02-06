import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";
import { z } from "zod";

export const expenseCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(50, "Nama kategori maksimal 50 karakter"),
  description: z
    .string()
    .max(255, "Deskripsi maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
});

export type ExpenseCategorySchema = z.infer<typeof expenseCategorySchema>;

type UseExpenseCategoryFormProps = Omit<
  UseFormProps<ExpenseCategorySchema>,
  "defaultValues"
>;

export const useExpenseCategoryForm = (props: UseExpenseCategoryFormProps) => {
  return useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(expenseCategorySchema),
    ...props,
  });
};
