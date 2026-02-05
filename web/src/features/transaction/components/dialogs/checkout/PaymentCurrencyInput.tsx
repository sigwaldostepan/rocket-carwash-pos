import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { formatThousand } from "@/utils/currency";

type PaymentCurrencyInputProps = React.ComponentProps<
  typeof InputGroupInput
> & {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
};

export const PaymentCurrencyInput = ({
  id,
  label,
  value,
  onValueChange: onChange,
}: PaymentCurrencyInputProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-sm" htmlFor={id}>
        {label}
      </Label>
      <InputGroup className="text-lg">
        <InputGroupAddon>
          <InputGroupText className="font-semibold">Rp</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          placeholder="0"
          type="text"
          className="text-lg font-semibold"
          value={value > 0 ? formatThousand(value) : ""}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, "");
            onChange(Number(numericValue));
          }}
        />
      </InputGroup>
    </div>
  );
};
