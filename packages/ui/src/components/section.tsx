import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";

export type SectionSpacingToken = "none" | "small" | "default" | "large";
export type SectionSpacingTopToken = SectionSpacingToken | "page-top";

const SECTION_TOP_SPACING_CLASS = {
  none: "pt-section-none",
  small: "pt-section-small",
  default: "pt-section-default",
  large: "pt-section-large",
  "page-top": "pt-section-page-top",
} as const satisfies Record<SectionSpacingTopToken, string>;

const SECTION_BOTTOM_SPACING_CLASS = {
  none: "pb-section-none",
  small: "pb-section-small",
  default: "pb-section-default",
  large: "pb-section-large",
} as const satisfies Record<SectionSpacingToken, string>;

export interface SectionProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  readonly children: React.ReactNode;
  readonly spacingTop?: SectionSpacingTopToken;
  readonly spacingBottom?: SectionSpacingToken;
  readonly isPageTop?: boolean;
}

/**
 * Normalizes top/bottom padding for page sections so the design system
 * controls seams between contrasting backgrounds without relying on margins.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      children,
      className,
      spacingTop = "default",
      spacingBottom = "default",
      isPageTop = false,
      ...props
    },
    ref,
  ) => {
    const effectiveTopSpacing: SectionSpacingTopToken = isPageTop
      ? "page-top"
      : spacingTop;

    const spacingClasses = cn(
      "mx-auto w-full max-w-7xl",
      SECTION_TOP_SPACING_CLASS[effectiveTopSpacing],
      SECTION_BOTTOM_SPACING_CLASS[spacingBottom],
      className,
    );

    return (
      <section ref={ref} className={spacingClasses} {...props}>
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";
