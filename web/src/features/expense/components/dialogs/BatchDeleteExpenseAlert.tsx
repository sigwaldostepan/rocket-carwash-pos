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

type BatchDeleteExpenseAlertProps = {
  trigger: React.ReactNode;
  isLoading: boolean;
  onConfirm: () => void;
};

export const BatchDeleteExpenseAlert = ({
  trigger,
  isLoading,
  onConfirm,
}: BatchDeleteExpenseAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kamu yakin mau hapus pengeluaran-pengeluaran ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setelah dihapus, data pengeluaran-pengeluaran ini tidak bisa
            di-restore kembali.
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
