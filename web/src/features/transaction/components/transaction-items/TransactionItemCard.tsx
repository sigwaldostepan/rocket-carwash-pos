import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Item } from "@/types/api/item";
import { formatRupiah } from "@/utils/currency";

type TransactionItemCardProps = {
  item: Item;
  onAddToCart: () => void;
};

export const TransactionItemCard = ({
  item,
  onAddToCart,
}: TransactionItemCardProps) => {
  const hasBadge =
    item.canBeComplimented || item.isGetPoint || item.isRedeemable;

  return (
    <Card
      onClick={onAddToCart}
      className={cn(
        "group relative flex min-h-[140px] flex-col justify-between gap-4 overflow-hidden p-4",
        "cursor-pointer transition-all duration-200 ease-in-out select-none",
        "bg-card border shadow-none",
        "hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]",
      )}
    >
      {/* TOP: Item Name */}
      <div className="space-y-1">
        <CardTitle className="line-clamp-3 text-base leading-snug">
          {item.name}
        </CardTitle>
        <CardDescription className="truncate font-medium">
          {formatRupiah(item.price)}
        </CardDescription>
      </div>

      {/* BOTTOM: Item tag badges */}
      {hasBadge && (
        <div className="flex flex-wrap items-start gap-1.5">
          {item.isRedeemable && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-600/10 ring-inset dark:bg-blue-900/20 dark:text-blue-400">
              Redeem
            </span>
          )}
          {item.isGetPoint && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-600/10 ring-inset dark:bg-emerald-900/20 dark:text-emerald-400">
              +Point
            </span>
          )}
          {item.canBeComplimented && (
            <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700 ring-1 ring-orange-600/10 ring-inset dark:bg-orange-900/20 dark:text-orange-400">
              Komplimen
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
