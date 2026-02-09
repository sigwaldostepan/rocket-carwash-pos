import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  valueClassName?: string;
};

export const StatCard = ({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
  valueClassName,
}: StatCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CardDescription className="text-sm font-medium">
            {label}
          </CardDescription>
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-full",
              iconClassName ?? "bg-primary/10 text-primary",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <div className="space-y-1">
          <p
            className={cn("text-2xl font-bold tracking-tight", valueClassName)}
          >
            {value}
          </p>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
