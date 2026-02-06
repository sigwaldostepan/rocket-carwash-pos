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

type DeleteExpenseAlertProps = {
  onConfirm: () => void;
};

export const DeleteExpenseAlert = ({ onConfirm }: DeleteExpenseAlertProps) => {
  const { isOpen, key, setIsOpen } = useDialog();

  if (!isOpen || key !== DIALOG_KEY.expense.delete) {
    return null;
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.expense.delete, false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kamu yakin ingin menghapus pengeluaran ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setelah dihapus, data pengeluaran tidak bisa di-restore kembali.
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
