"use client";

import { PageShell } from "@/components/layouts";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetExpenseReport } from "../api/get-expense-report";
import { useDateRangeFilter } from "@/hooks/use-date-range-filter";
import { ArrowLeftRight, Wallet } from "lucide-react";
import { formatRupiah } from "@/utils/currency";
import { StatCard } from "../../components/StatCard";
import { CategoryDetail } from "./category-detail/CategoryDetail";
import { DatePickerRange } from "@/components/ui/date-picker-range";
import { ReportDetailEmptyState } from "../../components/ReportDetailEmptyState";

export const ExpenseReportPageInner = () => {
  const { dateRange, dateFrom, dateTo, setDateRange } = useDateRangeFilter();

  const { data } = useGetExpenseReport({
    params: {
      dateFrom,
      dateTo,
    },
  });

  return (
    <PageShell title="Laporan Pengeluaran">
      <div className="container mx-auto space-y-6 px-4 py-6">
        <div className="flex items-center justify-between">
          <PageHeader>
            <PageHeaderHeading>Laporan Pengeluaran</PageHeaderHeading>
            <PageHeaderDescription>
              Ringkasan detail mengenai pengeluaran usaha
            </PageHeaderDescription>
          </PageHeader>
          <DatePickerRange date={dateRange} setDate={setDateRange} />
        </div>

        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard
              label="Total Transaksi Pengeluaran"
              description="transaksi"
              value={data?.summary.expenseCount ?? 0}
              icon={ArrowLeftRight}
            />
            <StatCard
              label="Total Pengeluaran"
              description="total semua pengeluaran"
              value={formatRupiah(data?.summary.totalAmount ?? 0)}
              icon={Wallet}
              iconClassName="bg-rose-500/10 text-rose-500"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detail Kategori Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.categorySummary && data.categorySummary.length > 0 ? (
                <CategoryDetail data={data.categorySummary} />
              ) : (
                <ReportDetailEmptyState message="Belum ada transaksi pengeluaran" />
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </PageShell>
  );
};
