import React from "react";
import { transactionColumns } from "./columns";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TransactionWithCustomer } from "@/types/api/transaction";
import { DataTable } from "@/components/ui/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";

type TransactionTableProps = {
  data: {
    transactions: TransactionWithCustomer[];
    totalPages: number;
  };
  isLoading: boolean;
};

export const TransactionTable = ({
  data,
  isLoading,
}: TransactionTableProps) => {
  const columns = React.useMemo(() => transactionColumns, []);

  const { page, limit, setPagination } = usePaginationQuery();

  const table = useReactTable({
    data: data.transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    manualPagination: true,
    autoResetPageIndex: false,
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

  return (
    <div className="space-y-4 overflow-hidden">
      <DataTable
        table={table}
        entityName="Transaksi"
        isLoading={isLoading}
        skeletonRows={10}
        showNextPrev
        withPagination
      />
    </div>
  );
};
