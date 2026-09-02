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
import { useSaveDraft } from "@/features/draft/hooks/use-save-draft";
import { DeleteDraftAlert } from "@/features/draft/components/dialogs/DeleteDraftAlert";
import { useDeleteDraft } from "@/features/draft/api/delete-draft";
import { DraftWithCustomer } from "@/features/draft/types";
import { useLoadDraftData } from "@/features/draft/hooks/use-load-draft-data";
import { getApiErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { DIALOG_KEY, useDialog } from "@/stores/dialog";
import { Plus, Save, User2 } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTransactionCartCheckout } from "../../hooks/use-transaction-cart";
import { useTransactionStore } from "../../stores";
import { CheckoutDialog, PickCustomerDialog } from "../dialogs";
import { DraftSelectDialog } from "./DraftSelectDialog";
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

  const { saveDraft, isSaving } = useSaveDraft();
  const { load: loadDraftData } = useLoadDraftData();
  const hasLoadedDraft = useTransactionStore((s) => s.loadedDraftId != null);

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
      }
    },
    [hasItems, loadDraftData],
  );

  const handleConfirmLoad = useCallback(() => {
    if (pendingDraft) {
      loadDraftData(pendingDraft);
      toast.success("Draft dimuat");
    }
    setIsConfirmOpen(false);
    setPendingDraft(null);
  }, [pendingDraft, loadDraftData]);

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

        <DraftSelectDialog onLoadDraft={handleLoadDraft} />

        <Card>
          <CardContent className="flex h-full flex-col space-y-3 text-sm">
            <TransactionCartSummary
              subtotalPrice={subtotalPrice}
              totalPrice={totalPrice}
            />

            <Button
              disabled={cartItems.length === 0 || isSaving || hasLoadedDraft}
              className="w-full"
              size="lg"
              variant="secondary"
              onClick={saveDraft}
            >
              <Save />
              Simpan draft
            </Button>
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
