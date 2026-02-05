import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PAYMENT_METHODS, PaymentMethod } from "@/constants/transaction";
import React from "react";

type PaymentMethodSelectorProps = React.ComponentProps<typeof ToggleGroup> & {
  onValueChange: (value: PaymentMethod) => void;
};

export const PaymentMethodSelector = ({
  ...props
}: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Metode pembayaran</Label>
      <ScrollArea className="w-full pb-3" type="always">
        <ToggleGroup {...props}>
          {PAYMENT_METHODS.map((method) => (
            <ToggleGroupItem
              key={method.value}
              value={method.value}
              variant="secondary"
              className="cursor-pointer"
            >
              <method.icon />
              {method.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
