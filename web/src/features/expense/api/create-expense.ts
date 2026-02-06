import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EXPENSE_QUERY_KEY } from "../config/query-key";
import { ExpenseFormSchema } from "../forms/expense-form";

export const createExpense = async (data: ExpenseFormSchema) => {
  const response = await apiClient.post("/expenses", data);

  return response.data;
};

type UseCreateExpenseOptions = {
  mutationConfig?: MutationConfig<typeof createExpense>;
};

export const useCreateExpense = ({
  mutationConfig,
}: UseCreateExpenseOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
