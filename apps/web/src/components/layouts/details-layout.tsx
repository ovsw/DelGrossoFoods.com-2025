import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

export interface DetailsLayoutProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly spacingTop?: "none" | "small" | "default" | "large" | "page-top";
  readonly spacingBottom?: "none" | "small" | "default" | "large";
  readonly containerClassName?: string;
  readonly contentClassName?: string;
}

export function DetailsLayout({
  children,
  className,
  spacingTop = "default",
  spacingBottom = "large",
  containerClassName,
  contentClassName,
}: DetailsLayoutProps) {
  return (
    <Section
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      className={className}
    >
      <div
        className={cn(
          "container mx-auto px-4 md:px-6 lg:max-w-7xl xl:max-w-6xl 2xl:max-w-8xl",
          containerClassName,
        )}
      >
        <div className={contentClassName}>{children}</div>
      </div>
    </Section>
  );
}
