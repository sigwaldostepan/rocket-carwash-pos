import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "@/types/api/transaction";
import { Printer } from "lucide-react";

type PrintInvoiceDialogProps = React.ComponentProps<typeof Dialog> & {
  transaction: Transaction | null;
};

export const PrintInvoiceDialog = ({
  transaction,
  onOpenChange,
  ...props
}: PrintInvoiceDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Print Nota</DialogTitle>
          <DialogDescription>Preview nota sebelum mencetak</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange?.(false)}
          >
            Tutup
          </Button>
          <Button className="flex-1">
            <Printer className="size-4" />
            Cetak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
