import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITEM_QUERY_KEY } from "../config/query-key";
import { CreateItemSchema } from "../forms/create-item";

export const createItem = async (data: CreateItemSchema) => {
  const response = await apiClient.post("/items", data);

  return response.data;
};

type UseCreateItemOptions = {
  mutationConfig?: MutationConfig<typeof createItem>;
};

export const useCreateItem = ({ mutationConfig }: UseCreateItemOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: ITEM_QUERY_KEY.all,
      });

      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
