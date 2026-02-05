import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type TransactionItemCardSkeletonProps = {
  showBadges?: boolean;
  className?: string;
};

export const TransactionItemCardSkeleton = ({
  showBadges = true,
  className,
}: TransactionItemCardSkeletonProps) => {
  return (
    <Card
      className={cn(
        "relative flex min-h-[140px] flex-col justify-between gap-4 p-4",
        "bg-card border shadow-none",
        className,
      )}
    >
      {/* TOP: Item Name Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* BOTTOM: Badges Skeleton */}
      {showBadges && (
        <div className="flex flex-wrap items-start gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      )}
    </Card>
  );
};
