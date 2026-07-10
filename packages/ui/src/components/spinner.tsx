import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
} as const;

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeClasses;
  label?: string;
  fullPage?: boolean;
}

export function Spinner({ size = "md", label, fullPage, className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-2",
        fullPage && "min-h-[50vh] w-full flex-col justify-center",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-primary/20 border-t-primary",
          sizeClasses[size],
        )}
      />
      {label ? (
        <span className={cn("text-sm text-black/40", fullPage && "text-center")}>{label}</span>
      ) : (
        <span className="sr-only">Memuat...</span>
      )}
    </div>
  );
}
