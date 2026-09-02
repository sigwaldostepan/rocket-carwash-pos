"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useSaveDraft } from "@/features/draft/hooks/use-save-draft";
import { useLoadDraftData } from "@/features/draft/hooks/use-load-draft-data";
import { useDeleteDraft } from "@/features/draft/api/delete-draft";
import { DeleteDraftAlert } from "@/features/draft/components/dialogs/DeleteDraftAlert";
import { DraftWithCustomer } from "@/features/draft/types";
import { useDisclosure } from "@/hooks/use-disclosure";
import { getApiErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { Plus, Save, ShoppingCart, User2 } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTransactionCartCheckout } from "../../hooks/use-transaction-cart";
import { useTransactionStore } from "../../stores";
import { CheckoutDialog, PickCustomerDialog } from "../dialogs";
import { DraftSelectDialog } from "./DraftSelectDialog";
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

  const { saveDraft, isSaving } = useSaveDraft();
  const { load: loadDraftData } = useLoadDraftData();
  const hasLoadedDraft = useTransactionStore((s) => s.loadedDraftId != null);

  const showTriggerButton = cartItems.length > 0;
  const { isOpen: isSheetOpen, setIsOpen: setSheetOpen } = useDisclosure();

  const [pendingDraft, setPendingDraft] = useState<DraftWithCustomer | null>(
    null,
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const hasItems = cartItems.length > 0;

  const handleLoadDraft = useCallback(
    (draft: DraftWithCustomer) => {
      if (hasItems) {
        setPendingDraft(draft);
        setIsConfirmOpen(true);
      } else {
        loadDraftData(draft);
        toast.success("Draft dimuat");
        setSheetOpen(false);
      }
    },
    [hasItems, loadDraftData, setSheetOpen],
  );

  const handleConfirmLoad = useCallback(() => {
    if (pendingDraft) {
      loadDraftData(pendingDraft);
      toast.success("Draft dimuat");
      setSheetOpen(false);
    }
    setIsConfirmOpen(false);
    setPendingDraft(null);
  }, [pendingDraft, loadDraftData, setSheetOpen]);

  const handleCancelLoad = useCallback(() => {
    setIsConfirmOpen(false);
    setPendingDraft(null);
  }, []);

  const { data: dialogDraft, setIsOpen } = useDialog<DraftWithCustomer>();

  const { mutate: deleteDraft } = useDeleteDraft({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Draft berhasil dihapus");
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      },
    },
  });

  const handleConfirmDelete = useCallback(() => {
    if (dialogDraft) {
      deleteDraft(dialogDraft.id);
    }
    setIsOpen(DIALOG_KEY.draft.delete, false);
  }, [dialogDraft, deleteDraft, setIsOpen]);

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className={cn(
              "fixed right-4 bottom-4 size-12 items-center justify-center rounded-full md:hidden",
              showTriggerButton ? "flex" : "hidden",
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
            <DraftSelectDialog onLoadDraft={handleLoadDraft} />
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
              disabled={cartItems.length === 0 || isSaving || hasLoadedDraft}
              variant="secondary"
              onClick={saveDraft}
            >
              <Save />
              Simpan draft
            </Button>
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
      <DeleteDraftAlert onConfirm={handleConfirmDelete} />

      {/* load draft confirmation */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Muat draft ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Cart sedang berisi item. Muat draft akan mengganti semua item yang
              ada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelLoad}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLoad}>
              Ya, muat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
