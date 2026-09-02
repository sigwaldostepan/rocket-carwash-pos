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

type DeleteDraftAlertProps = {
  onConfirm: () => void;
};

export const DeleteDraftAlert = ({ onConfirm }: DeleteDraftAlertProps) => {
  const { isOpen, key, setIsOpen } = useDialog();

  if (!isOpen || key !== DIALOG_KEY.draft.delete) {
    return null;
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => setIsOpen(DIALOG_KEY.draft.delete, false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kamu yakin ingin menghapus draft ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Setelah dihapus, draft tidak bisa di-restore kembali.
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