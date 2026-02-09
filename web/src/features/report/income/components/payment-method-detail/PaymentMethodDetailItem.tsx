import { Progress } from "@/components/ui/progress";
import { IncomePaymentMethodSummary } from "@/types/api/report";
import { getPaymentMethodConfig } from "../../config/payment-method-summary-config";
import { formatRupiah } from "@/utils/currency";
import { cn } from "@/lib/utils";

type PaymentMethodDetailItemProps = {
  data: IncomePaymentMethodSummary;
};

export const PaymentMethodDetailItem = ({
  data,
}: PaymentMethodDetailItemProps) => {
  const config = getPaymentMethodConfig(data.paymentMethod);
  const Icon = config.icon;
  const isCompliment = data.paymentMethod === "Komplimen";

  return (
    <div className="flex items-start gap-4 py-4">
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${config.color}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{config.label}</p>
            <p className="text-muted-foreground text-sm">
              {data.transactionCount} Transaksi
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatRupiah(data.totalAmount)}</p>
            <p className="text-muted-foreground text-sm">
              {isCompliment
                ? `${data.contributionPercent.toFixed(2)}%`
                : `${data.contributionPercent.toFixed(2)}%`}
            </p>
          </div>
        </div>

        <Progress
          value={data.contributionPercent}
          indicatorClassName={`${config.progressIndicatorColor}`}
          className={cn("h-2 w-full rounded-full", config.progressColor)}
        />
      </div>
    </div>
  );
};
