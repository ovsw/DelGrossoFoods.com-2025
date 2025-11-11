import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { ComponentProps, JSX, ReactNode } from "react";

import { type RootProps } from "../lib/data-attributes";
import { cn } from "../lib/utils";
import { Button } from "./button";

type ButtonProps = ComponentProps<typeof Button>;
type ButtonVariant = ButtonProps["variant"];
type ButtonSize = ButtonProps["size"];
type ButtonSurface = ButtonProps["surface"];
type NonNullButtonVariant = Exclude<ButtonVariant, null | undefined>;

export type SanityButtonContent = {
  _key?: string | null;
  text?: string | null;
  href?: string | null;
  openInNewTab?: boolean | null;
  icon?: ReactNode;
};

export type SanityButtonsProps = {
  buttons: SanityButtonContent[] | null | undefined;
  className?: string;
  buttonClassName?: string;
  size?: ButtonSize;
  buttonVariants?: (ButtonVariant | null | undefined)[];
  surface?: ButtonSurface;
  rootProps?: RootProps<HTMLDivElement>;
  buttonRootProps?: (RootProps<HTMLAnchorElement> | undefined)[];
};

type SanityButtonProps = SanityButtonContent &
  Omit<ButtonProps, "variant" | "surface"> & {
    variant?: ButtonVariant;
    surface?: ButtonSurface;
    linkProps?: RootProps<HTMLAnchorElement>;
  };

function SanityButton({
  text,
  href,
  openInNewTab,
  className,
  icon,
  variant,
  surface,
  linkProps,
  ...props
}: SanityButtonProps): JSX.Element {
  if (!href) {
    console.log("Link Broken", { text, href, openInNewTab });
    return <Button>Link Broken</Button>;
  }

  const { className: linkClassName, ...restLinkProps } = linkProps ?? {};

  return (
    <Button
      {...props}
      asChild
      variant={variant}
      surface={surface}
      className={cn("rounded-[10px]", className)}
    >
      <Link
        href={href || "#"}
        target={openInNewTab ? "_blank" : "_self"}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        aria-label={text ? `Navigate to ${stegaClean(text)}` : undefined}
        title={text ? `Click to visit ${stegaClean(text)}` : undefined}
        className={cn("flex items-center gap-2", linkClassName)}
        {...restLinkProps}
      >
        {icon ? (
          <span aria-hidden className="flex items-center">
            {icon}
          </span>
        ) : null}
        <span>{text}</span>
      </Link>
    </Button>
  );
}

const DEFAULT_BUTTON_VARIANTS: NonNullButtonVariant[] = [
  "default",
  "outline",
  "secondary",
];

export function SanityButtons({
  buttons,
  className,
  buttonClassName,
  size = "default",
  buttonVariants,
  surface,
  rootProps,
  buttonRootProps,
}: SanityButtonsProps): JSX.Element | null {
  if (!buttons?.length) return null;
  const { className: rootClassName, ...restRootProps } = rootProps ?? {};

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4",
        className,
        rootClassName,
      )}
      {...restRootProps}
    >
      {buttons.map((button, index) => {
        const fallbackVariant: NonNullButtonVariant =
          DEFAULT_BUTTON_VARIANTS[index % DEFAULT_BUTTON_VARIANTS.length] ??
          "default";
        const providedVariant = buttonVariants?.[index];
        const variant =
          providedVariant == null ? fallbackVariant : providedVariant;
        const linkProps = buttonRootProps?.[index];

        return (
          <SanityButton
            key={`button-${button._key ?? index}`}
            {...button}
            size={size}
            variant={variant}
            surface={surface}
            className={buttonClassName}
            linkProps={linkProps}
          />
        );
      })}
    </div>
  );
}
