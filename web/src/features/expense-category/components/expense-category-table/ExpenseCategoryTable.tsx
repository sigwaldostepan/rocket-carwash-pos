"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTableBulkActions } from "@/components/ui/data-table/DataTableBulkAction";
import { getApiErrorMessage } from "@/lib/api-client";
import { ExpenseCategoryWithExpenseCount } from "@/types/api/expense";
import { Spinner } from "@/components/ui/spinner";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useBatchDeleteExpenseCategory } from "../../api/batch-delete-expense-category";
import { BatchDeleteExpenseCategoryAlert } from "../dialogs";
import { expenseCategoryColumns } from "./columns";

type ExpenseCategoryTableProps = {
  data: ExpenseCategoryWithExpenseCount[];
  isLoading: boolean;
};

export const ExpenseCategoryTable = ({
  data,
  isLoading,
}: ExpenseCategoryTableProps) => {
  const columns = useMemo(() => expenseCategoryColumns, []);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const { mutate, isPending: isBatchDeleting } = useBatchDeleteExpenseCategory({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Kategori pengeluaran berhasil dihapus");
        table.resetRowSelection();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err);

        toast.error(message);
        console.error(err);
      },
    },
  });

  const onBatchDeleteConfirm = () => {
    const ids = table.getSelectedRowModel().rows.map((row) => row.original.id);

    mutate({ ids });
  };

  return (
    <div className="space-y-4">
      <DataTable
        table={table}
        isLoading={isLoading}
        entityName="Kategori Pengeluaran"
        skeletonRows={10}
      />
      <DataTableBulkActions table={table} entityName="Kategori">
        <BatchDeleteExpenseCategoryAlert
          isLoading={isBatchDeleting}
          onConfirm={onBatchDeleteConfirm}
          trigger={
            <Button
              variant="destructive"
              size="icon-sm"
              disabled={isBatchDeleting}
            >
              {isBatchDeleting ? <Spinner /> : <Trash2 />}
            </Button>
          }
        />
      </DataTableBulkActions>
    </div>
  );
};
