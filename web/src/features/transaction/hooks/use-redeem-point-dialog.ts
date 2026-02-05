import { REDEEM_POINT_COST } from "@/constants/transaction";
import { useDialog } from "@/stores/dialog";
import {
  transactionStoreSelectors,
  useRedeemPointStore,
  useTransactionCustomerStore,
  useTransactionStore,
} from "@/features/transaction/stores";
import { TransactionItem } from "@/features/transaction/types";

export const useRedeemPointDialog = () => {
  const { data: selectedItem } = useDialog<TransactionItem>();
  const itemId = selectedItem?.id ?? "";

  const { customer } = useTransactionCustomerStore();
  const {
    usedPoint,
    availablePoint,
    incrementRedeemedItem,
    decrementRedeemedItem,
    resetRedeemedItem,
  } = useRedeemPointStore();

  const redeemedItemQuantity = useTransactionStore(
    transactionStoreSelectors.getItemRedeemedQuantity(itemId),
  );

  const canReduceRedeem = redeemedItemQuantity > 0;
  const canIncreaseRedeem =
    availablePoint >= REDEEM_POINT_COST &&
    redeemedItemQuantity < (selectedItem?.quantity ?? 0);

  return {
    state: {
      selectedItem,
      customer,
      itemId,
      usedPoint,
      availablePoint,
      redeemedItemQuantity,
      canReduceRedeem,
      canIncreaseRedeem,
    },
    actions: {
      incrementRedeemedItem,
      decrementRedeemedItem,
      resetRedeemedItem,
    },
  };
};
