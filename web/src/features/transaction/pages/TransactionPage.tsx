import { AuthGuard } from "@/components/guards";
import { PageShell } from "@/components/layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionListPageInner } from "../components/TransactionListPageInner";
import { CreateTransactionPageInner } from "../components/CreateTransactionPageInner";
import { DraftListPageInner } from "@/features/draft/components/DraftListPageInner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaksi",
};

const tabs = [
  { value: "list", label: "List" },
  { value: "create", label: "Buat" },
  { value: "draft", label: "Draft" },
] as const;

export const TransactionPage = () => {
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
        </Tabs>
      </PageShell>
    </AuthGuard>
  );
};
