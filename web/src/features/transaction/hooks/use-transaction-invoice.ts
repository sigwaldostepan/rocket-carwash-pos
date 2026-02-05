import {
  useTransactionCartStore,
  useTransactionCustomerStore,
  useTransactionPaymentStore,
} from "../stores";

export const useTransactionInvoice = () => {
  const { customer } = useTransactionCustomerStore();
  const { cartItems } = useTransactionCartStore();
  const { discount, paidAmount, paymentMethod, totalPrice } =
    useTransactionPaymentStore();

  const changeAmount = paidAmount - totalPrice;

  return {
    customer,
    cartItems,
    discount,
    paidAmount,
    paymentMethod,
    totalPrice,
    changeAmount,
  };
};
