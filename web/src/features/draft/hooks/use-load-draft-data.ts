import { useCallback } from "react";
import { useLoadDraft as useLoadDraftStore } from "@/features/transaction/stores";
import { DraftWithCustomer, DraftDetail } from "../types";
import { TransactionItem } from "@/features/transaction/types";

const toTransactionItems = (
  details: DraftDetail[],
): TransactionItem[] =>
  details.flatMap((detail) => {
    if (!detail.item) return [];
    return [
      {
        ...detail.item,
        quantity: detail.quantity,
        redeemedQuantity: detail.redeemedQuantity,
      },
    ];
  });

export const useLoadDraftData = () => {
  const { loadDraft } = useLoadDraftStore();

  const load = useCallback(
    (draft: DraftWithCustomer) => {
      loadDraft(
        toTransactionItems(draft.detail),
        draft.customer ?? undefined,
        draft.id,
      );
    },
    [loadDraft],
  );

  return { load };
};
