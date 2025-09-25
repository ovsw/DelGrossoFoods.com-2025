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
        "prose prose-zinc prose-headings:scroll-m-24 prose-headings:text-opacity-90 prose-p:text-opacity-80 prose-a:decoration-dotted prose-ol:text-opacity-80 prose-ul:text-opacity-80 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:first:mt-0 max-w-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
