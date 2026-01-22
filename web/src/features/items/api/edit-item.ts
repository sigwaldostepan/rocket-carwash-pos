import { apiClient } from "@/lib/api-client";
import { EditItemSchema } from "../forms/edit-item";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITEM_QUERY_KEY } from "../config/query-key";

type EditItemParams = {
  id: string;
  data: EditItemSchema;
};

export const editItem = async ({ id, data }: EditItemParams) => {
  const response = await apiClient.put(`/items/${id}`, data);

  return response.data;
};

type UseEditItemOptions = {
  mutationConfig?: MutationConfig<typeof editItem>;
};

export const useEditItem = ({ mutationConfig }: UseEditItemOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editItem,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ITEM_QUERY_KEY.all });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
