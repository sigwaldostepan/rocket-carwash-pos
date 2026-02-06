"use client";

import { ResponsiveDialog } from "@/components/shared";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useCreateExpenseCategory } from "../../api/create-expense-category";
import {
  ExpenseCategorySchema,
  useExpenseCategoryForm,
} from "../../forms/expense-category-form";
import { ExpenseCategoryForm } from "../ExpenseCategoryForm";

export const CreateExpenseCategoryDialog = () => {
  const form = useExpenseCategoryForm({});
  const { isOpen, key, closeDialog, setIsOpen } = useDialog();

  const { mutate, isPending: isLoading } = useCreateExpenseCategory({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Kategori pengeluaran berhasil ditambahkan");
        form.reset();
        closeDialog();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
        console.error(err);
      },
    },
  });

  const onSubmit = (data: ExpenseCategorySchema) => {
    mutate(data);
  };

  if (!isOpen || key !== DIALOG_KEY.expenseCategory.create) {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.expenseCategory.create, false)}
      title="Tambah Kategori Pengeluaran"
      description="Tambahkan kategori pengeluaran baru"
    >
      <FormProvider {...form}>
        <ExpenseCategoryForm isLoading={isLoading} onSubmit={onSubmit} />
      </FormProvider>
    </ResponsiveDialog>
  );
};
