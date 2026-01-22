import { Metadata } from "next";
import { ItemListPageInner } from "../components";
import { AuthGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "Item",
};

export const ItemListPage = () => {
  return (
    <AuthGuard>
      <ItemListPageInner />
    </AuthGuard>
  );
};
