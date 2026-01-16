"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTableBulkActions } from "@/components/ui/data-table/DataTableBulkAction";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { CustomerWithTransactionCount } from "@/types/api/customer";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import { BatchDeleteCustomerAlert } from "../dialogs";
import { customerColumn } from "./columns";
import { useBatchDeleteCustomer } from "../../api/batch-delete-customer";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-client";
import { Spinner } from "@/components/ui/spinner";

type CustomerTableProps = {
  data: {
    customers: CustomerWithTransactionCount[];
    totalPages: number;
  };
  isLoading: boolean;
};

export const CustomerTable = ({ data, isLoading }: CustomerTableProps) => {
  // memoize the column to prevent being rerendered
  const columns = useMemo(() => customerColumn, []);

  const { page, limit, setPagination } = usePaginationQuery();

  const table = useReactTable({
    data: data.customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: page - 1, // since react-table use 0-based index
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

      // update pagination search params
      setPagination({
        page: isLimitChanged ? 1 : next.pageIndex + 1,
        limit: next.pageSize,
      });
    },
  });

  const { mutate, isPending: isBatchDeleting } = useBatchDeleteCustomer({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Customer berhasil dihapus");
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
        isLoading={isLoading}
        table={table}
        entityName="Customer"
        showNextPrev
        withPagination
      />
      <DataTableBulkActions table={table} entityName="Customer">
        <BatchDeleteCustomerAlert
          isLoading={isLoading}
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
