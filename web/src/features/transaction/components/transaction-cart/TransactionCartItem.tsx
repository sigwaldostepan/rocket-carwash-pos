"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipProvider,
  HybridTooltipTrigger,
} from "@/components/ui/hybrid-tooltip";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { formatRupiah } from "@/utils/currency";
import { Separator } from "@radix-ui/react-select";
import { Minus, Plus, Tags, Trash2 } from "lucide-react";
import {
  transactionStoreSelectors,
  useTransactionCartStore,
  useTransactionStore,
} from "../../stores";
import { TransactionItem } from "../../types";

interface TransactionCartItemProps {
  canRedeem: boolean;
  item: TransactionItem;
}

export const TransactionCartItem = ({
  canRedeem,
  item,
}: TransactionCartItemProps) => {
  // dialog actions to trigger ApplyRedeemPointDialog
  const { openDialog } = useDialog();

  const { removeItem, updateItemQuantity } = useTransactionCartStore();

  const totalPrice = useTransactionStore(
    transactionStoreSelectors.getItemPriceTotal(item.id),
  );
  const discountedTotalPrice = useTransactionStore(
    transactionStoreSelectors.getItemDiscountedPriceTotal(item.id),
  );

  // button onClick actions
  const onRemoveClick = () => {
    removeItem(item.id);
  };

  const onDecrementQtyClick = () => {
    updateItemQuantity(item.id, item.quantity - 1);
  };

  const onIncrementQtyClick = () => {
    updateItemQuantity(item.id, item.quantity + 1);
  };

  const onRedeemClick = () => {
    openDialog(DIALOG_KEY.transaction.redeemPoint, item);
  };

  return (
    <div className="group hover:bg-muted/30 relative w-full rounded-lg border p-3 transition-colors">
      {/* header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-semibold">{item.name}</h4>
          {discountedTotalPrice < totalPrice ? (
            <>
              <p className="text-muted-foreground text-sm line-through">
                {formatRupiah(totalPrice)}
              </p>
              <p className="text-destructive text-sm font-semibold">
                {formatRupiah(discountedTotalPrice)}
              </p>
            </>
          ) : (
            <p className="text-sm">{formatRupiah(totalPrice)}</p>
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onRemoveClick}
          className="hover:bg-destructive/10 hover:text-destructive h-7 w-7 shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-2" />

      {/* quantity, total, dan redeem */}
      <div className="flex flex-row items-center justify-between gap-2">
        <ButtonGroup className="w-full">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={onDecrementQtyClick}
            disabled={item.quantity <= 1}
          >
            <Minus />
          </Button>
          <ButtonGroupText>{item.quantity}</ButtonGroupText>
          <Button
            size="icon-sm"
            variant="outline"
            onClick={onIncrementQtyClick}
          >
            <Plus />
          </Button>
        </ButtonGroup>
        {item.isRedeemable && (
          <HybridTooltipProvider>
            <HybridTooltip>
              <HybridTooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  disabled={!canRedeem}
                  onClick={onRedeemClick}
                >
                  <Tags />
                </Button>
              </HybridTooltipTrigger>
              <HybridTooltipContent>Redeem poin</HybridTooltipContent>
            </HybridTooltip>
          </HybridTooltipProvider>
        )}
      </div>
    </div>
  );
};
