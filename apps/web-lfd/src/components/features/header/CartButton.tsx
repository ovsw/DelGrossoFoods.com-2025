"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { JSX } from "react";
import * as React from "react";

import { resolveFoxyConfig } from "@/lib/foxy/config";

type CartButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  surface?: "default" | "onDark";
};

export function CartButton({
  className,
  variant = "outline",
  size = "sm",
  surface = "onDark",
  ariaLabel,
  ...props
}: CartButtonProps & { ariaLabel?: string }): JSX.Element {
  const foxyConfig = React.useMemo(
    () => resolveFoxyConfig(process.env.NEXT_PUBLIC_FOXY_STORE_URL),
    [],
  );
  const quantityLabelId = React.useId();

  const href = foxyConfig
    ? `https://${foxyConfig.cartDomain}/cart?cart=view`
    : undefined;

  const buttonThemeClasses = cn(
    "border border-brand-yellow bg-transparent text-brand-yellow hover:bg-brand-yellow/10 focus-visible:border-brand-yellow focus-visible:ring-brand-yellow/40",
  );

  const cartButtonContent = (
    <>
      <span
        className={cn(
          "relative flex h-5 w-5 shrink-0 items-center justify-center",
        )}
        aria-hidden="true"
      >
        <ShoppingCart className="size-5" aria-hidden="true" />
      </span>
      <span>Cart</span>
      {/* Visual badge for quantity (updated externally via data attribute) */}
      <span
        className={cn(
          "absolute -top-1.5 -right-1.5 inline-flex min-h-5 min-w-5 items-center justify-center",
          "rounded-full bg-brand-yellow px-1 text-xs font-semibold leading-none text-brand-green",
        )}
        aria-hidden="true"
      >
        <span data-fc-id="minicart-quantity">0</span>
      </span>
      {/* Accessible name with live-updating quantity */}
      <span
        id={quantityLabelId}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        Cart, <span data-fc-id="minicart-quantity">0</span> items
      </span>
    </>
  );

  if (href) {
    return (
      <Button
        asChild
        variant={variant}
        size={size}
        surface={surface}
        className={cn(
          "relative cursor-pointer transition-transform duration-200 ease-out motion-reduce:transition-none lg:hover:scale-[1.03]",
          buttonThemeClasses,
          className,
        )}
      >
        <a
          href={href}
          aria-labelledby={ariaLabel ? undefined : quantityLabelId}
          aria-label={ariaLabel}
        >
          {cartButtonContent}
        </a>
      </Button>
    );
  }

  // Fallback if env is missing or invalid: keep button, no navigation
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      surface={surface}
      className={cn(
        "relative cursor-pointer transition-transform duration-200 ease-out motion-reduce:transition-none lg:hover:scale-[1.03]",
        buttonThemeClasses,
        className,
      )}
      aria-labelledby={ariaLabel ? undefined : quantityLabelId}
      aria-label={ariaLabel}
      onClick={() =>
        console.error(
          "Foxycart: NEXT_PUBLIC_FOXY_STORE_URL is missing or invalid; cannot open cart.",
        )
      }
      {...props}
    >
      {cartButtonContent}
    </Button>
  );
}
