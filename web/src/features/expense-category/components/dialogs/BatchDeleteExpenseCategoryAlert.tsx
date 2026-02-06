import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import React from "react";

type BatchDeleteExpenseCategoryAlertProps = {
  trigger: React.ReactNode;
  isLoading: boolean;
  onConfirm: () => void;
};

export const BatchDeleteExpenseCategoryAlert = ({
  trigger,
  isLoading,
  onConfirm,
}: BatchDeleteExpenseCategoryAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kamu yakin mau hapus kategori-kategori ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setelah dihapus, data kategori-kategori ini tidak bisa di-restore
            kembali.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Nggak jadi</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={onConfirm}>
            {isLoading && <Spinner />}
            Yakin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
