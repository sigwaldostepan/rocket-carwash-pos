import { GetIncomeReportParams } from "../api/get-income-report";

const standardizeParams = (params: GetIncomeReportParams) => {
  return {
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };
};

export const INCOME_REPORT_QUERY_KEY = {
  get: (params: GetIncomeReportParams) => [
    "income-report",
    standardizeParams(params),
  ],
};
