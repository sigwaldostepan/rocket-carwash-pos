"use client";

import { Container, PageShell } from "@/components/layouts";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { DatePickerRange } from "@/components/ui/date-picker-range";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { ExpenseWithCategory } from "@/types/api/expense";
import { endOfDay, startOfDay } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useDeleteExpense } from "../api/delete-expense";
import { useGetExpenses } from "../api/get-expenses";
import {
  CreateExpenseDialog,
  DeleteExpenseAlert,
  EditExpenseDialog,
} from "./dialogs";
import { ExpenseTable } from "./expense-table";

export const ExpenseListPageInner = () => {
  const { page, limit } = usePaginationQuery();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const dateFrom = date?.from ? startOfDay(date.from).toISOString() : undefined;
  const dateTo = date?.to ? endOfDay(date.to).toISOString() : undefined;

  const { data, isPending: isLoading } = useGetExpenses({
    params: {
      page,
      limit,
      dateFrom,
      dateTo,
    },
  });

  // dialog related
  const {
    data: dialogData,
    openDialog,
    closeDialog,
  } = useDialog<ExpenseWithCategory>();

  // actions
  const { mutate } = useDeleteExpense({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Pengeluaran berhasil dihapus");
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
    openDialog(DIALOG_KEY.expense.create, null);
  };

  const onDeleteConfirm = () => {
    mutate(dialogData.id);
  };

  return (
    <PageShell title="Pengeluaran">
      <Container>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <PageHeader>
              <PageHeaderHeading>Pengeluaran</PageHeaderHeading>
              <PageHeaderDescription>
                Daftar pengeluaran usaha
              </PageHeaderDescription>
            </PageHeader>
            <div className="flex items-center gap-2">
              <DatePickerRange
                date={date}
                setDate={setDate}
                triggerProps={{
                  variant: "outline",
                  className: "justify-center flex items-center",
                  size: "responsive",
                }}
              />
              <Button onClick={onCreateClick} size="responsive">
                <Plus />{" "}
                <span className="hidden lg:block">Tambah Pengeluaran</span>
              </Button>
            </div>
          </div>
        </div>

        <ExpenseTable
          data={{
            expenses: data?.data ?? [],
            totalPages: data?.meta?.totalPages ?? 1,
          }}
          isLoading={isLoading}
        />
      </Container>

      {/* Dialogs */}
      <CreateExpenseDialog />
      <EditExpenseDialog />
      <DeleteExpenseAlert onConfirm={onDeleteConfirm} />
    </PageShell>
  );
};
