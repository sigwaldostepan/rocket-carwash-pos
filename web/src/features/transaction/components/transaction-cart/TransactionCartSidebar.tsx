"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NO_CUSTOMER } from "@/constants/transaction";
import { getApiErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { User2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
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
import { TransactionCartItemList } from "./TransactionCartItemList";
import { TransactionCartSummary } from "./TransactionCartSummary";

type TransactionCartSidebarProps = React.HTMLAttributes<HTMLDivElement>;

export const TransactionCartSidebar = ({
  className,
  ...props
}: TransactionCartSidebarProps) => {
  const { cartItems } = useTransactionCartStore();
  const { customer } = useTransactionCustomerStore();
  const { subtotalPrice, totalPrice } = useTransactionPaymentStore();

  const { isOpen, key, setIsOpen, openDialog } = useDialog();

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
      <aside
        className={cn("hidden flex-col space-y-4 lg:flex", className)}
        {...props}
      >
        <Card className="h-[calc(100vh-18rem)]! w-full flex-col gap-2 md:flex">
          <CardHeader className="shrink-0">
            <CardTitle>Detail transaksi</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
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
            <Separator className="my-4" />
            <div>
              <span className="text-muted-foreground text-xs">Item:</span>
              <div className="overflow-y-auto">
                <TransactionCartItemList customer={customer} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex h-full flex-col space-y-3 text-sm">
            <TransactionCartSummary
              subtotalPrice={subtotalPrice}
              totalPrice={totalPrice}
            />

            <Button
              disabled={cartItems.length === 0}
              className="w-full"
              size="lg"
              onClick={openPaymentDialog}
            >
              Proses pembayaran
            </Button>
          </CardContent>
        </Card>
      </aside>

      {/* dialogs */}
      <CheckoutDialog
        isSubmitting={isCreatingTransaction}
        open={isOpen && key === DIALOG_KEY.transaction.payment}
        onOpenChange={(open: boolean) =>
          setIsOpen(DIALOG_KEY.transaction.payment, open)
        }
        onConfirm={onPaymentConfirm}
      />
      <PickCustomerDialog
        isOpen={isOpen && key === DIALOG_KEY.transaction.pickCustomer}
        setIsOpen={(open) =>
          setIsOpen(DIALOG_KEY.transaction.pickCustomer, open)
        }
      />
    </>
  );
};
