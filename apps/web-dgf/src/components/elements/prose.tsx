import { cn } from "@workspace/ui/lib/utils";
import type { HTMLAttributes, PropsWithChildren } from "react";

type ProseProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * When true, use inverted typography colors suitable for dark surfaces.
   * This avoids forcing light-surface colors on nested elements.
   */
  invert?: boolean;
};

export function Prose({
  className,
  children,
  invert = false,
  ...props
}: PropsWithChildren<ProseProps>) {
  const base =
    "prose max-w-none prose-headings:scroll-m-24 prose-img:rounded-lg";
  const lightColors =
    "text-foreground prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-em:text-foreground/90 prose-a:text-brand-green prose-a:no-underline hover:prose-a:underline underline-offset-4";
  const darkColors =
    // Use prose-invert and avoid pinning element colors so inversion works
    "prose-invert prose-a:no-underline hover:prose-a:underline underline-offset-4";

  return (
    <div
      className={cn(base, invert ? darkColors : lightColors, className)}
      {...props}
    >
      {children}
    </div>
  );
}
