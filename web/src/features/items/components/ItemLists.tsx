import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Item } from "@/types/api/item";
import { ItemCard } from "./ItemCard";
import { ItemCardSkeleton } from "./ItemCardSkeleton";

type ItemListsProps = {
  data: Item[];
  isLoading: boolean;
};

export const ItemLists = ({ data, isLoading }: ItemListsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 transition-all md:grid-cols-3 lg:grid-cols-4">
      {isLoading &&
        Array.from({ length: 8 }).map((_, i) => <ItemCardSkeleton key={i} />)}
      {data.length < 1 ? (
        <Card className="col-span-full">
          <CardContent>
            <CardDescription className="text-center">
              Belum ada item
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        data?.map((item) => <ItemCard key={item.id} item={item} />)
      )}
    </div>
  );
};
