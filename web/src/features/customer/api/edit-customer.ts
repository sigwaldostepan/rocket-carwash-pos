import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOMER_QUERY_KEY } from "../config/query-key";
import { EditCustomerSchema } from "../forms/edit-customer";

type EditCustomerParams = {
  id: string;
  data: EditCustomerSchema;
};

export const editCustomer = async ({ id, data }: EditCustomerParams) => {
  const response = await apiClient.put(`/customers/${id}`, data);

  return response.data;
};

type UseEditCustomerProps = {
  mutationConfig?: MutationConfig<typeof editCustomer>;
};

export const useEditCustomer = ({ mutationConfig }: UseEditCustomerProps) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editCustomer,
    onSuccess: async (...args) => {
      await queryClient.refetchQueries({
        queryKey: CUSTOMER_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
