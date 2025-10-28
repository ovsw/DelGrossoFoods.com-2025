import { cn } from "@workspace/ui/lib/utils";
import type { HTMLAttributes } from "react";

export function Prose({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "prose max-w-none text-foreground prose-headings:scroll-m-24 prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-em:text-foreground/90 prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline underline-offset-4 prose-img:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
