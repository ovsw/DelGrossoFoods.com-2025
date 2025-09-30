import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Badge style variants: background, foreground, and border colors via CVA
export const badgeVariants = cva(
  `inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-[#c4c4c4] px-2 py-1 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3 [&:is(a)]:cursor-pointer`,
  {
    variants: {
      variant: {
        // Neutral default for generic usage
        neutral:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",

        // Product line variants
        original: "bg-th-red-600 text-th-light-100 [a&]:hover:brightness-95",
        organic: "bg-th-green-500 text-th-light-100 [a&]:hover:brightness-95",
        premium: "bg-th-dark-900 text-th-light-100 [a&]:hover:brightness-125",

        // Sauce type variants
        pasta: "bg-brand-red text-brand-red-text [a&]:hover:brightness-95",
        pizza:
          "bg-brand-yellow text-brand-yellow-text [a&]:hover:brightness-95",
        salsa: "bg-th-green-500 text-brand-green-text [a&]:hover:brightness-95",
        sandwich: "bg-th-light-100 text-th-dark-900 [a&]:hover:bg-th-light-200",
        "low-carb":
          "bg-brand-yellow text-brand-yellow-text [a&]:hover:brightness-95",
        quick: "bg-th-red-600 text-brand-red-text [a&]:hover:brightness-95",
        vegetarian:
          "bg-th-green-600 text-th-light-100 [a&]:hover:brightness-105",
        "gluten-free":
          "bg-th-light-100 text-th-dark-900 [a&]:hover:bg-th-light-200",
        // Meat attribute variant
        meat: "bg-th-dark-900 text-th-light-100 [a&]:hover:brightness-125",
        // Generic outline pill for unselected filters
        outline:
          "bg-transparent text-th-dark-900 border-th-dark-900 [a&]:hover:bg-th-dark-900/5 [a&]:hover:border-th-dark-900/80",
        // Accent pill (used e.g. for mobile active filter chips)
        accent:
          "bg-brand-red text-brand-red-text border-transparent [a&]:hover:brightness-95 text-md px-2 py-1 rounded-md min-h-8",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

// Export a convenient variant type for consumers so they don't need to
// depend on `VariantProps<typeof badgeVariants>` directly.
export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

type CommonProps = {
  text: string;
  className?: string;
} & VariantProps<typeof badgeVariants>;

type LinkProps = {
  href: string;
} & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "className" | "href"
>;

type SpanProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "className"
> & { href?: never };

type BadgeProps = CommonProps & (LinkProps | SpanProps);

function Badge(props: BadgeProps) {
  if ("href" in props) {
    const { text, href, className, variant, ...anchorProps } = props;
    return (
      <a
        data-slot="badge"
        href={href}
        className={cn(badgeVariants({ variant }), className)}
        {...anchorProps}
      >
        {text}
      </a>
    );
  }

  const { text, className, variant, ...spanProps } = props;
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...spanProps}
    >
      {text}
    </span>
  );
}

export { Badge };
