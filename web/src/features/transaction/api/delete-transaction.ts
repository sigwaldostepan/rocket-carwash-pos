import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TRANSACTION_QUERY_KEY } from "../config/query-key";

export const deleteTransaction = async (id: string) => {
  const response = await apiClient.delete(`/transactions/${id}`);

  return response.data;
};

type UseDeleteTransactionOptions = {
  mutationConfig?: MutationConfig<typeof deleteTransaction>;
};

export const useDeleteTransaction = ({
  mutationConfig,
}: UseDeleteTransactionOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: TRANSACTION_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
