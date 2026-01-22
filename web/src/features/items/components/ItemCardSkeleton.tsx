import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const ItemCardSkeleton = () => {
  return (
    <Card className="relative min-h-[150px] gap-4 overflow-hidden p-4">
      <CardHeader className="flex h-full flex-col px-0">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <Separator className="my-3" />
      <CardFooter className="px-0">
        <div className="flex w-full items-center justify-between space-x-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9" />
        </div>
      </CardFooter>
    </Card>
  );
};
