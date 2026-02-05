import { apiClient } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { TRANSACTION_QUERY_KEY } from "../config/query-key";
import { QueryConfig } from "@/lib/react-query";
import { TransactionWithCustomer } from "@/types/api/transaction";
import { PaginatedResponse } from "@/types/api/response";
import { PaginationParams } from "@/types/api/params";

export type GetTransactionsParams = PaginationParams & {
  dateFrom?: string;
  dateTo?: string;
};

export const getTransactions = async ({
  page,
  limit,
  dateFrom,
  dateTo,
}: GetTransactionsParams): Promise<
  PaginatedResponse<TransactionWithCustomer>
> => {
  const response = await apiClient.get("/transactions", {
    params: {
      page,
      limit,
      dateFrom,
      dateTo,
    },
  });

  return response.data;
};

export const getTransactionsQueryOptions = (params: GetTransactionsParams) => {
  return queryOptions({
    queryKey: TRANSACTION_QUERY_KEY.params(params),
    queryFn: () => getTransactions(params),
  });
};

type UseGetTransactionsOptions = {
  params: GetTransactionsParams;
  queryConfig?: QueryConfig<typeof getTransactionsQueryOptions>;
};

export const useGetTransactions = ({
  params,
  queryConfig,
}: UseGetTransactionsOptions) => {
  return useQuery({
    ...getTransactionsQueryOptions(params),
    ...queryConfig,
  });
};
