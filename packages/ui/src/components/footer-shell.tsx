import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

import type { RootProps } from "../lib/data-attributes";

const BACKGROUND_CLASSES = {
  brand: "bg-brand-green text-brand-green-text",
  surface: "bg-background text-foreground",
  muted: "bg-th-light-100 text-th-dark-900",
  transparent: "bg-transparent text-inherit",
} as const;

const COLOR_THEME = {
  brand: {
    heading: "text-brand-yellow",
    description: "text-brand-green-text/80",
    link: "text-brand-green-text",
    linkHover: "hover:text-brand-yellow",
    legalBorder: "border-brand-yellow/40",
    legalText: "text-brand-green-text/80",
  },
  surface: {
    heading: "text-th-dark-900",
    description: "text-th-dark-700/80",
    link: "text-th-dark-900",
    linkHover: "hover:text-th-dark-900/80",
    legalBorder: "border-border",
    legalText: "text-muted-foreground",
  },
  muted: {
    heading: "text-th-dark-900",
    description: "text-th-dark-700/80",
    link: "text-th-dark-800",
    linkHover: "hover:text-th-dark-900",
    legalBorder: "border-border",
    legalText: "text-th-dark-700/80",
  },
  transparent: {
    heading: "text-th-dark-900",
    description: "text-th-dark-700/80",
    link: "text-th-dark-900",
    linkHover: "hover:text-th-dark-900/80",
    legalBorder: "border-border",
    legalText: "text-muted-foreground",
  },
} as const;

const MAX_WIDTH_CLASSES = {
  default: "mx-auto w-full max-w-7xl",
  wide: "mx-auto w-full max-w-[92rem]",
} as const;

const PADDING_CLASSES = {
  default: "px-4 sm:px-6 lg:px-8",
  relaxed: "px-6 sm:px-8 lg:px-10",
} as const;

export interface FooterNavItem {
  readonly id?: string;
  readonly content: ReactNode;
  readonly itemProps?: RootProps<HTMLLIElement>;
}

export interface FooterNavColumn {
  readonly id?: string;
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly items?: FooterNavItem[];
  readonly rootProps?: RootProps<HTMLDivElement>;
}

export interface FooterLegalItem {
  readonly id?: string;
  readonly content: ReactNode;
  readonly itemProps?: RootProps<HTMLLIElement>;
}

export interface FooterShellProps {
  readonly brandBlock: ReactNode;
  readonly contactBlock?: ReactNode;
  readonly socialBlock?: ReactNode;
  readonly ctaSlot?: ReactNode;
  readonly navColumns?: FooterNavColumn[];
  readonly legalText?: ReactNode;
  readonly legalItems?: FooterLegalItem[];
  readonly background?: keyof typeof BACKGROUND_CLASSES;
  readonly maxWidth?: keyof typeof MAX_WIDTH_CLASSES;
  readonly padding?: keyof typeof PADDING_CLASSES;
  readonly rootProps?: RootProps<HTMLElement>;
  readonly className?: string;
}

/**
 * FooterShell standardizes the footer grid, spacing, and brand tokens.
 * Content blocks remain app-specific while this component keeps Presentation
 * metadata plumbed through via `rootProps`.
 */
export function FooterShell({
  brandBlock,
  contactBlock,
  socialBlock,
  ctaSlot,
  navColumns,
  legalText,
  legalItems,
  background = "brand",
  maxWidth = "default",
  padding = "default",
  rootProps,
  className,
}: FooterShellProps) {
  const resolvedRootProps = rootProps ?? {};
  const { className: rootClassName, ...restRootProps } = resolvedRootProps;

  const containerClasses = cn(
    MAX_WIDTH_CLASSES[maxWidth],
    PADDING_CLASSES[padding],
    "py-12 lg:py-16",
  );
  const colorTheme = COLOR_THEME[background];

  return (
    <footer
      {...restRootProps}
      className={cn(
        "FooterShell w-full",
        BACKGROUND_CLASSES[background],
        className,
        rootClassName,
      )}
    >
      <div className={cn(containerClasses, "space-y-12")}>
        <div className="flex flex-col gap-8 text-center lg:text-left">
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
            <div className="lg:col-span-4">{brandBlock}</div>
            {contactBlock ? (
              <div className="lg:col-span-4">{contactBlock}</div>
            ) : null}
            {socialBlock ? (
              <div className="lg:col-span-4">{socialBlock}</div>
            ) : null}
          </div>

          {ctaSlot ? (
            <div className="flex flex-col items-center gap-4 lg:flex lg:items-start">
              {ctaSlot}
            </div>
          ) : null}
        </div>

        {navColumns?.length ? (
          <div className="grid grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {navColumns.map((column, columnIndex) => {
              const {
                id,
                title,
                description,
                items,
                rootProps: columnRootProps,
              } = column;
              const { className: columnClassName, ...restColumnProps } =
                columnRootProps ?? {};

              return (
                <div
                  key={id ?? `footer-column-${columnIndex}`}
                  {...restColumnProps}
                  className={cn("space-y-4", columnClassName)}
                >
                  {title ? (
                    <p
                      className={cn(
                        "text-lg font-semibold",
                        colorTheme.heading,
                      )}
                    >
                      {title}
                    </p>
                  ) : null}
                  {description ? (
                    <p className={cn("text-sm", colorTheme.description)}>
                      {description}
                    </p>
                  ) : null}
                  {items?.length ? (
                    <ul className="space-y-3 text-sm">
                      {items.map((item, itemIndex) => {
                        const {
                          id: itemId,
                          content,
                          itemProps: navItemProps,
                        } = item;
                        const {
                          className: navItemClassName,
                          ...restNavItemProps
                        } = navItemProps ?? {};
                        return (
                          <li
                            key={
                              itemId ??
                              `footer-column-${columnIndex}-item-${itemIndex}`
                            }
                            {...restNavItemProps}
                            className={cn(
                              "font-medium transition-colors",
                              colorTheme.link,
                              colorTheme.linkHover,
                              navItemClassName,
                            )}
                          >
                            {content}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {(legalText || legalItems?.length) && (
          <div className={cn("border-t pt-6", colorTheme.legalBorder)}>
            <div
              className={cn(
                "flex flex-col gap-4 text-center text-sm lg:flex-row lg:items-center lg:justify-between",
                colorTheme.legalText,
              )}
            >
              {legalText ? <div>{legalText}</div> : null}
              {legalItems?.length ? (
                <ul className="flex flex-wrap justify-center gap-4 lg:justify-end">
                  {legalItems.map((item, legalIndex) => {
                    const { id, content, itemProps: legalItemProps } = item;
                    const {
                      className: legalItemClassName,
                      ...restLegalItemProps
                    } = legalItemProps ?? {};
                    return (
                      <li
                        key={id ?? `footer-legal-item-${legalIndex}`}
                        {...restLegalItemProps}
                        className={cn(
                          "font-medium transition-colors",
                          colorTheme.link,
                          colorTheme.linkHover,
                          legalItemClassName,
                        )}
                      >
                        {content}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
