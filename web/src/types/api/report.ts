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
