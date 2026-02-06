import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { BatchDeleteParams } from "@/types/api/params";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EXPENSE_QUERY_KEY } from "../config/query-key";

type BatchDeleteExpenseParams = BatchDeleteParams;

export const batchDeleteExpense = async ({ ids }: BatchDeleteExpenseParams) => {
  const response = await apiClient.post("/expenses/batch-delete", { ids });

  return response.data;
};

type UseBatchDeleteExpenseOptions = {
  mutationConfig?: MutationConfig<typeof batchDeleteExpense>;
};

export const useBatchDeleteExpense = ({
  mutationConfig,
}: UseBatchDeleteExpenseOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: batchDeleteExpense,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
