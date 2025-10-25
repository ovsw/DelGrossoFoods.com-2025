import { Slot } from "@radix-ui/react-slot";
import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const defaultStyles = cn(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ",
  "disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 ",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
);

const buttonVariants = cva(defaultStyles, {
  variants: {
    variant: {
      default:
        "bg-brand-green text-brand-green-text shadow-xs hover:bg-brand-green/90",
      destructive:
        "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
      outline:
        "border border-brand-green text-brand-green shadow-xs hover:bg-background/10  hover:text-brand-green",
      secondary:
        "border border-brand-green bg-th-light-200 text-brand-green shadow-xs hover:bg-secondary/80 hover:text-brand-green",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      accent: "bg-th-red-500 text-th-light-100 hover:bg-th-red-600",
      link: "text-primary underline underline-offset-4 hover:underline",
    },
    size: {
      slim: "p-0 has-[>svg]:px-3",
      default: "px-4 py-3 has-[>svg]:px-3",
      sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
    },
    surface: {
      default: "",
      onDark:
        "focus-visible:border-th-light-100 focus-visible:ring-th-light-100/45 focus-visible:ring-[3px]",
    },
  },
  compoundVariants: [
    {
      surface: "onDark",
      variant: "default",
      class: "bg-white text-brand-green hover:bg-white/90 border-th-light-100",
    },
    {
      surface: "onDark",
      variant: "outline",
      class:
        "border-th-light-100 text-th-light-100 hover:bg-th-light-100/10 hover:text-th-light-100",
    },
    {
      surface: "onDark",
      variant: "secondary",
      class:
        "bg-th-light-100/10 text-th-light-100 hover:bg-th-light-100/15 hover:text-th-light-100",
    },
    {
      surface: "onDark",
      variant: "ghost",
      class: "text-th-light-100 hover:bg-th-light-100/10",
    },
    {
      surface: "onDark",
      variant: "link",
      class: "text-th-light-100 hover:text-th-light-100/80",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
    surface: "default",
  },
});

function Button({
  className,
  variant,
  size,
  surface,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, surface }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
