import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/utils/currency";
import { AlertCircle, Check } from "lucide-react";

type ChangeDisplayProps = {
  changeAmount: number;
  isAmountSufficient: boolean;
};

export const ChangeDisplay = ({
  changeAmount,
  isAmountSufficient,
}: ChangeDisplayProps) => (
  <>
    <div className="border-t" />
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {isAmountSufficient ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        )}
        <CardDescription className="text-base">
          {isAmountSufficient ? "Kembalian" : "Kurang"}
        </CardDescription>
      </div>
      <CardTitle
        className={cn(
          "truncate font-mono text-xl tracking-tight",
          isAmountSufficient ? "text-green-600" : "text-amber-500",
        )}
      >
        {formatRupiah(Math.abs(changeAmount))}
      </CardTitle>
    </div>
  </>
);
