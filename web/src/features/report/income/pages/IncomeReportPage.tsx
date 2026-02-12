import { AuthGuard } from "@/components/guards";
import { Metadata } from "next";
import { IncomeReportPageInner } from "../components/IncomeReportPageInner";

export const metadata: Metadata = {
  title: "Laporan Pemasukan",
};

export const IncomeReportPage = () => {
  return (
    <AuthGuard roles={["owner", "cashier"]}>
      <IncomeReportPageInner />
    </AuthGuard>
  );
};
