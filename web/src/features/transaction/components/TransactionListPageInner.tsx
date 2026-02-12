"use client";

import { Container, PageShell } from "@/components/layouts";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared";
import { DatePickerRange } from "@/components/ui/date-picker-range";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { TransactionWithCustomer } from "@/types/api/transaction";
import { endOfDay, startOfDay } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useDeleteTransaction } from "../api/delete-transaction";
import { useGetTransactions } from "../api/get-transactions";
import { DeleteTransactionAlert } from "./dialogs";
import { TransactionTable } from "./transaction-table/TransactionTable";

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
      <Container>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between gap-2">
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
      </Container>
    </PageShell>
  );
};
