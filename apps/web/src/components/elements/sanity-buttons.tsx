import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { ComponentProps, JSX, ReactNode } from "react";

import type { SanityButtonProps } from "@/types";

type ButtonProps = ComponentProps<typeof Button>;
type ButtonVariant = ButtonProps["variant"];
type ButtonSize = ButtonProps["size"];
type ButtonSurface = ButtonProps["surface"];
type NonNullButtonVariant = Exclude<ButtonVariant, null | undefined>;

// Base shape we accept from content regardless of Sanity source
type ContentButton = Omit<SanityButtonProps, "variant"> & { icon?: ReactNode };

type SanityButtonsProps = {
  buttons: ContentButton[] | null;
  className?: string;
  buttonClassName?: string;
  // Align with UI button size variant (no nulls)
  size?: ButtonSize;
  buttonVariants?: (ButtonVariant | null | undefined)[];
  surface?: ButtonSurface;
};

function SanityButton({
  text,
  href,
  openInNewTab,
  className,
  icon,
  variant,
  surface,
  ...props
}: ContentButton &
  Omit<ButtonProps, "variant" | "surface"> & {
    variant?: ButtonVariant;
    surface?: ButtonSurface;
  }): JSX.Element {
  if (!href) {
    console.log("Link Broken", { text, href, openInNewTab });
    return <Button>Link Broken</Button>;
  }

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
}: SanityButtonsProps): JSX.Element | null {
  if (!buttons?.length) return null;

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      {buttons.map((button, index) => {
        // Determine variant: use provided variant, or fallback to defaults, or default to "default"
        const fallbackVariant: NonNullButtonVariant =
          DEFAULT_BUTTON_VARIANTS[index % DEFAULT_BUTTON_VARIANTS.length] ??
          "default";
        const providedVariant = buttonVariants?.[index];
        const variant =
          providedVariant == null ? fallbackVariant : providedVariant;

        return (
          <SanityButton
            key={`button-${button._key}`}
            {...button}
            size={size}
            variant={variant}
            surface={surface}
            className={buttonClassName}
          />
        );
      })}
    </div>
  );
}
