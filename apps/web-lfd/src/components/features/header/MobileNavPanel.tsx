import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

interface MobileNavPanelProps {
  isMobileMenuOpen: boolean;
  navigationLinks: { href: string; label: string }[];
  currentPath?: string;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export function MobileNavPanel({
  isMobileMenuOpen,
  navigationLinks,
  currentPath,
  setIsMobileMenuOpen,
}: MobileNavPanelProps) {
  return (
    <div
      className={cn(
        "nav_mobile_wrap will-change-transform overflow-hidden bg-black text-th-light-100 lg:hidden",
        "transition-all",
        isMobileMenuOpen
          ? "max-h-[100svh] translate-y-0 opacity-100 duration-300 ease-out"
          : "max-h-0 -translate-y-2 opacity-0 duration-200 ease-in",
      )}
    >
      <div className="nav_mobile_contain px-4 py-2">
        {/* Mobile Navigation Links */}
        <ul className="nav_mobile_layout flex flex-col divide-y divide-white/10 border-t border-white/10">
          {navigationLinks.map((link, index) => {
            const isActive =
              currentPath === link.href ||
              (currentPath ? currentPath.startsWith(`${link.href}/`) : false);
            return (
              <li key={link.href ?? index.toString()}>
                <Link
                  href={link.href}
                  className={cn(
                    "block w-full px-3 py-3.5 text-base font-medium text-th-light-100",
                    "transition-colors duration-200 hover:bg-brand-yellow/15 hover:text-brand-yellow",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow",
                    isActive &&
                      "bg-brand-yellow/10 text-brand-yellow underline decoration-brand-yellow/70 underline-offset-4",
                  )}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    animationDelay: isMobileMenuOpen
                      ? `${index * 50}ms`
                      : "0ms",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
