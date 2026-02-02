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

type DeleteCustomerAlertProps = {
  onConfirm: () => void;
};

export const DeleteCustomerAlert = ({
  onConfirm,
}: DeleteCustomerAlertProps) => {
  const { isOpen, key, setIsOpen } = useDialog();

  if (!isOpen || key !== DIALOG_KEY.customer.delete) {
    return null;
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.customer.delete, false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kamu yakin ingin menghapus customer ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setelah dihapus, data customer tidak bisa di-restore kembali.
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
