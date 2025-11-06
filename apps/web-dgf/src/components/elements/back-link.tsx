import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { ReactNode } from "react";

interface BackLinkProps {
  readonly href: string;
  readonly label: string;
  readonly icon?: ReactNode;
  readonly className?: string;
}

export function BackLink({
  href,
  label,
  icon = <ArrowLeft className="size-4" aria-hidden="true" />,
  className,
}: BackLinkProps) {
  const cleanedLabel = stegaClean(label);

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn(
        "px-0 text-brand-green hover:bg-transparent hover:text-brand-green",
        "focus-visible:ring-brand-green/50",
        className,
      )}
    >
      <Link
        href={href}
        aria-label={`Go back to ${cleanedLabel}`}
        className="inline-flex items-center gap-2"
      >
        <span aria-hidden>{icon}</span>
        <span>{label}</span>
      </Link>
    </Button>
  );
}
