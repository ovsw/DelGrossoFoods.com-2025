import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Badge style variants: background, foreground, and border colors via CVA
export const badgeVariants = cva(
  `inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden
  rounded-xs border px-2 py-1 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3`,
  {
    variants: {
      variant: {
        // Neutral default for generic usage
        neutral:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",

        // Product line variants
        original:
          "bg-[var(--color-th-red-600)] text-[var(--color-th-light-100)] border-[var(--color-th-red-600)] [a&]:hover:brightness-95",
        organic:
          "bg-[var(--color-th-green-500)] text-[var(--color-th-light-100)] border-[var(--color-th-green-500)] [a&]:hover:brightness-95",
        premium:
          "bg-[var(--color-th-dark-900)] text-[var(--color-th-light-100)] border-[var(--color-th-dark-900)] [a&]:hover:brightness-125",

        // Sauce type variants
        pasta:
          "bg-[var(--color-brand-red)] text-[var(--color-brand-red-text)] border-[var(--color-brand-red)] [a&]:hover:brightness-95",
        pizza:
          "bg-[var(--color-brand-yellow)] text-[var(--color-brand-yellow-text)] border-[var(--color-brand-yellow)] [a&]:hover:brightness-95",
        salsa:
          "bg-[var(--color-brand-green)] text-[var(--color-brand-green-text)] border-[var(--color-brand-green)] [a&]:hover:brightness-95",
        sandwich:
          "bg-[var(--color-th-light-100)] text-[var(--color-th-dark-900)] border-[var(--color-th-neutral-300)] [a&]:hover:bg-[var(--color-th-light-200)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeBaseProps = {
  text: string;
  href?: string;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

type BadgeProps = BadgeBaseProps & VariantProps<typeof badgeVariants>;

function Badge({ text, href, variant, className, ...rest }: BadgeProps) {
  const Comp = href ? ("a" as const) : ("span" as const);

  return (
    <Comp
      data-slot="badge"
      href={href}
      className={cn(badgeVariants({ variant }), className)}
      {...(rest as any)}
    >
      {text}
    </Comp>
  );
}

export { Badge };
