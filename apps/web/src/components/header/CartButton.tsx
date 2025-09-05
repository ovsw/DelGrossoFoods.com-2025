"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { JSX } from "react";
import * as React from "react";

type CartButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
};

export function CartButton({
  className,
  variant = "accent",
  size = "icon",
  ariaLabel,
  ...props
}: CartButtonProps & { ariaLabel?: string }): JSX.Element {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("relative group cursor-pointer", className)}
      aria-label={ariaLabel ?? "Open cart"}
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
          "rounded-full bg-amber-700 px-1 text-[10px] font-semibold leading-none text-white",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          "lg:group-hover:-translate-y-0.5 lg:group-hover:translate-x-0.5 lg:group-hover:scale-105",
        )}
        aria-hidden="true"
      >
        <span data-fc-id="minicart-quantity">0</span>
      </span>
      {/* Accessible name with live-updating quantity */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Cart, <span data-fc-id="minicart-quantity">0</span> items
      </span>
    </Button>
  );
}
