import { apiClient } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { PaginatedResponse } from "@/types/api/response";
import { ExpenseWithCategory } from "@/types/api/expense";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { EXPENSE_QUERY_KEY } from "../config/query-key";
import { PaginationParams } from "@/types/api/params";

export type GetExpensesParams = PaginationParams & {
  dateFrom?: string;
  dateTo?: string;
};

export const getExpenses = async (
  params: GetExpensesParams,
): Promise<PaginatedResponse<ExpenseWithCategory>> => {
  const response = await apiClient.get("/expenses", { params });

  return response.data;
};

export const getExpensesQueryOptions = (params: GetExpensesParams) => {
  return queryOptions({
    queryKey: [...EXPENSE_QUERY_KEY.all, params],
    queryFn: () => getExpenses(params),
  });
};

type UseGetExpensesOptions = {
  params: GetExpensesParams;
  queryConfig?: QueryConfig<typeof getExpensesQueryOptions>;
};

export const useGetExpenses = ({
  params,
  queryConfig,
}: UseGetExpensesOptions) => {
  return useQuery({
    ...getExpensesQueryOptions(params),
    ...queryConfig,
  });
};
