"use client";

import { AuthGuard } from "@/components/guards";
import { PageShell } from "@/components/layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth";
import { TransactionListPageInner } from "../components/TransactionListPageInner";
import { CreateTransactionPageInner } from "../components/CreateTransactionPageInner";
import { DraftListPageInner } from "@/features/draft/components/DraftListPageInner";
import { IncomeReportPageInner } from "@/features/report/income/components/IncomeReportPageInner";

const tabs = [
  { value: "list", label: "List" },
  { value: "create", label: "Buat" },
  { value: "draft", label: "Draft" },
  { value: "report", label: "Laporan" },
] as const;

export const TransactionPage = () => {
  const { data } = authClient.useSession();
  const role = data?.user?.role;

  return (
    <AuthGuard>
      <PageShell title="Transaksi">
        <Tabs defaultValue="list" className="h-full">
          <TabsList className="mx-4 mt-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="list">
            <TransactionListPageInner />
          </TabsContent>
          <TabsContent value="create">
            <CreateTransactionPageInner />
          </TabsContent>
          <TabsContent value="draft">
            <DraftListPageInner />
          </TabsContent>
          <TabsContent value="report">
            <IncomeReportPageInner role={role} />
          </TabsContent>
        </Tabs>
      </PageShell>
    </AuthGuard>
  );
};
