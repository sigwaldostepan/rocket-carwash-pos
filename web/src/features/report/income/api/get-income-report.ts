import { apiClient } from "@/lib/api-client";
import { DateRangeParams } from "@/types/api/params";
import { IncomeReport } from "@/types/api/report";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { INCOME_REPORT_QUERY_KEY } from "../config/query-key";
import { QueryConfig } from "@/lib/react-query";

export type GetIncomeReportParams = DateRangeParams;

export const getIncomeReport = async (
  params: GetIncomeReportParams,
): Promise<IncomeReport> => {
  const respone = await apiClient.get("/report/income", { params });

  return respone.data;
};

const getIncomeReportQueryOptions = (params: GetIncomeReportParams) => {
  return queryOptions({
    queryKey: INCOME_REPORT_QUERY_KEY.get(params),
    queryFn: () => getIncomeReport(params),
  });
};

type UseGetIncomeReportOptions = {
  params: GetIncomeReportParams;
  queryConfig?: QueryConfig<typeof getIncomeReportQueryOptions>;
};

export const useGetIncomeReport = ({
  params,
  queryConfig,
}: UseGetIncomeReportOptions) => {
  return useQuery({
    ...getIncomeReportQueryOptions(params),
    ...queryConfig,
  });
};
