import { cn } from "@workspace/ui/lib/utils";

import type { RootProps } from "../lib/data-attributes";
import { Section, type SectionProps } from "./section";

const BACKGROUND_CLASSES = {
  transparent: "bg-transparent text-inherit",
  surface: "bg-background text-foreground",
  muted: "bg-th-light-100 text-th-dark-900",
  brand: "bg-brand-green text-brand-green-text",
  "brand-contrast": "bg-brand-yellow text-th-dark-900",
} as const;

const DIVIDER_CLASSES = {
  none: "",
  top: "border-t border-border",
  bottom: "border-b border-border",
  both: "border-y border-border",
} as const;

const CONTAINER_WIDTH_CLASSES = {
  default: "mx-auto w-full max-w-7xl",
  wide: "mx-auto w-full max-w-[92rem]",
  content: "mx-auto w-full max-w-3xl",
  full: "w-full",
} as const;

const INNER_PADDING_CLASSES = {
  default: "px-4 sm:px-6 lg:px-8",
  none: "",
} as const;

export type SectionShellBackground = keyof typeof BACKGROUND_CLASSES;
export type SectionShellDivider = keyof typeof DIVIDER_CLASSES;
export type SectionShellContainerWidth = keyof typeof CONTAINER_WIDTH_CLASSES;
export type SectionShellInnerPadding = keyof typeof INNER_PADDING_CLASSES;

export interface SectionShellProps extends SectionProps {
  readonly background?: SectionShellBackground;
  readonly divider?: SectionShellDivider;
  readonly containerWidth?: SectionShellContainerWidth;
  readonly innerPadding?: SectionShellInnerPadding;
  readonly innerProps?: RootProps<HTMLDivElement>;
  readonly innerClassName?: string;
  readonly allowOverflow?: boolean;
  readonly rootProps?: RootProps<HTMLElement>;
}

/**
 * SectionShell extends the base Section spacing helper with
 * background management, inner containers, and divider seams so
 * every page section feels consistent across brands.
 */
export function SectionShell({
  children,
  background = "surface",
  divider = "none",
  containerWidth = "default",
  innerPadding = "default",
  innerProps,
  innerClassName,
  allowOverflow = false,
  fullBleed = true,
  className,
  rootProps,
  ...props
}: SectionShellProps) {
  const resolvedRootProps = rootProps ?? {};
  const { className: rootClassName, ...restRootProps } = resolvedRootProps;
  const resolvedInnerProps = innerProps ?? {};
  const { className: innerClassNameFromProps, ...restInnerProps } =
    resolvedInnerProps;

  return (
    <Section
      {...props}
      {...restRootProps}
      fullBleed={fullBleed}
      className={cn(
        "SectionShell relative",
        BACKGROUND_CLASSES[background],
        allowOverflow ? "" : "overflow-hidden",
        className,
        rootClassName,
      )}
    >
      <div
        {...restInnerProps}
        className={cn(
          CONTAINER_WIDTH_CLASSES[containerWidth],
          DIVIDER_CLASSES[divider],
          INNER_PADDING_CLASSES[innerPadding],
          innerClassNameFromProps,
          innerClassName,
        )}
      >
        {children}
      </div>
    </Section>
  );
}
