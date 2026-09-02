import { apiClient } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { DRAFT_QUERY_KEY } from "../config/query-key";
import { QueryConfig } from "@/lib/react-query";
import { DraftWithCustomer } from "../types";

export const getDrafts = async (): Promise<DraftWithCustomer[]> => {
  const response = await apiClient.get("/drafts");

  return response.data;
};

export const getDraftsQueryOptions = () => {
  return queryOptions({
    queryKey: DRAFT_QUERY_KEY.all,
    queryFn: getDrafts,
  });
};

type UseGetDraftsOptions = {
  queryConfig?: QueryConfig<typeof getDraftsQueryOptions>;
};

export const useGetDrafts = ({ queryConfig }: UseGetDraftsOptions = {}) => {
  return useQuery({
    ...getDraftsQueryOptions(),
    ...queryConfig,
  });
};