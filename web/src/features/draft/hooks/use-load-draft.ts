import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { paths } from "@/config/paths";
import { useLoadDraft as useLoadDraftStore } from "@/features/transaction/stores";
import { DraftWithCustomer, DraftDetail } from "../types";
import { TransactionItem } from "@/features/transaction/types";

const toTransactionItems = (
  details: DraftDetail[],
): TransactionItem[] =>
  details.flatMap((detail) => {
    if (!detail.item) {
      return [];
    }

    return [
      {
        ...detail.item,
        quantity: detail.quantity,
        redeemedQuantity: detail.redeemedQuantity,
      },
    ];
  });

export const useLoadDraft = () => {
  const router = useRouter();
  const { loadDraft } = useLoadDraftStore();

  const load = useCallback(
    (draft: DraftWithCustomer) => {
      loadDraft(
        toTransactionItems(draft.detail),
        draft.customer ?? undefined,
        undefined,
        draft.createdAt,
      );
      router.push(paths.app.transactions);
    },
    [loadDraft, router],
  );

  return { load };
};