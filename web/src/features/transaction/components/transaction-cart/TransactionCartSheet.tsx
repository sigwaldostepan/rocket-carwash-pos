"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NO_CUSTOMER } from "@/constants/transaction";
import { getApiErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { ShoppingCart, User2 } from "lucide-react";
import { toast } from "sonner";
import { TransactionCartItemList } from ".";
import { useCreateTransation } from "../../api/create-transaction";
import { createTransactionSchema } from "../../forms/create-transaction";
import {
  transactionStoreSelectors,
  useTransactionCartStore,
  useTransactionCustomerStore,
  useTransactionPaymentStore,
  useTransactionStore,
} from "../../stores";
import { CheckoutDialog, PickCustomerDialog } from "../dialogs";
import { TransactionCartSummary } from "./TransactionCartSummary";
import { useDisclosure } from "@/hooks/use-disclosure";

export const TransactionCartSheet = () => {
  const { customer } = useTransactionCustomerStore();
  const { cartItems } = useTransactionCartStore();
  const { subtotalPrice, totalPrice } = useTransactionPaymentStore();

  const showTriggerButton = cartItems.length > 0;

  const { isOpen, key, setIsOpen, openDialog } = useDialog();
  const { isOpen: isSheetOpen, setIsOpen: setSheetOpen } = useDisclosure();

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

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className={cn(
              "fixed right-4 bottom-4 flex size-12 items-center justify-center rounded-full lg:hidden",
              "hidden",
              showTriggerButton && "flex",
            )}
            size="icon"
          >
            <ShoppingCart className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="h-screen">
          <SheetHeader>
            <SheetTitle>Detail transaksi</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 overflow-y-scroll px-4">
            <div>
              <span className="text-muted-foreground text-xs">Customer:</span>
              <Button
                className="w-full truncate"
                variant="outline"
                onClick={openPickCustomerDialog}
              >
                <User2 />
                {customer && customer !== NO_CUSTOMER
                  ? customer.name
                  : "Pilih customer"}
              </Button>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Item:</span>
              <TransactionCartItemList customer={customer} />
            </div>
          </div>
          <SheetFooter>
            <TransactionCartSummary
              subtotalPrice={subtotalPrice}
              totalPrice={totalPrice}
            />
            <Button
              disabled={cartItems.length === 0}
              onClick={openPaymentDialog}
            >
              Proses pembayaran
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <PickCustomerDialog
        isOpen={isOpen && key === DIALOG_KEY.transaction.pickCustomer}
        setIsOpen={(open) =>
          setIsOpen(DIALOG_KEY.transaction.pickCustomer, open)
        }
      />
      <CheckoutDialog
        isSubmitting={isCreatingTransaction}
        open={isOpen && key === DIALOG_KEY.transaction.payment}
        onOpenChange={(open: boolean) =>
          setIsOpen(DIALOG_KEY.transaction.payment, open)
        }
        onConfirm={onPaymentConfirm}
        sheetOnOpenChange={setSheetOpen}
      />
    </>
  );
};
