import { apiClient } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { ExpenseCategoryWithExpenseCount } from "@/types/api/expense";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { EXPENSE_CATEGORY_QUERY_KEY } from "../config/query-key";

// type GetExpensesProps = PaginationParams & {
//   dateFrom?: string;
//   dateTo?: string;
// };

export const getExpenseCategories = async (): Promise<
  ExpenseCategoryWithExpenseCount[]
> => {
  const response = await apiClient.get("/expense-categories");

  return response.data;
};

export const getExpenseCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: EXPENSE_CATEGORY_QUERY_KEY.all,
    queryFn: () => getExpenseCategories(),
  });
};

type UseGetExpenseCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getExpenseCategoriesQueryOptions>;
};

export const useGetExpenseCategories = ({
  queryConfig,
}: UseGetExpenseCategoriesOptions) => {
  return useQuery({
    ...getExpenseCategoriesQueryOptions(),
    ...queryConfig,
  });
};
