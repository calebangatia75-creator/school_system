import * as React from "react";
import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white/85 px-4 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple/40",
        className
      )}
      {...props}
    />
  );
});
