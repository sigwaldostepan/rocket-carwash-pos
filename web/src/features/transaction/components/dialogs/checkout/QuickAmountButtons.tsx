import { Button } from "@/components/ui/button";
import { formatThousand } from "@/utils/currency";

type QuickAmountButtonsProps = {
  amounts: number[];
  selectedAmount: number;
  onSelect: (amount: number) => void;
};

export const QuickAmountButtons = ({
  amounts,
  selectedAmount,
  onSelect,
}: QuickAmountButtonsProps) => (
  <div className="flex flex-wrap gap-2">
    {amounts.map((amount) => (
      <Button
        key={amount}
        type="button"
        variant={selectedAmount === amount ? "secondary" : "outline"}
        size="sm"
        className="min-w-[80px] flex-1 font-mono text-xs"
        onClick={() => onSelect(amount)}
      >
        {formatThousand(amount)}
      </Button>
    ))}
  </div>
);
