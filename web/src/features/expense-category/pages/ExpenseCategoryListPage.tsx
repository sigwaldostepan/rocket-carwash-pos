import { AuthGuard } from "@/components/guards";
import { ExpenseCategoryListPageInner } from "../components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategori Pengeluaran",
};

export const ExpenseCategoryListPage = () => {
  return (
    <AuthGuard roles={["owner"]}>
      <ExpenseCategoryListPageInner />
    </AuthGuard>
  );
};
