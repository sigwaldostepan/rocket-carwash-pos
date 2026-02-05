import { apiClient } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { CustomerWithTransactionCount } from "@/types/api/customer";
import { PaginationParams } from "@/types/api/params";
import { PaginatedResponse } from "@/types/api/response";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { CUSTOMER_QUERY_KEY } from "../config/query-key";

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

export const getInfiniteCustomersQueryOptions = (params: GetCustomerParams) => {
  return infiniteQueryOptions({
    queryKey: CUSTOMER_QUERY_KEY.infinite(params),
    queryFn: ({ pageParam }) =>
      getCustomer({
        ...params,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage >= lastPage.meta.totalPages) {
        return undefined;
      }

      return lastPage.meta.currentPage + 1;
    },
  });
};

type UseGetInfiniteCustomerOptions = {
  params: GetCustomerParams;
  queryConfig?: QueryConfig<typeof getInfiniteCustomersQueryOptions>;
};

export const useGetInfiniteCustomers = ({
  params,
  queryConfig,
}: UseGetInfiniteCustomerOptions) => {
  return useInfiniteQuery({
    ...getInfiniteCustomersQueryOptions(params),
    ...queryConfig,
  });
};
