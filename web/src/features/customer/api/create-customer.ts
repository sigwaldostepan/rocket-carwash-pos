import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOMER_QUERY_KEY } from "../config/query-key";
import { CreateCustomerSchema } from "../forms/create-customer";

export const createCustomer = async (data: CreateCustomerSchema) => {
  const response = await apiClient.post("/customers", data);

  return response.data;
};

type UseCreateCustomerOptions = {
  mutationConfig?: MutationConfig<typeof createCustomer>;
};

export const useCreateCustomer = ({
  mutationConfig,
}: UseCreateCustomerOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: CUSTOMER_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
