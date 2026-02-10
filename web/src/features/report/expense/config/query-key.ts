import { GetExpenseReportParams } from "../api/get-expense-report";

const standardizeParams = (params: GetExpenseReportParams) => {
  return {
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };
};

export const EXPENSE_REPORT_QUERY_KEY = {
  get: (params: GetExpenseReportParams) => [
    "expense-report",
    standardizeParams(params),
  ],
};
