import { AuthGuard } from "@/components/guards";
import { PageShell } from "@/components/layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseReportPageInner } from "@/features/report/expense/components/ExpenseReportPageInner";
import { IncomeReportPageInner } from "@/features/report/income/components/IncomeReportPageInner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan",
};

const tabs = [
  { value: "expense", label: "Pengeluaran" },
  { value: "income", label: "Pemasukan" },
] as const;

export const ReportPage = () => {
  return (
    <AuthGuard roles={["owner"]}>
      <PageShell title="Laporan">
        <Tabs defaultValue="expense" className="h-full">
          <TabsList className="mx-4 mt-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="expense">
            <ExpenseReportPageInner />
          </TabsContent>
          <TabsContent value="income">
            <IncomeReportPageInner />
          </TabsContent>
        </Tabs>
      </PageShell>
    </AuthGuard>
  );
};
