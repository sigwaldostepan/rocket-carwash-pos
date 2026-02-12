"use client";

import { Button } from "@/components/ui/button";
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipProvider,
  HybridTooltipTrigger,
} from "@/components/ui/hybrid-tooltip";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NO_CUSTOMER } from "@/constants/transaction";
import { CreateCustomerDialog } from "@/features/customer/components/dialogs";
import { useDisclosure } from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";
import { DIALOG_KEY } from "@/stores/dialog";
import { Plus, ShoppingCart, User2 } from "lucide-react";
import { useTransactionCartCheckout } from "../../hooks/use-transaction-cart";
import { CheckoutDialog, PickCustomerDialog } from "../dialogs";
import { TransactionCartItemList } from "./TransactionCartItemList";
import { TransactionCartSummary } from "./TransactionCartSummary";

export const TransactionCartSheet = () => {
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

  const showTriggerButton = cartItems.length > 0;
  const { isOpen: isSheetOpen, setIsOpen: setSheetOpen } = useDisclosure();

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className={cn(
              "fixed right-4 bottom-4 flex size-12 items-center justify-center rounded-full md:hidden",
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
                    <HybridTooltipTrigger>
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
              onClick={dialogActions.payment}
            >
              Proses pembayaran
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* dialogs */}
      <PickCustomerDialog
        isOpen={dialogState.isPickCustomerDialogOpen}
        setIsOpen={(open) =>
          dialogState.setIsOpen(DIALOG_KEY.transaction.pickCustomer, open)
        }
      />
      <CheckoutDialog
        isSubmitting={isCreatingTransaction}
        open={dialogState.isCheckoutDialogOpen}
        onOpenChange={(open: boolean) =>
          dialogState.setIsOpen(DIALOG_KEY.transaction.payment, open)
        }
        onConfirm={dialogActions.paymentConfirm}
        sheetOnOpenChange={setSheetOpen}
      />
      <CreateCustomerDialog onSuccess={(data) => setCustomer(data)} />
    </>
  );
};
