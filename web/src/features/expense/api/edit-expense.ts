import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EXPENSE_QUERY_KEY } from "../config/query-key";
import { ExpenseFormSchema } from "../forms/expense-form";

type EditExpenseParams = {
  id: string;
  data: ExpenseFormSchema;
};

export const editExpense = async ({ id, data }: EditExpenseParams) => {
  const response = await apiClient.put(`/expenses/${id}`, data);

  return response.data;
};

type UseEditExpenseOptions = {
  mutationConfig?: MutationConfig<typeof editExpense>;
};

export const useEditExpense = ({ mutationConfig }: UseEditExpenseOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editExpense,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
