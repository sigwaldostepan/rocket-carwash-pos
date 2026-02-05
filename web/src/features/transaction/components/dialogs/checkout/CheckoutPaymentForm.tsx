"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCheckoutPayment } from "@/features/transaction/hooks/use-checkout-payment";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/utils/currency";
import { ChangeDisplay } from "./ChangeDisplay";
import { NightShiftToggle } from "./NightShiftToggle";
import { PaymentCurrencyInput } from "./PaymentCurrencyInput";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { QuickAmountButtons } from "./QuickAmountButtons";

type CheckoutPaymentFormProps = {
  onClose: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
};

export const CheckoutPaymentForm = ({
  onClose,
  onSubmit,
  canSubmit,
  isSubmitting,
}: CheckoutPaymentFormProps) => {
  const { state, actions } = useCheckoutPayment();

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Proses Pembayaran</DialogTitle>
        <DialogDescription>
          Pilih metode pembayaran dan masukkan nominal
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        {/* Payment Method Selection */}
        <PaymentMethodSelector
          type="single"
          value={state.paymentMethod}
          onValueChange={actions.setPaymentMethod}
        />

        {/* Payment Details Card */}
        <Card
          className={cn(
            "transition-colors",
            state.isAmountSufficient && state.paidAmount > 0
              ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
              : "",
          )}
        >
          <CardContent className="space-y-4">
            {/* Total Display */}
            <div className="flex items-center justify-between">
              <CardDescription className="text-base">
                Total bayar
              </CardDescription>
              <CardTitle className="font-mono text-xl tracking-tight">
                {formatRupiah(state.totalPrice)}
              </CardTitle>
            </div>

            <Separator />

            {/* Amount Input */}
            <PaymentCurrencyInput
              id="paid-amount"
              label="Nominal diterima"
              value={state.paidAmount}
              onValueChange={actions.setPaidAmount}
            />

            {/* Quick Amount Buttons (Cash only) */}
            {state.isCashPayment && (
              <QuickAmountButtons
                amounts={state.smartQuickAmounts}
                selectedAmount={state.paidAmount}
                onSelect={actions.setPaidAmount}
              />
            )}

            {/* Change Display (Cash only) */}
            {state.isCashPayment && state.paidAmount > 0 && (
              <ChangeDisplay
                changeAmount={state.changeAmount}
                isAmountSufficient={state.isAmountSufficient}
              />
            )}

            {/* Compliment Input */}
            {state.isComplimentPayment && (
              <PaymentCurrencyInput
                id="compliment"
                label="Jumlah komplimen"
                value={state.complimentAmount}
                onValueChange={actions.setCompliment}
              />
            )}
          </CardContent>
        </Card>

        {/* Night Shift Toggle */}
        {!state.isComplimentPayment && (
          <NightShiftToggle
            checked={state.isNightShift ?? false}
            onCheckedChange={actions.setNightShift}
          />
        )}
      </div>
      <DialogFooter className="flex-row">
        <DialogClose asChild>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Kembali
          </Button>
        </DialogClose>
        <Button
          className="flex-1"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "Memproses..." : "Simpan"}
        </Button>
      </DialogFooter>
    </div>
  );
};
