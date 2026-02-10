import { Progress } from "@/components/ui/progress";
import { ExpenseCategorySummary } from "@/types/api/report";
import { formatRupiah } from "@/utils/currency";
import { Tag } from "lucide-react";

type CategoryDetailItemProps = {
  data: ExpenseCategorySummary;
};

export const CategoryDetailItem = ({ data }: CategoryDetailItemProps) => {
  return (
    <div className="flex items-start gap-4 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
        <Tag className="h-5 w-5" />
      </span>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{data.category.name}</p>
            <p className="text-muted-foreground text-sm">
              {data.expenseCount} Transaksi
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatRupiah(data.total)}</p>
            <p className="text-muted-foreground text-sm">
              {data.contributionPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        <Progress
          value={data.contributionPercent}
          indicatorClassName="bg-amber-500"
          className="h-2 w-full rounded-full bg-amber-500/10"
        />
      </div>
    </div>
  );
};
