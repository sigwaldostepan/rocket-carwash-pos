import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { BatchDeleteParams } from "@/types/api/params";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EXPENSE_CATEGORY_QUERY_KEY } from "../config/query-key";

type BatchDeleteExpenseCategoryParams = BatchDeleteParams;

export const batchDeleteExpenseCategory = async ({
  ids,
}: BatchDeleteExpenseCategoryParams) => {
  const response = await apiClient.post("/expense-categories/batch-delete", {
    ids,
  });

  return response.data;
};

type UseBatchDeleteExpenseCategoryOptions = {
  mutationConfig?: MutationConfig<typeof batchDeleteExpenseCategory>;
};

export const useBatchDeleteExpenseCategory = ({
  mutationConfig,
}: UseBatchDeleteExpenseCategoryOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: batchDeleteExpenseCategory,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_CATEGORY_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
