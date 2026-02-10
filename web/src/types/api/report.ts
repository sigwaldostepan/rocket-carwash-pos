export type IncomeSummary = {
  transactionCount: number;
  grossProfit: number;
  netProfit: number;
  complimentValue: number;
};

export type IncomePaymentMethodSummary = {
  paymentMethod: string;
  transactionCount: number;
  totalAmount: number;
  contributionPercent: number;
};

export type IncomeReport = {
  summary: IncomeSummary;
  paymentMethodSummary: IncomePaymentMethodSummary[];
};

export type ExpenseSummary = {
  expenseCount: number;
  totalAmount: number;
};

export type ExpenseCategorySummary = {
  category: {
    id: string;
    name: string;
  };
  expenseCount: number;
  total: number;
  contributionPercent: number;
};

export type ExpenseReport = {
  summary: ExpenseSummary;
  categorySummary: ExpenseCategorySummary[];
};
