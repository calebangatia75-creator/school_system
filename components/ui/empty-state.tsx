import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-purple/20 bg-white/70 p-6 text-center shadow-sm", className)}>
      <p className="text-lg font-semibold text-navy">{title}</p>
      <p className="mt-2 text-sm text-textBody">{description}</p>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-navy to-navy-light px-4 py-2 text-sm font-semibold text-white"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
