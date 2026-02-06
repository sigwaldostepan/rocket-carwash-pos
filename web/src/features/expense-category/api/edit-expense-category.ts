import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EXPENSE_CATEGORY_QUERY_KEY } from "../config/query-key";
import { ExpenseCategorySchema } from "../forms/expense-category-form";

type EditExpenseCategoryParams = {
  id: string;
  data: ExpenseCategorySchema;
};

export const editExpenseCategory = async ({
  id,
  data,
}: EditExpenseCategoryParams) => {
  const response = await apiClient.put(`/expense-categories/${id}`, data);

  return response.data;
};

type UseEditExpenseCategoryOptions = {
  mutationConfig?: MutationConfig<typeof editExpenseCategory>;
};

export const useEditExpenseCategory = ({
  mutationConfig,
}: UseEditExpenseCategoryOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editExpenseCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_CATEGORY_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
