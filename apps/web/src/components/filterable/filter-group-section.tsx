"use client";
import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

import { ClearSection } from "@/components/filterable/clear-section";

type Props = {
  title: string;
  children: ReactNode;
  showClear?: boolean;
  onClear?: () => void;
  clearLabel?: string;
  className?: string;
  contentClassName?: string;
};

/**
 * Reusable wrapper for filter fieldsets so headings + clear actions stay consistent.
 */
export function FilterGroupSection({
  title,
  children,
  showClear = false,
  onClear,
  clearLabel = "Clear",
  className,
  contentClassName = "mt-2",
}: Props) {
  return (
    <fieldset className={cn("m-0 border-0 p-0", className)}>
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center justify-between gap-2">
        <span className="px-0 text-lg font-semibold">{title}</span>
        {onClear ? (
          <ClearSection show={showClear} onClear={onClear} label={clearLabel} />
        ) : null}
      </div>
      {contentClassName ? (
        <div className={contentClassName}>{children}</div>
      ) : (
        children
      )}
    </fieldset>
  );
}
