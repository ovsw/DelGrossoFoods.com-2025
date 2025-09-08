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
  const baseClasses =
    "block px-2 py-2 text-md font-medium whitespace-nowrap rounded-sm text-amber-900 transition-colors duration-200 xl:px-3 hover:text-amber-800 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-400";
  const activeClasses =
    "bg-black/5 text-amber-900 underline underline-offset-4 decoration-amber-800";
  return (
    <Link
      href={href}
      className={cn(baseClasses, isActive && activeClasses, className)}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
