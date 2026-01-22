"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDialogActions } from "@/stores/dialog";
import { Item } from "@/types/api/item";
import { formatRupiah } from "@/utils/currency";
import { Edit, Trash } from "lucide-react";

type ItemCardProps = {
  item: Item;
};

export const ItemCard = ({ item }: ItemCardProps) => {
  const { openDialog } = useDialogActions();

  const onEditClick = () => {
    openDialog("edit", item);
  };

  const onDeleteClick = () => {
    openDialog("delete", item);
  };

  const hasBadge = [
    item.isRedeemable,
    item.isGetPoint,
    item.canBeComplimented,
  ].some(Boolean);

  return (
    <Card className="relative min-h-[150px] gap-4 overflow-hidden p-4">
      <CardHeader className="flex h-full flex-col px-0">
        <div className="space-y-1">
          <CardTitle className="line-clamp-3 text-base tracking-tight text-ellipsis md:text-lg">
            {item.name}
          </CardTitle>
          <span className="text-muted-foreground shrink-0 text-sm font-medium tracking-tight">
            {formatRupiah(item.price)}
          </span>
        </div>
        {hasBadge && (
          <div className="flex flex-wrap items-center gap-1">
            {item.isRedeemable && (
              <Badge className="bg-blue-500/20 text-blue-700">Redeem</Badge>
            )}
            {item.isGetPoint && (
              <Badge className="bg-green-500/20 text-green-700">+Point</Badge>
            )}
            {item.canBeComplimented && (
              <Badge className="bg-orange-500/20 text-orange-700">
                Komplimen
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <Separator />
      <CardFooter className="px-0">
        <div className="flex w-full items-center justify-between space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEditClick}
          >
            <Edit />
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            size="icon-sm"
            onClick={onDeleteClick}
          >
            <Trash />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
