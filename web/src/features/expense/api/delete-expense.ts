import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EXPENSE_QUERY_KEY } from "../config/query-key";

export const deleteExpense = async (id: string) => {
  const response = await apiClient.delete(`/expenses/${id}`);

  return response.data;
};

type UseDeleteExpenseOptions = {
  mutationConfig?: MutationConfig<typeof deleteExpense>;
};

export const useDeleteExpense = ({
  mutationConfig,
}: UseDeleteExpenseOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
