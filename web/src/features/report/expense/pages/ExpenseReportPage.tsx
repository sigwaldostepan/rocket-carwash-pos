import { AuthGuard } from "@/components/guards";
import { Metadata } from "next";
import { ExpenseReportPageInner } from "../components/ExpenseReportPageInner";

export const metadata: Metadata = {
  title: "Laporan Pengeluaran",
};

export const ExpenseReportPage = () => {
  return (
    <AuthGuard roles={["owner"]}>
      <ExpenseReportPageInner />
    </AuthGuard>
  );
};
