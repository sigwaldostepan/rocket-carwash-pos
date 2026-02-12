"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

type DatePickerRangeProps = Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect"
> & {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  triggerProps?: React.ComponentProps<typeof Button>;
  placeholder?: string;
};

export const DatePickerRange = ({
  date,
  setDate,
  triggerProps,
  placeholder = "Pilih tanggal",
  ...props
}: DatePickerRangeProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker-range"
          className={cn(
            "justify-start px-2.5 font-normal",
            triggerProps?.className,
          )}
          {...triggerProps}
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              <span className="hidden lg:block">
                {format(date.from, "LLL dd, y", { locale: id })} -{" "}
                {format(date.to, "LLL dd, y", { locale: id })}
              </span>
            ) : (
              format(date.from, "LLL dd, y", { locale: id })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          {...props}
          mode="range"
          defaultMonth={date?.from}
          numberOfMonths={2}
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
};
