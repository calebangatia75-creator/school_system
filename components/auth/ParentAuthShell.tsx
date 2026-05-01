"use client";

import Link from "next/link";
import { BackgroundSlideshow } from "@/components/ui/background-slideshow";

type ParentAuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerLinkHref: string;
  footerLinkLabel: string;
};

export function ParentAuthShell({
  title,
  subtitle,
  children,
  footerLinkHref,
  footerLinkLabel
}: ParentAuthShellProps) {
  const backgroundImages = ["/photos/campus-1.jpg", "/photos/2.jpeg", "/photos/3.jpeg"];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div className="absolute inset-0 z-0">
        <BackgroundSlideshow
          images={backgroundImages}
          alt="Shekinah School background"
          priority
          imageClassName="scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(4,18,38,0.96),rgba(9,31,60,0.88),rgba(15,44,84,0.76))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.14),transparent_34%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg">
        <div className="overflow-hidden rounded-[2rem] border border-slate-500/15 bg-[rgba(6,20,44,0.96)] shadow-2xl shadow-slate-950/70 backdrop-blur-2xl">
          <div className="space-y-4 px-5 pb-0 pt-6 text-center sm:px-8 sm:pt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-400/15 bg-slate-200/10 text-2xl font-bold text-slate-100 shadow-lg sm:h-20 sm:w-20 sm:text-3xl">
              S
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">{subtitle}</p>
            </div>
          </div>

          <div className="space-y-6 px-5 pb-6 pt-6 sm:px-8 sm:pb-8">{children}</div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3 text-center">
          <Link
            href={footerLinkHref}
            className="text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            {footerLinkLabel}
          </Link>
          <Link href="/" className="text-sm text-slate-500 transition-colors hover:text-slate-300">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
