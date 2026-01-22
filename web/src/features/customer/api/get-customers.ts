import { apiClient } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { CustomerWithTransactionCount } from "@/types/api/customer";
import { PaginatedResponse } from "@/types/api/response";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { CUSTOMER_QUERY_KEY } from "../config/query-key";
import { PaginationParams } from "@/types/api/params";

export type GetCustomerParams = PaginationParams & {
  search?: string;
};

export const getCustomer = async ({
  page,
  limit,
  search,
}: GetCustomerParams): Promise<
  PaginatedResponse<CustomerWithTransactionCount>
> => {
  const response = await apiClient.get("/customers", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
};

export const getCustomersQueryOptions = (params: GetCustomerParams) => {
  return queryOptions({
    queryKey: CUSTOMER_QUERY_KEY.params(params),
    queryFn: () => getCustomer(params),
  });
};

type UseGetCustomersOptions = {
  params: GetCustomerParams;
  queryConfig?: QueryConfig<typeof getCustomersQueryOptions>;
};

export const useGetCustomers = ({
  params,
  queryConfig,
}: UseGetCustomersOptions) => {
  return useQuery({
    ...getCustomersQueryOptions(params),
    ...queryConfig,
  });
};
