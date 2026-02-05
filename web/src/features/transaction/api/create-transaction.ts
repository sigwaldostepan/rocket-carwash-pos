import { apiClient } from "@/lib/api-client";
import { CreateTransactionSchema } from "../forms/create-transaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "@/lib/react-query";
import { TRANSACTION_QUERY_KEY } from "../config/query-key";
import { Transaction } from "@/types/api/transaction";

export const createTransaction = async (
  payload: CreateTransactionSchema,
): Promise<Transaction> => {
  const response = await apiClient.post("/transactions", payload);

  return response.data;
};

type UseCreateTransactionOptions = {
  mutationConfig?: MutationConfig<typeof createTransaction>;
};

export const useCreateTransation = ({
  mutationConfig,
}: UseCreateTransactionOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
