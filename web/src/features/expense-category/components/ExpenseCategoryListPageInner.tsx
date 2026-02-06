"use client";

import { PageShell } from "@/components/layouts";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { ExpenseCategoryWithExpenseCount } from "@/types/api/expense";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useDeleteExpenseCategory } from "../api/delete-expense-category";
import { useGetExpenseCategories } from "../api/get-expense-categories";
import {
  CreateExpenseCategoryDialog,
  DeleteExpenseCategoryAlert,
  EditExpenseCategoryDialog,
} from "./dialogs";
import { ExpenseCategoryTable } from "./expense-category-table";

export const ExpenseCategoryListPageInner = () => {
  const { data, isPending: isLoading } = useGetExpenseCategories({});

  // dialog related
  const {
    data: dialogData,
    openDialog,
    closeDialog,
  } = useDialog<ExpenseCategoryWithExpenseCount>();

  // actions
  const { mutate } = useDeleteExpenseCategory({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Kategori pengeluaran berhasil dihapus");
        closeDialog();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
        console.error(err);
      },
    },
  });

  const onCreateClick = () => {
    openDialog(DIALOG_KEY.expenseCategory.create, null);
  };

  const onDeleteConfirm = () => {
    mutate(dialogData.id);
  };

  return (
    <PageShell title="Kategori Pengeluaran">
      <div className="container mx-auto space-y-6 px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <PageHeader>
            <PageHeaderHeading>Kategori Pengeluaran</PageHeaderHeading>
            <PageHeaderDescription>
              Daftar kategori pengeluaran
            </PageHeaderDescription>
          </PageHeader>
          <Button onClick={onCreateClick}>
            <Plus /> <span className="hidden md:block">Tambah Kategori</span>
          </Button>
        </div>

        <ExpenseCategoryTable data={data ?? []} isLoading={isLoading} />
      </div>

      {/* Dialogs */}
      <CreateExpenseCategoryDialog />
      <EditExpenseCategoryDialog />
      <DeleteExpenseCategoryAlert onConfirm={onDeleteConfirm} />
    </PageShell>
  );
};
