import { TransactionItemSchema } from "@/features/transaction/forms/create-transaction";
import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DRAFT_QUERY_KEY } from "../config/query-key";

export type CreateDraftSchema = {
  customerId?: string;
  items: TransactionItemSchema[];
};

export const createDraft = async (payload: CreateDraftSchema) => {
  const response = await apiClient.post("/drafts", payload);

  return response.data;
};

type UseCreateDraftOptions = {
  mutationConfig?: MutationConfig<typeof createDraft>;
};

export const useCreateDraft = ({ mutationConfig }: UseCreateDraftOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDraft,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: DRAFT_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};