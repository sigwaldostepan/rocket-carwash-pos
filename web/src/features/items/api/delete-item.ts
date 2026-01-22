import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITEM_QUERY_KEY } from "../config/query-key";

export const deleteItem = async (id: string) => {
  const response = await apiClient.delete(`/items/${id}`);

  return response.data;
};

type UseDeleteItemOptions = {
  mutationConfig?: MutationConfig<typeof deleteItem>;
};

export const useDeleteItem = ({ mutationConfig }: UseDeleteItemOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ITEM_QUERY_KEY.all });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
