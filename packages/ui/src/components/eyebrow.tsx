import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Eyebrow: uppercase label displayed above headings.
const eyebrowVariants = cva(
  "block mb-2 text-sm font-semibold uppercase tracking-wide", // base
  {
    variants: {
      variant: {
        onLight: "text-foreground/70",
        onDark: "text-th-light-100",
      },
    },
    defaultVariants: {
      variant: "onLight",
    },
  },
);

export type EyebrowProps = {
  text: string;
  className?: string;
} & VariantProps<typeof eyebrowVariants> &
  Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

export function Eyebrow({ text, variant, className, ...rest }: EyebrowProps) {
  if (!text || text.trim().length === 0) return null;

  return (
    <span
      data-slot="eyebrow"
      className={cn(eyebrowVariants({ variant }), className)}
      {...rest}
    >
      {text}
    </span>
  );
}

export { eyebrowVariants };
