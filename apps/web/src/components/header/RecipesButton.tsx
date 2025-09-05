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
};

export function RecipesButton({
  variant = "outline",
  size = "sm",
  href = "/recipes",
  className,
  children,
  ...props
}: RecipesButtonProps): JSX.Element {
  return (
    <Button asChild variant={variant} size={size} className={cn(className)}>
      <Link href={href} aria-label="Browse recipes" {...props}>
        {children ?? "Recipes"}
      </Link>
    </Button>
  );
}
