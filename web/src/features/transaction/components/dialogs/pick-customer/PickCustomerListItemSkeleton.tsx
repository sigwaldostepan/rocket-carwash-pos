import { CommandItem } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

export const PickCustomerListItemSkeleton = () => {
  return (
    <CommandItem className="border-border flex w-full items-center justify-between rounded-lg border p-4">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-10" />
    </CommandItem>
  );
};
