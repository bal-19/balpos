import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "../lib/cn.js";

export interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  return (
    <div className={cn("rounded-lg border border-black/10 bg-white p-2", className)}>
      <DayPicker mode="range" selected={value} onSelect={onChange} numberOfMonths={2} />
    </div>
  );
}

export type { DateRange };
