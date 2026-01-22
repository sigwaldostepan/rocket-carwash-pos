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
import { useDialog, useDialogActions } from "@/stores/dialog";
import { useDeleteItem } from "../../api/delete-item";

type DeleteItemAlertProps = {
  onConfirm: () => void;
};

export const DeleteItemAlert = ({ onConfirm }: DeleteItemAlertProps) => {
  const { data, isOpen, mode } = useDialog();

  const { closeDialog } = useDialogActions();

  if (!isOpen || mode !== "delete") {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={closeDialog}>
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
