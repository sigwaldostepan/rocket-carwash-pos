import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EXPENSE_CATEGORY_QUERY_KEY } from "../config/query-key";
import { ExpenseCategorySchema } from "../forms/expense-category-form";

export const createExpenseCategory = async (data: ExpenseCategorySchema) => {
  const response = await apiClient.post("/expense-categories", data);

  return response.data;
};

type UseCreateExpenseCategoryOptions = {
  mutationConfig?: MutationConfig<typeof createExpenseCategory>;
};

export const useCreateExpenseCategory = ({
  mutationConfig,
}: UseCreateExpenseCategoryOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpenseCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_CATEGORY_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
