import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EXPENSE_CATEGORY_QUERY_KEY } from "../config/query-key";

export const deleteExpenseCategory = async (id: string) => {
  const response = await apiClient.delete(`/expense-categories/${id}`);

  return response.data;
};

type UseDeleteExpenseCategoryOptions = {
  mutationConfig?: MutationConfig<typeof deleteExpenseCategory>;
};

export const useDeleteExpenseCategory = ({
  mutationConfig,
}: UseDeleteExpenseCategoryOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpenseCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_CATEGORY_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
