import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Moon } from "lucide-react";

type NightShiftToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const NightShiftToggle = ({
  checked,
  onCheckedChange,
}: NightShiftToggleProps) => (
  <div className="flex items-start gap-3 rounded-lg border p-3">
    <Checkbox
      id="night-shift"
      className="data-[state=checked]:bg-secondary! data-[state=checked]:text-secondary-foreground data-[state=checked]:border-secondary"
      checked={checked}
      onCheckedChange={(checked) => onCheckedChange(checked === true)}
    />
    <div className="flex flex-col space-y-2">
      <Label htmlFor="night-shift" className="flex items-center">
        <Moon className="size-4" />
        <span>Transaksi Shift Malam</span>
      </Label>
      <p className="text-muted-foreground text-xs">
        Komplimen sebesar 40% untuk karyawan shift malam
      </p>
    </div>
  </div>
);
