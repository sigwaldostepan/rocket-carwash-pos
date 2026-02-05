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
import { DIALOG_KEY, useDialog } from "@/stores/dialog";

type DeleteTransactionAlertProps = {
  onConfirm: () => void;
};

export const DeleteTransactionAlert = ({
  onConfirm,
}: DeleteTransactionAlertProps) => {
  const { isOpen, key, setIsOpen } = useDialog();

  if (!isOpen || key !== DIALOG_KEY.transaction.delete) {
    return null;
  }

  console.log({ isOpen });

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.transaction.delete, false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kamu yakin ingin menghapus transaksi ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setelah dihapus, data transaksi tidak bisa di-restore kembali.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Nggak jadi</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Yakin</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
