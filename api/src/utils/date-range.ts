export const buildDateRangeWhere = (dateFrom: string | undefined, dateTo: string | undefined) => {
  const from = !!dateFrom ? new Date(dateFrom) : new Date();
  const to = !!dateTo ? new Date(dateTo) : new Date();

  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  return {
    createdAt: {
      gte: from,
      lte: to,
    },
  };
};
