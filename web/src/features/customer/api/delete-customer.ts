import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOMER_QUERY_KEY } from "../config/query-key";

export const deleteCustomer = async (id: string) => {
  const response = await apiClient.delete(`/customers/${id}`);

  return response.data;
};

type UseDeleteCustomerOptions = {
  mutationConfig?: MutationConfig<typeof deleteCustomer>;
};

export const useDeleteCustomer = ({
  mutationConfig,
}: UseDeleteCustomerOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
