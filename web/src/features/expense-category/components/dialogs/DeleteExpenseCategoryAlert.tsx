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

type DeleteExpenseCategoryAlertProps = {
  onConfirm: () => void;
};

export const DeleteExpenseCategoryAlert = ({
  onConfirm,
}: DeleteExpenseCategoryAlertProps) => {
  const { isOpen, key, setIsOpen } = useDialog();

  if (!isOpen || key !== DIALOG_KEY.expenseCategory.delete) {
    return null;
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.expenseCategory.delete, false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kamu yakin ingin menghapus kategori ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setelah dihapus, data kategori tidak bisa di-restore kembali.
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
