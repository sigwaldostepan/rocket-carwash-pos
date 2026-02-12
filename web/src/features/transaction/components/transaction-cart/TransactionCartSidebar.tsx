"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipProvider,
  HybridTooltipTrigger,
} from "@/components/ui/hybrid-tooltip";
import { Separator } from "@/components/ui/separator";
import { NO_CUSTOMER } from "@/constants/transaction";
import { CreateCustomerDialog } from "@/features/customer/components/dialogs";
import { cn } from "@/lib/utils";
import { DIALOG_KEY } from "@/stores/dialog";
import { Plus, User2 } from "lucide-react";
import React from "react";
import { useTransactionCartCheckout } from "../../hooks/use-transaction-cart";
import { CheckoutDialog, PickCustomerDialog } from "../dialogs";
import { TransactionCartItemList } from "./TransactionCartItemList";
import { TransactionCartSummary } from "./TransactionCartSummary";

type TransactionCartSidebarProps = React.HTMLAttributes<HTMLDivElement>;

export const TransactionCartSidebar = ({
  className,
  ...props
}: TransactionCartSidebarProps) => {
  const {
    dialogActions,
    customer,
    cartItems,
    subtotalPrice,
    totalPrice,
    isCreatingTransaction,
    dialogState,
    setCustomer,
  } = useTransactionCartCheckout();

  return (
    <>
      <aside
        className={cn("hidden flex-col space-y-4 md:flex", className)}
        {...props}
      >
        <Card className="h-[calc(100vh-18rem)]! w-full flex-col gap-2 md:flex">
          <CardHeader className="shrink-0">
            <CardTitle>Detail transaksi</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div>
              <span className="text-muted-foreground text-xs">Customer:</span>
              <div className="flex w-full flex-row gap-2">
                <Button
                  className="flex-1 truncate"
                  variant="outline"
                  onClick={dialogActions.pickCustomer}
                >
                  <User2 />
                  {customer && customer !== NO_CUSTOMER
                    ? customer.name
                    : "Pilih customer"}
                </Button>
                <HybridTooltipProvider>
                  <HybridTooltip>
                    <HybridTooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={dialogActions.customerCreate}
                      >
                        <Plus />
                      </Button>
                    </HybridTooltipTrigger>
                    <HybridTooltipContent>
                      Tambah customer baru
                    </HybridTooltipContent>
                  </HybridTooltip>
                </HybridTooltipProvider>
              </div>
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
              onClick={dialogActions.payment}
            >
              Proses pembayaran
            </Button>
          </CardContent>
        </Card>
      </aside>

      {/* dialogs */}
      <CheckoutDialog
        isSubmitting={isCreatingTransaction}
        open={dialogState.isCheckoutDialogOpen}
        onOpenChange={(open: boolean) =>
          dialogState.setIsOpen(DIALOG_KEY.transaction.payment, open)
        }
        onConfirm={dialogActions.paymentConfirm}
      />
      <PickCustomerDialog
        isOpen={dialogState.isPickCustomerDialogOpen}
        setIsOpen={(open) =>
          dialogState.setIsOpen(DIALOG_KEY.transaction.pickCustomer, open)
        }
      />
      <CreateCustomerDialog onSuccess={(data) => setCustomer(data)} />
    </>
  );
};
