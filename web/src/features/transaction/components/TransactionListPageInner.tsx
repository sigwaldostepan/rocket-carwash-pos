"use client";

import { PageShell } from "@/components/layouts";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared";
import { useGetTransactions } from "../api/get-transactions";
import { TransactionTable } from "./transaction-table/TransactionTable";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { DatePickerRange } from "@/components/ui/date-picker-range";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { endOfDay, startOfDay } from "date-fns";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import {
  deleteTransaction,
  useDeleteTransaction,
} from "../api/delete-transaction";
import { TransactionWithCustomer } from "@/types/api/transaction";
import { DeleteTransactionAlert } from "./dialogs";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-client";

export const TransactionListPageInner = () => {
  const { page, limit } = usePaginationQuery();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const { data, isPending } = useGetTransactions({
    params: {
      page,
      limit,
      dateFrom: startOfDay(date?.from!).toISOString(),
      dateTo: endOfDay(date?.to!).toISOString(),
    },
  });

  const { mutateAsync: deleteTransaction } = useDeleteTransaction({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Transaksi berhasil dihapus");
      },
      onError: (error) => {
        const message = getApiErrorMessage(error);

        toast.error(message);
      },
    },
  });

  const { setIsOpen, data: dialogData } = useDialog<TransactionWithCustomer>();

  const onConfirmDelete = () => {
    deleteTransaction(dialogData.id);
    setIsOpen(DIALOG_KEY.transaction.delete, false);
  };

  return (
    <PageShell title="List Transaksi">
      <div className="container mx-auto space-y-6 px-4 py-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <PageHeader>
              <PageHeaderHeading>List Transaksi</PageHeaderHeading>
              <PageHeaderDescription>
                Daftar transaksi yang tercatat
              </PageHeaderDescription>
            </PageHeader>
            <DatePickerRange date={date} setDate={setDate} />
          </div>
        </div>

        <TransactionTable
          data={{
            transactions: data?.data ?? [],
            totalPages: data?.meta.totalPages ?? 0,
          }}
          isLoading={isPending}
        />
        <DeleteTransactionAlert onConfirm={onConfirmDelete} />
      </div>
    </PageShell>
  );
};
