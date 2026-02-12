export const paths = {
  auth: {
    login: {
      getPath: (redirectTo?: string) =>
        `/login${redirectTo ? `?redirectTo=${redirectTo}` : ""}`,
    },
  },

  app: {
    index: "/",
    home: "/home",
    customers: "/customers",
    items: "/items",
    transactions: {
      index: "/transactions",
      create: "/transactions/create",
    },
    expenses: {
      index: "/expenses",
      category: "/expenses/categories",
    },
    reports: {
      expense: "/reports/expense",
      income: "/reports/income",
    },
  },
};
