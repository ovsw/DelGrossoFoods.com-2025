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
        "nav_mobile_wrap overflow-hidden lg:hidden bg-light-100 will-change-transform",
        "transition-all",
        isMobileMenuOpen
          ? "max-h-[100svh] opacity-100 translate-y-0 duration-300 ease-out"
          : "max-h-0 opacity-0 -translate-y-2 duration-200 ease-in",
      )}
    >
      <div className="nav_mobile_contain px-4 py-2">
        {/* Mobile Navigation Links */}
        <ul className="nav_mobile_layout flex flex-col divide-y divide-th-brown-400/20 border-t ">
          {navigationLinks.map((link, index) => {
            const isActive =
              currentPath === link.href ||
              (currentPath ? currentPath.startsWith(`${link.href}/`) : false);
            return (
              <li key={link.href ?? index.toString()}>
                <Link
                  href={link.href}
                  className={cn(
                    "block w-full px-3 py-3.5 text-base font-medium text-amber-900",
                    "transition-colors duration-200 hover:bg-black/5 hover:text-amber-800",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-400",
                    isActive &&
                      "bg-black/5 text-amber-900 underline underline-offset-4 decoration-amber-800",
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
