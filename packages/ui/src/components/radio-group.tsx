"use client";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
>;
type ItemProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
>;

function RadioGroup({ className, ...props }: RootProps) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  ItemProps
>(function RadioGroupItem({ className, children, ...props }, ref) {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "size-4 rounded-full border border-input bg-white/70",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=checked]:border-[var(--color-brand-green)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn(
          "relative grid place-items-center",
          "after:block after:size-2.5 after:rounded-full after:bg-[var(--color-brand-green)]",
        )}
      />
      {children}
    </RadioGroupPrimitive.Item>
  );
});

export { RadioGroup, RadioGroupItem };
