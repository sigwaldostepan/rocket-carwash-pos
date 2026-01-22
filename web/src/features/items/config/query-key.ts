import { GetItemsParams } from "../api/get-items";

const standardizeParams = (params: GetItemsParams) => {
  return {
    search: params.search ?? "",
  };
};

export const ITEM_QUERY_KEY = {
  all: ["items"],
  detail: (id: string) => ["items", { id }],
  params: (params: GetItemsParams) => ["items", standardizeParams(params)],
};
