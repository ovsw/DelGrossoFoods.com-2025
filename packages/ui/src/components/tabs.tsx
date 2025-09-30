"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";

interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  orientation?: "horizontal" | "vertical";
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ orientation = "horizontal", className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn("w-full", className)}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex gap-2",
      // Use data attribute set by Radix UI instead of separate prop
      "data-[orientation=vertical]:flex-col data-[orientation=horizontal]:flex-row",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  type?: "button" | "submit" | "reset";
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, type = "button", asChild, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    type={asChild ? undefined : type}
    className={cn(
      "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50",
      "bg-transparent text-th-dark-700 border-th-neutral-300 hover:bg-th-light-200",
      "aria-selected:bg-th-light-100 aria-selected:text-th-dark-900 aria-selected:border-th-dark-900",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  lazyMount?: boolean;
}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, lazyMount: _lazyMount, ...props }, ref) => {
  // For lazyMount, we can rely on Radix UI's built-in behavior
  // Radix UI TabsContent only renders when the tab is active
  // The lazyMount prop is kept for API compatibility but doesn't change behavior
  void _lazyMount;
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn("block", className)}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
