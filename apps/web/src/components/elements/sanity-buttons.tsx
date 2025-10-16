import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { stegaClean } from "next-sanity";
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
  openInNewTab,
  className,
  icon,
  ...props
}: (SanityButtonProps & { icon?: ReactNode }) & ComponentProps<typeof Button>) {
  if (!href) {
    console.log("Link Broken", { text, href, openInNewTab });
    return <Button>Link Broken</Button>;
  }

  return (
    <Button {...props} asChild className={cn("rounded-[10px]", className)}>
      <Link
        href={href || "#"}
        target={openInNewTab ? "_blank" : "_self"}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        aria-label={text ? `Navigate to ${stegaClean(text)}` : undefined}
        title={text ? `Click to visit ${stegaClean(text)}` : undefined}
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
