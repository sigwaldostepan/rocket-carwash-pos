"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/utils/currency";
import React from "react";

type TransactionCartSummaryProps = React.ComponentProps<"div"> & {
  subtotalPrice: number;
  totalPrice: number;
};

export const TransactionCartSummary = ({
  className,
  subtotalPrice,
  totalPrice,
  ...props
}: TransactionCartSummaryProps) => {
  return (
    <div
      className={cn("flex h-full flex-col space-y-3 text-sm", className)}
      {...props}
    >
      <div className="flex justify-between">
        <p>Subtotal</p>
        <p>{formatRupiah(subtotalPrice)}</p>
      </div>

      <Separator />

      <div className="flex justify-between text-base font-bold">
        <p>Total</p>
        <p>{formatRupiah(totalPrice)}</p>
      </div>
    </div>
  );
};
