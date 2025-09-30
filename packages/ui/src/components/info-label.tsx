import { Slot } from "@radix-ui/react-slot";
import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const infoLabelVariants = cva(
  "block text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      tone: {
        rust: "text-th-red-700/60",
        neutral: "text-th-dark-700/60",
      },
    },
    defaultVariants: {
      tone: "rust",
    },
  },
);

type InfoLabelProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof infoLabelVariants> & {
    asChild?: boolean;
  };

const InfoLabel = React.forwardRef<HTMLSpanElement, InfoLabelProps>(
  ({ className, tone, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        data-slot="info-label"
        ref={ref}
        className={cn(infoLabelVariants({ tone }), className)}
        {...props}
      />
    );
  },
);
InfoLabel.displayName = "InfoLabel";

export { InfoLabel, infoLabelVariants };
