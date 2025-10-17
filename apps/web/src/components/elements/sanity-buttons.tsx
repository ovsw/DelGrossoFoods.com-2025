import { Button, buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { ComponentProps, JSX, ReactNode } from "react";

import type { SanityButtonProps } from "@/types";

// Keep in sync with @workspace/ui/components/button.tsx variants
type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "link"
  | "ghost"
  | "accent"
  | "destructive";

// Base shape we accept from content regardless of Sanity source
type ContentButton = Omit<SanityButtonProps, "variant"> & { icon?: ReactNode };

type SanityButtonsProps = {
  buttons: ContentButton[] | null;
  className?: string;
  buttonClassName?: string;
  // Align with UI button size variant (no nulls)
  size?: "sm" | "lg" | "default" | "icon";
  buttonVariants?: (ButtonVariant | null | undefined)[];
};

function SanityButton({
  text,
  href,
  openInNewTab,
  className,
  icon,
  variant,
  ...props
}: ContentButton &
  ComponentProps<typeof Button> & { variant?: ButtonVariant }): JSX.Element {
  if (!href) {
    console.log("Link Broken", { text, href, openInNewTab });
    return <Button>Link Broken</Button>;
  }

  // Apply design system variant classes if variant is specified
  const variantClasses = variant ? buttonVariants({ variant }) : "";

  return (
    <Button
      {...props}
      asChild
      className={cn("rounded-[10px]", variantClasses, className)}
    >
      <Link
        href={href || "#"}
        target={openInNewTab ? "_blank" : "_self"}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        aria-label={text ? `Navigate to ${stegaClean(text)}` : undefined}
        title={text ? `Click to visit ${stegaClean(text)}` : undefined}
        className="flex items-center gap-2"
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

// Sensible defaults for button variants
const DEFAULT_BUTTON_VARIANTS: ButtonVariant[] = [
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
}: SanityButtonsProps): JSX.Element | null {
  if (!buttons?.length) return null;

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      {buttons.map((button, index) => {
        // Determine variant: use provided variant, or fallback to defaults, or default to "default"
        const variant =
          buttonVariants?.[index] ??
          DEFAULT_BUTTON_VARIANTS[index % DEFAULT_BUTTON_VARIANTS.length] ??
          "default";

        return (
          <SanityButton
            key={`button-${button._key}`}
            size={size}
            variant={variant}
            {...button}
            className={buttonClassName}
          />
        );
      })}
    </div>
  );
}
