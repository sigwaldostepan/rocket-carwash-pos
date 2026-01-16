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

type BatchDeleteCustomerAlertProps = {
  trigger: React.ReactNode;
  isLoading: boolean;
  onConfirm: () => void;
};

export const BatchDeleteCustomerAlert = ({
  trigger,
  isLoading,
  onConfirm,
}: BatchDeleteCustomerAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kamu yakin mau hapus customer-customer ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setelah dihapus, data customer-customer ini tidak bisa di-restore
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
