import { apiClient } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Item } from "@/types/api/item";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ITEM_QUERY_KEY } from "../config/query-key";

export type GetItemsParams = {
  search?: string;
};

export const getItems = async ({ search }: GetItemsParams): Promise<Item[]> => {
  const response = await apiClient.get("/items", { params: { search } });

  return response.data;
};

const getItemsQueryOptions = (params: GetItemsParams) => {
  return queryOptions({
    queryKey: ITEM_QUERY_KEY.params(params),
    queryFn: () => getItems(params),
  });
};

type UseGetItemsOptions = {
  params: GetItemsParams;
  queryConfig?: QueryConfig<typeof getItemsQueryOptions>;
};

export const useGetItems = ({ params, queryConfig }: UseGetItemsOptions) => {
  return useQuery({
    ...getItemsQueryOptions(params),
    ...queryConfig,
  });
};
