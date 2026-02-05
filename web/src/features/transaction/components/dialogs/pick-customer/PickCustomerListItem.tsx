import { Badge } from "@/components/ui/badge";
import { CommandItem } from "@/components/ui/command";
import { Customer } from "@/types/api/customer";
import { Gift } from "lucide-react";

type PickCustomerListItemProps = {
  customer: Customer;
  onCustomerSelect: (customer: Customer) => void;
};

export const PickCustomerListItem = ({
  customer,
  onCustomerSelect,
}: PickCustomerListItemProps) => {
  return (
    <CommandItem
      key={customer.id}
      value={customer.id}
      onSelect={() => onCustomerSelect(customer)}
      className="border-border flex w-full items-center justify-between rounded-lg border p-4!"
    >
      <div className="space-y-2">
        <p className="font-semibold">{customer.name}</p>
        <p className="text-muted-foreground text-sm">{customer.phoneNumber}</p>
      </div>
      <Badge variant="outline" className="h-fit">
        <Gift className="stroke-foreground" />
        {customer.point}
      </Badge>
    </CommandItem>
  );
};
