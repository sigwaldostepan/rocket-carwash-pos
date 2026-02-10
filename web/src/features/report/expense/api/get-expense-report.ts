import { apiClient } from "@/lib/api-client";
import { DateRangeParams } from "@/types/api/params";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { EXPENSE_REPORT_QUERY_KEY } from "../config/query-key";
import { QueryConfig } from "@/lib/react-query";

export type GetExpenseReportParams = DateRangeParams;

export const getExpenseReport = async ({
  dateFrom,
  dateTo,
}: GetExpenseReportParams) => {
  const response = await apiClient.get("/report/expense", {
    params: {
      dateFrom,
      dateTo,
    },
  });

  return response.data;
};

export const getExpenseReportQueryOptions = (
  params: GetExpenseReportParams,
) => {
  return queryOptions({
    queryKey: EXPENSE_REPORT_QUERY_KEY.get(params),
    queryFn: () => getExpenseReport(params),
  });
};

type UseGetExpenseReportOptions = {
  params: GetExpenseReportParams;
  queryConfig?: QueryConfig<typeof getExpenseReportQueryOptions>;
};

export const useGetExpenseReport = ({
  params,
  queryConfig,
}: UseGetExpenseReportOptions) => {
  return useQuery({
    ...getExpenseReportQueryOptions(params),
    ...queryConfig,
  });
};
