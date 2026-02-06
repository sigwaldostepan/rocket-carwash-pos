import { Metadata } from "next";
import { ExpenseListPageInner } from "../components";
import { AuthGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "Pengeluaran",
};

export const ExpenseListPage = () => {
  return (
    <AuthGuard roles={["owner"]}>
      <ExpenseListPageInner />
    </AuthGuard>
  );
};
