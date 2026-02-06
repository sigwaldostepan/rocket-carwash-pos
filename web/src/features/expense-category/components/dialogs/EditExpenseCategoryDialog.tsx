"use client";

import { ResponsiveDialog } from "@/components/shared";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { ExpenseCategoryWithExpenseCount } from "@/types/api/expense";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useEditExpenseCategory } from "../../api/edit-expense-category";
import {
  ExpenseCategorySchema,
  useExpenseCategoryForm,
} from "../../forms/expense-category-form";
import { ExpenseCategoryForm } from "../ExpenseCategoryForm";

export const EditExpenseCategoryDialog = () => {
  const {
    data: expenseCategory,
    isOpen,
    key,
    closeDialog,
    setIsOpen,
  } = useDialog<ExpenseCategoryWithExpenseCount>();

  const form = useExpenseCategoryForm({
    values: {
      name: expenseCategory?.name,
      description: expenseCategory?.description ?? "",
    },
  });

  const { mutate, isPending: isLoading } = useEditExpenseCategory({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Kategori pengeluaran berhasil diedit");
        closeDialog();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
      },
    },
  });

  const onSubmit = (data: ExpenseCategorySchema) => {
    if (!expenseCategory?.id) {
      return;
    }

    mutate({ id: expenseCategory.id, data });
  };

  if (!isOpen || key !== DIALOG_KEY.expenseCategory.edit) {
    return null;
  }

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.expenseCategory.edit, false)}
      title={`Edit ${expenseCategory?.name}`}
    >
      <FormProvider {...form}>
        <ExpenseCategoryForm isLoading={isLoading} onSubmit={onSubmit} />
      </FormProvider>
    </ResponsiveDialog>
  );
};
