"use client";

import { ResponsiveDialog } from "@/components/shared";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { ExpenseWithCategory } from "@/types/api/expense";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useEditExpense } from "../../api/edit-expense";
import { ExpenseFormSchema, useExpenseForm } from "../../forms/expense-form";
import { ExpenseForm } from "../ExpenseForm";

export const EditExpenseDialog = () => {
  const {
    data: expense,
    isOpen,
    key,
    closeDialog,
    setIsOpen,
  } = useDialog<ExpenseWithCategory>();

  const form = useExpenseForm({
    values: {
      amount: expense?.amount ?? 0,
      categoryId: expense?.expenseCategory?.id ?? "",
      description: expense?.description ?? "",
    },
  });

  const { mutate, isPending: isLoading } = useEditExpense({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Pengeluaran berhasil diedit");
        closeDialog();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
      },
    },
  });

  const onSubmit = (data: ExpenseFormSchema) => {
    if (!expense?.id) {
      return;
    }

    mutate({ id: expense.id, data });
  };

  if (!isOpen || key !== DIALOG_KEY.expense.edit) {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.expense.edit, false)}
      title="Edit Pengeluaran"
    >
      <FormProvider {...form}>
        <ExpenseForm isLoading={isLoading} onSubmit={onSubmit} />
      </FormProvider>
    </ResponsiveDialog>
  );
};
