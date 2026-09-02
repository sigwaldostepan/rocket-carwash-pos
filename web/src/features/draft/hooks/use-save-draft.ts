import { toast } from "sonner";
import {
  transactionStoreSelectors,
  useResetTransaction,
  useTransactionStore,
} from "@/features/transaction/stores";
import { getApiErrorMessage } from "@/lib/api-client";
import { useCreateDraft } from "../api/use-create-draft";

export const useSaveDraft = () => {
  const { resetTransaction } = useResetTransaction();
  const { mutateAsync: createDraft, isPending: isSaving } = useCreateDraft({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Draft berhasil disimpan");
        resetTransaction();
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err));
      },
    },
  });

  const saveDraft = async () => {
    const state = useTransactionStore.getState();
    const payload = transactionStoreSelectors.getCreateTransactionPayload()(
      state,
    );

    await createDraft({
      customerId: payload.customerId,
      items: payload.items,
    });
  };

  return { saveDraft, isSaving };
};