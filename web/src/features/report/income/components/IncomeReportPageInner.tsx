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
import { ArrowLeftRight, TrendingUp, Wallet } from "lucide-react";
import { ReportDetailEmptyState } from "../../components/ReportDetailEmptyState";
import { StatCard } from "../../components/StatCard";
import { useGetIncomeReport } from "../api/get-income-report";
import { PaymentMethodDetail } from "./payment-method-detail/PaymentMethodDetail";

export const IncomeReportPageInner = () => {
  const { dateRange, dateFrom, dateTo, setDateRange } = useDateRangeFilter();

  const { data } = useGetIncomeReport({
    params: {
      dateFrom,
      dateTo,
    },
  });

  return (
    <PageShell title="Laporan Pemasukan">
      <Container>
        <div className="flex items-center justify-between">
          <PageHeader>
            <PageHeaderHeading>Laporan Pemasukan</PageHeaderHeading>
            <PageHeaderDescription>
              Ringkasan detail mengenai pemasukan usaha
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
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Total Transaksi"
              description="transaksi"
              value={data?.summary.transactionCount ?? 0}
              icon={ArrowLeftRight}
            />
            <StatCard
              label="Pendapatan Kotor"
              description="sebelum diskon & potongan"
              value={formatRupiah(data?.summary.grossProfit ?? 0)}
              icon={TrendingUp}
              iconClassName="bg-blue-500/10 text-blue-500"
            />
            <StatCard
              label="Pendapatan Bersih"
              description="setelah diskon & potongan"
              value={formatRupiah(data?.summary.netProfit ?? 0)}
              icon={Wallet}
              iconClassName="bg-emerald-500/10 text-emerald-500"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detail Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.paymentMethodSummary &&
              data.paymentMethodSummary.length > 0 ? (
                <PaymentMethodDetail data={data.paymentMethodSummary} />
              ) : (
                <ReportDetailEmptyState message="Belum ada pemasukan" />
              )}
            </CardContent>
          </Card>
        </section>
      </Container>
    </PageShell>
  );
};
