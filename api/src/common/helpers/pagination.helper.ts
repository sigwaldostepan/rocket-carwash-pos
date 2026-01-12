export const paginateResponse = <T>(data: T[], currentPage: number, perPage: number, totalItems: number) => {
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    meta: {
      currentPage,
      perPage,
      totalItems,
      totalPages,
    },
  };
};
