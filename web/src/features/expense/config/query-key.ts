import { GetExpensesParams } from "../api/get-expenses";

const standardizeParams = (params: GetExpensesParams) => {
  return {
    page: params.page,
    limit: params.limit,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };
};

export const EXPENSE_QUERY_KEY = {
  all: ["expenses"],
  paginated: (params: GetExpensesParams) => [
    "expenses",
    standardizeParams(params),
  ],
};
