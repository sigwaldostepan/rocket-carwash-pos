import { AuthGuard } from "@/components/guards";
import { CreateTransactionPageInner } from "../components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Transaksi",
};

export const CreateTransactionPage = () => {
  return (
    <AuthGuard>
      <CreateTransactionPageInner />
    </AuthGuard>
  );
};
