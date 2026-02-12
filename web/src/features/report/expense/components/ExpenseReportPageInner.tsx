"use client";

import { Container, PageShell } from "@/components/layouts";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerRange } from "@/components/ui/date-picker-range";
import { useDateRangeFilter } from "@/hooks/use-date-range-filter";
import { formatRupiah } from "@/utils/currency";
import { ArrowLeftRight, Wallet } from "lucide-react";
import { ReportDetailEmptyState } from "../../components/ReportDetailEmptyState";
import { StatCard } from "../../components/StatCard";
import { useGetExpenseReport } from "../api/get-expense-report";
import { CategoryDetail } from "./category-detail/CategoryDetail";

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
      <Container>
        <div className="flex items-center justify-between">
          <PageHeader>
            <PageHeaderHeading>Laporan Pengeluaran</PageHeaderHeading>
            <PageHeaderDescription>
              Ringkasan detail mengenai pengeluaran usaha
            </PageHeaderDescription>
          </PageHeader>
          <DatePickerRange
            date={dateRange}
            setDate={setDateRange}
            triggerProps={{
              size: "responsive",
            }}
          />
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
      </Container>
    </PageShell>
  );
};
