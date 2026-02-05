"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "@/types/api/transaction";
import { formatRupiah } from "@/utils/currency";
import { CheckCircle2, Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { InvoiceReceipt } from "./InvoiceReceipt";
import { useTransactionInvoice } from "@/features/transaction/hooks/use-transaction-invoice";

type CheckoutSuccessProps = {
  data: Transaction | null;
  changeAmount: number;
  onClose: () => void;
};

export const CheckoutSuccess = ({ data, onClose }: CheckoutSuccessProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    preserveAfterPrint: true,
  });

  const {
    customer,
    cartItems,
    discount,
    paymentMethod,
    changeAmount,
    paidAmount,
  } = useTransactionInvoice();

  return (
    <>
      <div className="space-y-6">
        <DialogHeader className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-2xl">Transaksi Berhasil!</DialogTitle>
          <CardDescription className="text-base">
            Invoice #{data?.invoiceNo}
          </CardDescription>
        </DialogHeader>

        <Card className="border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20">
          <CardHeader className="pb-2 text-center">
            <CardDescription>Kembalian</CardDescription>
            <CardTitle className="text-4xl font-bold text-green-700 dark:text-green-400">
              {formatRupiah(changeAmount)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-center text-sm">
            <p>Total Transaksi: {formatRupiah(Number(data?.total))}</p>
          </CardContent>
        </Card>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-1/2"
            onClick={onClose}
          >
            Selesai
          </Button>
          <Button className="w-full sm:w-1/2" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak Nota
          </Button>
        </DialogFooter>
      </div>

      {/* invoice */}
      <div className="hidden">
        <InvoiceReceipt
          ref={printRef}
          transaction={data!}
          items={cartItems}
          customerName={customer?.name!}
          paymentMethod={paymentMethod!}
          discount={discount!}
          paidAmount={paidAmount!}
          changeAmount={changeAmount}
        />
      </div>
    </>
  );
};
