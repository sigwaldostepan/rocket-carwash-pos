export type PaginationParams = {
  page: number;
  limit: number;
};

export type BatchDeleteParams = {
  ids: string[];
};

export type DateRangeParams = {
  dateFrom: string | undefined;
  dateTo: string | undefined;
};
