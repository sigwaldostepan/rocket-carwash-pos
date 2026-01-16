export type Customer = {
  id: string;
  code: string;
  name: string;
  phoneNumber: string;
  point: number;
};

export type CustomerWithTransactionCount = Customer & {
  transactionCount: number;
};
