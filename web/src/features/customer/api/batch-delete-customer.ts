import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { BatchDeleteParams } from "@/types/api/params";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOMER_QUERY_KEY } from "../config/query-key";

type BatchDeleteCustomerParams = BatchDeleteParams;

export const batchDeleteCustomer = async ({
  ids,
}: BatchDeleteCustomerParams) => {
  const response = await apiClient.post("/customers/batch-delete", { ids });

  return response.data;
};

type UseBatchDeleteCustomerOptions = {
  mutationConfig?: MutationConfig<typeof batchDeleteCustomer>;
};

export const useBatchDeleteCustomer = ({
  mutationConfig,
}: UseBatchDeleteCustomerOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: batchDeleteCustomer,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
