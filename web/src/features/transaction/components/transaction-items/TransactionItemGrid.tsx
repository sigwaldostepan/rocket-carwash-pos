"use client";

import { Item } from "@/types/api/item";
import { useTransactionCartStore } from "../../stores";
import { TransactionItemCard } from "./TransactionItemCard";
import { TransactionItemCardSkeleton } from "./TransactionItemCardSkeleton";

type TransactionItemGridProps = {
  items: Item[];
  isLoading: boolean;
};

export const TransactionItemGrid = ({
  items,
  isLoading,
}: TransactionItemGridProps) => {
  const { addItem } = useTransactionCartStore();

  const onAddToCart = (item: Item) => {
    addItem({
      ...item,
      quantity: 1,
      redeemedQuantity: 0,
    });
  };

  return (
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
      {isLoading &&
        Array.from({ length: 12 }).map((_, i) => (
          <TransactionItemCardSkeleton key={i} />
        ))}
      {items?.map((item) => (
        <TransactionItemCard
          key={item.id}
          item={item}
          onAddToCart={() => onAddToCart(item)}
        />
      ))}
      {!isLoading && items.length < 1 && (
        <div className="col-span-full">
          <p className="text-muted-foreground text-center">
            Belum ada item yang ditemukan
          </p>
        </div>
      )}
    </div>
  );
};
