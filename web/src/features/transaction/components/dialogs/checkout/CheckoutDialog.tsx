"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCheckoutPayment } from "@/features/transaction/hooks/use-checkout-payment";
import { useResetTransaction } from "@/features/transaction/stores";
import { Transaction } from "@/types/api/transaction";
import React, { useState } from "react";
import { CheckoutPaymentForm } from "./CheckoutPaymentForm";
import { CheckoutSuccess } from "./CheckoutSuccess";

type CheckoutDialogProps = React.ComponentProps<typeof Dialog> & {
  isSubmitting: boolean;
  onConfirm: () => Promise<Transaction>;
  sheetOnOpenChange?: (open: boolean) => void;
};

export const CheckoutDialog = ({
  isSubmitting,
  onConfirm,
  onOpenChange,
  sheetOnOpenChange,
  ...props
}: CheckoutDialogProps) => {
  // Track transaction state
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const { state, actions } = useCheckoutPayment();
  const { canSubmit, changeAmount } = state;
  const { resetPaymentStates } = actions;
  const { resetTransaction } = useResetTransaction();

  const [step, setStep] = useState<"payment" | "success">("payment");

  // handlers
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      if (step === "success") {
        handleCheckoutSuccessClose();
      } else {
        handleCheckoutFormClose();
      }
    }

    onOpenChange?.(open);
  };

  const handleConfirm = async () => {
    const result = await onConfirm();
    setTransaction(result);
    setStep("success");
  };

  const handleCheckoutFormClose = () => {
    resetPaymentStates();
    setStep("payment");
    onOpenChange?.(false);
  };

  const handleCheckoutSuccessClose = () => {
    resetTransaction();
    setTransaction(null);
    setStep("payment");
    onOpenChange?.(false);
    sheetOnOpenChange?.(false);
  };

  return (
    <>
      <Dialog {...props} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="flex max-h-[80vh] max-w-md flex-col gap-y-6 overflow-y-auto">
          {step === "payment" && (
            <CheckoutPaymentForm
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
              onClose={handleCheckoutFormClose}
              onSubmit={handleConfirm}
            />
          )}

          {step === "success" && (
            <CheckoutSuccess
              data={transaction}
              changeAmount={changeAmount}
              onClose={handleCheckoutSuccessClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
