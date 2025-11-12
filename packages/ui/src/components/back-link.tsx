import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { ReactNode } from "react";

import { type RootProps } from "../lib/data-attributes";
import { cn } from "../lib/utils";
import { Button } from "./button";

export type BackLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  rootProps?: RootProps<HTMLAnchorElement>;
};

export function BackLink({
  href,
  label,
  icon = <ArrowLeft className="size-4" aria-hidden="true" />,
  className,
  rootProps,
}: BackLinkProps) {
  const cleanedLabel = stegaClean(label);
  const { className: linkClassName, ...restRootProps } = rootProps ?? {};

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn(
        "px-0 text-brand-green hover:bg-transparent hover:text-brand-green",
        "focus-visible:ring-brand-red/50",
        className,
      )}
    >
      <Link
        href={href}
        aria-label={`Go back to ${cleanedLabel}`}
        className={cn("inline-flex items-center gap-2", linkClassName)}
        {...restRootProps}
      >
        <span aria-hidden>{icon}</span>
        <span>{label}</span>
      </Link>
    </Button>
  );
}
