import { AuthGuard } from "@/components/guards";
import { Metadata } from "next";
import { DraftListPageInner } from "../components/DraftListPageInner";

export const metadata: Metadata = {
  title: "Draft Transaksi",
};

export const DraftListPage = () => {
  return (
    <AuthGuard>
      <DraftListPageInner />
    </AuthGuard>
  );
};