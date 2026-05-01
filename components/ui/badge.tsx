import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "urgent";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";
  const variants = {
    default: "bg-light text-navy",
    success: "bg-success/10 text-success",
    warning: "bg-amber-100 text-amber-700",
    urgent: "bg-warning/10 text-warning"
  };

  return <span className={cn(base, variants[variant], className)} {...props} />;
}
