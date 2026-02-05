import { GetTransactionsParams } from "../api/get-transactions";

const standardizeParams = (params: GetTransactionsParams) => {
  return {
    page: params.page,
    limit: params.limit,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };
};

export const TRANSACTION_QUERY_KEY = {
  all: ["transactions"],
  detail: (id: string) => [...TRANSACTION_QUERY_KEY.all, id],
  params: (params: GetTransactionsParams) => [
    ...TRANSACTION_QUERY_KEY.all,
    standardizeParams(params),
  ],
};
