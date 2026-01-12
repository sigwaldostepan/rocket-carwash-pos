export type ComplimentSummary = {
  nightShiftComplimentAmount: number;
  nightShiftComplimentCount: number;
  normalComplimentAmount: number;
  normalComplimentCount: number;
};

export type PaymentMethodSummary = {
  paymentMethod: string;
  count: number;
  totalAmount: number;
};
