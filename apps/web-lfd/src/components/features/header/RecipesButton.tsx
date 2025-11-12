"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import type { JSX } from "react";

type RecipesButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  href?: string;
  className?: string;
  surface?: "default" | "onDark";
};

export function RecipesButton({
  variant = "outline",
  size = "sm",
  href = "/recipes",
  className,
  surface = "onDark",
  children,
  ...props
}: RecipesButtonProps): JSX.Element {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      surface={surface}
      className={cn(
        "border border-brand-red bg-brand-red text-brand-red-text font-semibold hover:bg-brand-red/90 focus-visible:border-brand-red focus-visible:ring-brand-red/40",
        className,
      )}
    >
      <Link href={href} aria-label="Browse recipes" {...props}>
        {children ?? "Recipes"}
      </Link>
    </Button>
  );
}
