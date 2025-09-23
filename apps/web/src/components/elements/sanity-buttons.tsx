import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import type { SanityButtonProps } from "@/types";

type SanityButtonsProps = {
  buttons: (SanityButtonProps & { icon?: ReactNode })[] | null;
  className?: string;
  buttonClassName?: string;
  size?: "sm" | "lg" | "default" | "icon" | null | undefined;
};

function SanityButton({
  text,
  href,
  variant = "default",
  openInNewTab,
  className,
  icon,
  ...props
}: (SanityButtonProps & { icon?: ReactNode }) & ComponentProps<typeof Button>) {
  if (!href) {
    console.log("Link Broken", { text, href, variant, openInNewTab });
    return <Button>Link Broken</Button>;
  }

  return (
    <Button
      variant={variant}
      {...props}
      asChild
      className={cn("rounded-[10px]", className)}
    >
      <Link
        href={href || "#"}
        target={openInNewTab ? "_blank" : "_self"}
        aria-label={`Navigate to ${text}`}
        title={`Click to visit ${text}`}
        className="flex items-center gap-2"
      >
        {icon ? (
          <span aria-hidden className="flex items-center">
            {icon}
          </span>
        ) : null}
        <span>{text}</span>
      </Link>
    </Button>
  );
}

export function SanityButtons({
  buttons,
  className,
  buttonClassName,
  size = "default",
}: SanityButtonsProps) {
  if (!buttons?.length) return null;

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      {buttons.map((button) => (
        <SanityButton
          key={`button-${button._key}`}
          size={size}
          {...button}
          className={buttonClassName}
        />
      ))}
    </div>
  );
}
