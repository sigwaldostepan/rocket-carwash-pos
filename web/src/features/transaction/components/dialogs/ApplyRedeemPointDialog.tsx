import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRedeemPointDialog } from "@/features/transaction/hooks/use-redeem-point-dialog";
import { Coins } from "lucide-react";

type ApplyRedeemPointDialogProps = React.ComponentProps<typeof Dialog>;

/**
 * Dialog for redeeming point
 * used in CreateTransactionPageInner
 * triggered from TransactionCartSidebarItem
 */
export const ApplyRedeemPointDialog = ({
  open,
  onOpenChange,
}: ApplyRedeemPointDialogProps) => {
  const { state, actions } = useRedeemPointDialog();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-y-6">
        <DialogHeader>
          <DialogTitle>Redeem point</DialogTitle>
          <DialogDescription>
            Item: {state.selectedItem?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* customer info card */}
          <Card>
            <CardContent className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-muted-foreground">Customer</p>
                <p className="font-semibold">{state.customer?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Sisa poin</p>
                <p className="font-mono text-2xl font-bold">
                  {state.availablePoint}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* redeem quantity controls */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              className="rounded-xl p-6 text-2xl shadow"
              onClick={() => actions.decrementRedeemedItem(state.itemId)}
              disabled={!state.canReduceRedeem}
            >
              -
            </Button>
            <p className="font-mono text-2xl font-bold">{state.usedPoint}</p>
            <Button
              variant="outline"
              className="rounded-xl p-6 text-2xl shadow"
              onClick={() => actions.incrementRedeemedItem(state.itemId)}
              disabled={!state.canIncreaseRedeem}
            >
              +
            </Button>
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="bg-accent text-accent-foreground flex items-center gap-2 rounded-2xl border px-4 py-1.5 text-base">
              <Coins />
              Poin terpakai: {state.usedPoint}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1"
              size="lg"
              onClick={() => actions.resetRedeemedItem(state.itemId)}
            >
              Batal
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => console.log("submit")}
              variant="secondary"
              className="flex-1"
              size="lg"
            >
              Terapkan
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
