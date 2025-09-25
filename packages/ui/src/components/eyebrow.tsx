import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Eyebrow: minimal, no background. Left border + 1rem padding.
const eyebrowVariants = cva(
  "inline-flex items-center text-xs leading-none border-l pl-4", // base
  {
    variants: {
      variant: {
        onLight:
          "border-[var(--color-th-neutral-300)] text-[var(--color-th-dark-700)]",
        onDark:
          "border-[var(--color-th-light-100)] text-[var(--color-th-light-100)]",
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
