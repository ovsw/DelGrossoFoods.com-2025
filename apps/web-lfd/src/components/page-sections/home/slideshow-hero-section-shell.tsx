import {
  SectionShell,
  type SectionShellProps,
} from "@workspace/ui/components/section-shell";
import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

export interface SlideshowHeroSectionShellProps
  extends Omit<
    SectionShellProps,
    "spacingTop" | "spacingBottom" | "background" | "allowOverflow"
  > {
  readonly children: ReactNode;
}

export function SlideshowHeroSectionShell({
  children,
  className,
  innerClassName,
  ...props
}: SlideshowHeroSectionShellProps) {
  return (
    <SectionShell
      spacingTop="page-top"
      spacingBottom="large"
      background="transparent"
      allowOverflow
      fullBleed
      {...props}
      className={cn(
        "relative isolate w-full bg-[url('/images/bg/counter-wall-5-no-bottom-border-ultrawide-p-2600.jpg')] bg-cover bg-bottom",
        className,
      )}
      innerClassName={cn(
        "mx-auto flex w-full max-w-4xl transform flex-col items-center justify-center gap-8 px-4 py-8 sm:px-8 lg:min-h-[70svh] lg:px-16",
        innerClassName,
      )}
    >
      {children}
    </SectionShell>
  );
}
