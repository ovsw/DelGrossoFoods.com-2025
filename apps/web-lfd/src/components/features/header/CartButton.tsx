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
  size = "icon",
  surface = "onDark",
  ariaLabel,
  ...props
}: CartButtonProps & { ariaLabel?: string }): JSX.Element {
  const foxyConfig = React.useMemo(
    () => resolveFoxyConfig(process.env.NEXT_PUBLIC_FOXY_DOMAIN),
    [],
  );

  const href = foxyConfig
    ? `https://${foxyConfig.cartDomain}/cart?cart=view`
    : undefined;

  const buttonThemeClasses = cn(
    "border border-brand-yellow bg-transparent text-brand-yellow hover:bg-brand-yellow/10 focus-visible:border-brand-yellow focus-visible:ring-brand-yellow/40",
  );

  if (href) {
    return (
      <Button
        asChild
        variant={variant}
        size={size}
        surface={surface}
        className={cn(
          "relative group cursor-pointer",
          buttonThemeClasses,
          className,
        )}
      >
        <a
          href={href}
          aria-labelledby="header-cart-quantity-label"
          aria-label={ariaLabel}
        >
          <span
            className={cn(
              "relative flex h-5 w-5 items-center justify-center",
              "transition-transform duration-200 ease-out motion-reduce:transition-none",
              "lg:group-hover:-translate-y-0.5 lg:group-hover:scale-110",
            )}
            aria-hidden="true"
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
          </span>
          {/* Visual badge for quantity (updated externally via data attribute) */}
          <span
            className={cn(
              "absolute -top-1 -right-1 inline-flex min-h-5 min-w-5 items-center justify-center",
              "rounded-full bg-brand-yellow px-1 text-[10px] font-semibold leading-none text-brand-green",
              "transition-transform duration-200 ease-out motion-reduce:transition-none",
              "lg:group-hover:-translate-y-0.5 lg:group-hover:translate-x-0.5 lg:group-hover:scale-105",
            )}
            aria-hidden="true"
          >
            <span data-fc-id="minicart-quantity">0</span>
          </span>
          {/* Accessible name with live-updating quantity */}
          <span
            id="header-cart-quantity-label"
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            Cart, <span data-fc-id="minicart-quantity">0</span> items
          </span>
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
        "relative group cursor-pointer",
        buttonThemeClasses,
        className,
      )}
      aria-label={ariaLabel ?? "Open cart"}
      onClick={() =>
        console.error(
          "Foxycart: NEXT_PUBLIC_FOXY_DOMAIN is missing or invalid; cannot open cart.",
        )
      }
      {...props}
    >
      <span
        className={cn(
          "relative flex h-5 w-5 items-center justify-center",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          "lg:group-hover:-translate-y-0.5 lg:group-hover:scale-110",
        )}
        aria-hidden="true"
      >
        <ShoppingCart className="size-5" aria-hidden="true" />
      </span>
      {/* Visual badge for quantity (updated externally via data attribute) */}
      <span
        className={cn(
          "absolute -top-1 -right-1 inline-flex min-h-5 min-w-5 items-center justify-center",
          "rounded-full bg-brand-yellow px-1 text-[10px] font-semibold leading-none text-brand-green",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          "lg:group-hover:-translate-y-0.5 lg:group-hover:translate-x-0.5 lg:group-hover:scale-105",
        )}
        aria-hidden="true"
      >
        <span data-fc-id="minicart-quantity">0</span>
      </span>
      {/* Accessible name with live-updating quantity */}
      <span
        id="header-cart-quantity-label"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        Cart, <span data-fc-id="minicart-quantity">0</span> items
      </span>
    </Button>
  );
}
