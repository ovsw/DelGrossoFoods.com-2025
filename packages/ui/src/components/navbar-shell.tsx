"use client";

import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import type { RootProps } from "../lib/data-attributes";

const BACKGROUND_CLASSES = {
  surface: "bg-background text-foreground",
  brand: "bg-brand-green text-brand-green-text",
  muted: "bg-th-light-100 text-th-dark-900",
  transparent: "bg-transparent text-inherit",
} as const;

const BORDER_CLASSES = {
  none: "",
  subtle: "border-b border-border",
} as const;

const MAX_WIDTH_CLASSES = {
  default: "mx-auto w-full max-w-7xl",
  wide: "mx-auto w-full max-w-[92rem]",
  full: "w-full",
} as const;

const PADDING_CLASSES = {
  default: "px-4 sm:px-6 lg:px-8",
  compact: "px-4",
} as const;

export interface NavbarShellProps {
  readonly brandSlot: ReactNode;
  readonly desktopNavigationSlot?: ReactNode;
  readonly desktopActionsSlot?: ReactNode;
  readonly mobileMenuSlot?: ReactNode;
  readonly announcementSlot?: ReactNode;
  readonly utilitySlot?: ReactNode;
  readonly background?: keyof typeof BACKGROUND_CLASSES;
  readonly border?: keyof typeof BORDER_CLASSES;
  readonly maxWidth?: keyof typeof MAX_WIDTH_CLASSES;
  readonly padding?: keyof typeof PADDING_CLASSES;
  readonly sticky?: boolean;
  readonly syncOffsetVar?: string;
  readonly skipLinkHref?: string;
  readonly skipLinkLabel?: string;
  readonly rootProps?: RootProps<HTMLElement>;
  readonly className?: string;
}

/**
 * NavbarShell centralizes the layout, spacing, and token usage for the global header
 * so apps can focus on data + interactions while keeping Presentation metadata
 * attached via `rootProps`.
 */
export function NavbarShell({
  brandSlot,
  desktopNavigationSlot,
  desktopActionsSlot,
  mobileMenuSlot,
  announcementSlot,
  utilitySlot,
  background = "surface",
  border = "subtle",
  maxWidth = "default",
  padding = "default",
  sticky = true,
  syncOffsetVar = "--header-offset",
  skipLinkHref,
  skipLinkLabel = "Skip to main content",
  rootProps,
  className,
}: NavbarShellProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const resolvedRootProps = rootProps ?? {};
  const {
    className: rootClassName,
    style: rootStyle,
    ...restRootProps
  } = resolvedRootProps;

  useEffect(() => {
    if (!sticky || !syncOffsetVar) return;
    const node = headerRef.current;
    if (!node || typeof window === "undefined") return;

    const setOffset = () => {
      const height = node.offsetHeight;
      document.documentElement.style.setProperty(syncOffsetVar, `${height}px`);
    };

    setOffset();
    window.addEventListener("resize", setOffset);
    return () => {
      window.removeEventListener("resize", setOffset);
    };
  }, [sticky, syncOffsetVar]);

  const headerClasses = cn(
    "NavbarShell w-full",
    sticky ? "sticky top-0 z-50" : "",
    BACKGROUND_CLASSES[background],
    BORDER_CLASSES[border],
    rootClassName,
    className,
  );

  const containerClasses = cn(
    MAX_WIDTH_CLASSES[maxWidth],
    PADDING_CLASSES[padding],
  );

  return (
    <header
      ref={headerRef}
      {...restRootProps}
      className={headerClasses}
      style={{
        ...(sticky ? { boxShadow: "var(--shadow-nav)" } : null),
        ...rootStyle,
      }}
    >
      {skipLinkHref ? (
        <a
          href={skipLinkHref}
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {skipLinkLabel}
        </a>
      ) : null}

      {announcementSlot ? (
        <div className={cn(containerClasses, "py-2 text-sm")}>
          {announcementSlot}
        </div>
      ) : null}

      <div className={cn(containerClasses, "flex min-h-20 items-center gap-4")}>
        <div className="flex min-w-0 items-center gap-4">{brandSlot}</div>
        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          {desktopNavigationSlot}
        </div>
        <div className="hidden items-center justify-end gap-4 lg:flex">
          {desktopActionsSlot}
        </div>
        <div className="flex items-center justify-end gap-2 lg:hidden">
          {mobileMenuSlot ?? desktopActionsSlot}
        </div>
      </div>

      {utilitySlot ? (
        <div
          className={cn(
            containerClasses,
            "flex items-center justify-between gap-4 py-3 text-sm",
            sticky ? "border-t border-border/50" : "",
          )}
        >
          {utilitySlot}
        </div>
      ) : null}
    </header>
  );
}
