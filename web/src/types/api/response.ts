export type PaginationMetadata = {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMetadata;
};
