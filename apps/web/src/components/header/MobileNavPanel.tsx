import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

interface MobileNavPanelProps {
  isMobileMenuOpen: boolean;
  navigationLinks: { href: string; label: string }[];
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export function MobileNavPanel({
  isMobileMenuOpen,
  navigationLinks,
  setIsMobileMenuOpen,
}: MobileNavPanelProps) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out lg:hidden",
        "bg-light-100",
        isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
      )}
    >
      <div className="px-4 py-2">
        {/* Mobile Navigation Links */}
        <ul className="flex flex-col divide-y divide-th-brown-400/20 border-t ">
          {navigationLinks.map((link, index) => (
            <li key={link.href ?? index.toString()}>
              <Link
                href={link.href}
                className={cn(
                  "block w-full px-3 py-3.5 text-base font-medium text-amber-900",
                  "transition-colors duration-200 hover:bg-black/5 hover:text-amber-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-400",
                )}
                style={{
                  animationDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
