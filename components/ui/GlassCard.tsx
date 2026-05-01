import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  subtitle?: string;
};

export function GlassCard({
  children,
  className,
  title,
  subtitle,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/70 bg-white/75 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {title || subtitle ? (
        <div className="px-6 pb-2 pt-6">
          {title ? <h3 className="text-lg font-semibold text-navy">{title}</h3> : null}
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      ) : null}
      <div className="p-6">{children}</div>
    </div>
  );
}
