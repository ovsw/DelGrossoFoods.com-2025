"use client";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";
import * as React from "react";

export type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(function Checkbox({ className, children, ...props }, ref) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "size-4 shrink-0 rounded-sm border border-input bg-white/70",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=checked]:bg-[var(--color-brand-green)] data-[state=checked]:border-[var(--color-brand-green)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center text-[var(--color-brand-green-text)]">
        <Check className="size-3.5" />
      </CheckboxPrimitive.Indicator>
      {children}
    </CheckboxPrimitive.Root>
  );
});

export { Checkbox };
