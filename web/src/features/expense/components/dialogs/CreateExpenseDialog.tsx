"use client";

import { ResponsiveDialog } from "@/components/shared";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useCreateExpense } from "../../api/create-expense";
import { ExpenseFormSchema, useExpenseForm } from "../../forms/expense-form";
import { ExpenseForm } from "../ExpenseForm";

export const CreateExpenseDialog = () => {
  const form = useExpenseForm({});
  const { isOpen, key, closeDialog, setIsOpen } = useDialog();

  const { mutate, isPending: isLoading } = useCreateExpense({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Pengeluaran berhasil ditambahkan");
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

  const onSubmit = (data: ExpenseFormSchema) => {
    mutate(data);
  };

  if (!isOpen || key !== DIALOG_KEY.expense.create) {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.expense.create, false)}
      title="Tambah Pengeluaran"
      description="Tambahkan pengeluaran baru"
    >
      <FormProvider {...form}>
        <ExpenseForm isLoading={isLoading} onSubmit={onSubmit} />
      </FormProvider>
    </ResponsiveDialog>
  );
};
