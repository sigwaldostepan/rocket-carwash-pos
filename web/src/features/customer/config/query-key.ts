import { GetCustomerParams } from "../api/get-customers";

const standardizeParams = (params: GetCustomerParams) => {
  return {
    page: params.page,
    limit: params.limit,
    search: params.search ?? "",
  };
};

export const CUSTOMER_QUERY_KEY = {
  all: ["customers"],
  detail: (id: string) => ["customers", id],
  params: (params: GetCustomerParams) => [
    "customers",
    standardizeParams(params),
  ],
  infinite: (params: GetCustomerParams) => [
    "customers",
    "infinite",
    standardizeParams(params),
  ],
};
