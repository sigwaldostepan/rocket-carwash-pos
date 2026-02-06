"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTableBulkActions } from "@/components/ui/data-table/DataTableBulkAction";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { getApiErrorMessage } from "@/lib/api-client";
import { ExpenseWithCategory } from "@/types/api/expense";
import { Spinner } from "@/components/ui/spinner";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useBatchDeleteExpense } from "../../api/batch-delete-expense";
import { BatchDeleteExpenseAlert } from "../dialogs";
import { expenseColumns } from "./columns";

type ExpenseTableProps = {
  data: {
    expenses: ExpenseWithCategory[];
    totalPages: number;
  };
  isLoading: boolean;
};

export const ExpenseTable = ({ data, isLoading }: ExpenseTableProps) => {
  const columns = useMemo(() => expenseColumns, []);

  const { page, limit, setPagination } = usePaginationQuery();

  const table = useReactTable({
    data: data.expenses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    pageCount: data.totalPages,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize: limit })
          : updater;

      const isLimitChanged = next.pageSize !== limit;

      setPagination({
        page: isLimitChanged ? 1 : next.pageIndex + 1,
        limit: next.pageSize,
      });
    },
  });

  const { mutate, isPending: isBatchDeleting } = useBatchDeleteExpense({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Pengeluaran berhasil dihapus");
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
        entityName="Pengeluaran"
        skeletonRows={10}
        showNextPrev
        withPagination
      />
      <DataTableBulkActions table={table} entityName="Pengeluaran">
        <BatchDeleteExpenseAlert
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
