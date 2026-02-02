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

type DeleteItemAlertProps = {
  onConfirm: () => void;
};

export const DeleteItemAlert = ({ onConfirm }: DeleteItemAlertProps) => {
  const { isOpen, key, closeDialog, setIsOpen } = useDialog();

  if (!isOpen || key !== DIALOG_KEY.item.delete) {
    return null;
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.item.delete, false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kamu yakin ingin menghapus item ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setelah dihapus, data item tidak bisa di-restore kembali.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Yakin</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
