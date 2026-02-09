"use client";

import { IncomePaymentMethodSummary } from "@/types/api/report";
import { PaymentMethodDetailItem } from "./PaymentMethodDetailItem";

type PaymentMethodDetailProps = {
  data: IncomePaymentMethodSummary[];
};

export const PaymentMethodDetail = ({ data }: PaymentMethodDetailProps) => {
  // Sort by totalAmount descending
  const sortedData = [...data].sort((a, b) => b.totalAmount - a.totalAmount);

  return (
    <div className="divide-y">
      {sortedData.map((item) => (
        <PaymentMethodDetailItem key={item.paymentMethod} data={item} />
      ))}
    </div>
  );
};
