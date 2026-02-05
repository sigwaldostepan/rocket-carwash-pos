import { PaymentMethod } from "@/constants/transaction";
import { useSmartQuickAmounts } from "@/features/transaction/hooks/use-smart-quick-amount";
import { useTransactionPaymentStore } from "@/features/transaction/stores";

export const useCheckoutPayment = () => {
  const {
    paymentMethod,
    paidAmount,
    totalPrice,
    complimentAmount,
    isNightShift,
    setPaymentMethod,
    setPaidAmount,
    setCompliment,
    setNightShift,
    resetPaymentStates,
  } = useTransactionPaymentStore();

  const smartQuickAmounts = useSmartQuickAmounts(totalPrice);

  const isCashPayment = paymentMethod === PaymentMethod.CASH;
  const isComplimentPayment = paymentMethod === PaymentMethod.COMPLIMENT;
  const changeAmount = paidAmount - totalPrice;

  const isAmountSufficient = isComplimentPayment
    ? paidAmount + complimentAmount >= totalPrice
    : paidAmount >= totalPrice;

  const canSubmit =
    isAmountSufficient &&
    paidAmount > 0 &&
    (isComplimentPayment ? complimentAmount > 0 : true);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPaidAmount(method !== PaymentMethod.CASH ? totalPrice : 0);
  };

  return {
    state: {
      paymentMethod,
      paidAmount,
      totalPrice,
      complimentAmount,
      isNightShift,
      isCashPayment,
      isComplimentPayment,
      changeAmount,
      isAmountSufficient,
      canSubmit,
      smartQuickAmounts,
    },
    actions: {
      setPaymentMethod: handlePaymentMethodChange,
      setPaidAmount,
      setCompliment,
      setNightShift,
      resetPaymentStates,
    },
  };
};
