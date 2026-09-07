import { AuthGuard } from "@/components/guards";
import { PageShell } from "@/components/layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseListPageInner } from "@/features/expense/components/ExpenseListPageInner";
import { ExpenseCategoryListPageInner } from "@/features/expense-category/components/ExpenseCategoryListPageInner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengeluaran",
};

const tabs = [
  { value: "list", label: "List" },
  { value: "category", label: "Kategori" },
] as const;

export const ExpensePage = () => {
  return (
    <AuthGuard roles={["owner"]}>
      <PageShell title="Pengeluaran">
        <Tabs defaultValue="list" className="h-full">
          <TabsList className="mx-4 mt-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="list">
            <ExpenseListPageInner />
          </TabsContent>
          <TabsContent value="category">
            <ExpenseCategoryListPageInner />
          </TabsContent>
        </Tabs>
      </PageShell>
    </AuthGuard>
  );
};
