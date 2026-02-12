import { toast } from "sonner";
import { useCreateTransation } from "../api/create-transaction";
import {
  transactionStoreSelectors,
  useTransactionCartStore,
  useTransactionCustomerStore,
  useTransactionPaymentStore,
  useTransactionStore,
} from "../stores";
import { getApiErrorMessage } from "@/lib/api-client";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { createTransactionSchema } from "../forms/create-transaction";

export const useTransactionCartCheckout = () => {
  const { cartItems } = useTransactionCartStore();
  const { customer, setCustomer } = useTransactionCustomerStore();
  const { subtotalPrice, totalPrice } = useTransactionPaymentStore();

  const { mutateAsync: createTransaction, isPending: isCreatingTransaction } =
    useCreateTransation({
      mutationConfig: {
        onSuccess: () => {
          toast.success("Transaksi berhasil dibuat");
        },
        onError: (err) => {
          const message = getApiErrorMessage(err);
          toast.error(message);
        },
      },
    });

  const {
    isOpen: dialogOpen,
    key: dialogKey,
    setIsOpen: setDialogOpen,
    openDialog,
  } = useDialog();

  const openPaymentDialog = () => {
    openDialog(DIALOG_KEY.transaction.payment, null);
  };

  const openPickCustomerDialog = () => {
    openDialog(DIALOG_KEY.transaction.pickCustomer, null);
  };

  const onPaymentConfirm = async () => {
    const payload = transactionStoreSelectors.getCreateTransactionPayload()(
      useTransactionStore.getState(),
    );

    const { error, success } = createTransactionSchema.safeParse(payload);
    if (!success) {
      toast.error(error.message);
      throw new Error(error.message);
    }

    return await createTransaction(payload);
  };

  const onCustomerCreate = () => {
    openDialog(DIALOG_KEY.customer.create, null);
  };

  return {
    cartItems,
    customer,
    setCustomer,
    subtotalPrice,
    totalPrice,
    createTransaction,
    isCreatingTransaction,
    dialogActions: {
      payment: openPaymentDialog,
      pickCustomer: openPickCustomerDialog,
      customerCreate: onCustomerCreate,
      paymentConfirm: onPaymentConfirm,
    },
    dialogState: {
      isOpen: dialogOpen,
      key: dialogKey,
      isCheckoutDialogOpen:
        dialogOpen && dialogKey === DIALOG_KEY.transaction.payment,
      isPickCustomerDialogOpen:
        dialogOpen && dialogKey === DIALOG_KEY.transaction.pickCustomer,
      isCustomerCreateDialogOpen:
        dialogOpen && dialogKey === DIALOG_KEY.customer.create,
      setIsOpen: setDialogOpen,
    },
  };
};
