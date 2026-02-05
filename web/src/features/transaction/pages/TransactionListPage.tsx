import { AuthGuard } from "@/components/guards";
import { Metadata } from "next";
import { TransactionListPageInner } from "../components";

export const metadata: Metadata = {
  title: "List Transaksi",
};

export const TransactionListPage = () => {
  return (
    <AuthGuard>
      <TransactionListPageInner />
    </AuthGuard>
  );
};
