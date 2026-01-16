import { Metadata } from "next";
import { CustomerListPageInner } from "../components";
import { AuthGuard } from "@/components/guards";

export const metadata: Metadata = {
  title: "Customer",
};

export const CustomerListPage = () => {
  return (
    <AuthGuard>
      <CustomerListPageInner />
    </AuthGuard>
  );
};
