import { useState } from "react";
import { endOfDay, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

export const useDateRangeFilter = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const dateFrom = dateRange?.from
    ? startOfDay(dateRange.from).toISOString()
    : undefined;

  const dateTo = dateRange?.to
    ? endOfDay(dateRange.to).toISOString()
    : undefined;

  return {
    dateRange,
    dateFrom,
    dateTo,
    setDateRange,
  };
};
