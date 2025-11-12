import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import * as React from "react";

type NavLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  "href" | "children"
> & {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
};

export function NavLink({
  href,
  children,
  isActive = false,
  className,
  ...props
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "block whitespace-nowrap rounded-sm px-2 py-2 text-md font-medium text-th-light-100 transition-colors duration-200 xl:px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-yellow",
        !isActive && "hover:bg-brand-yellow/15 hover:text-brand-yellow",
        isActive && "bg-brand-yellow text-brand-green",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
