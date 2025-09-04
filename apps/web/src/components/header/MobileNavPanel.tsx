import { Button } from "@workspace/ui/components/button";
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
        "bg-[#E6D5B7]",
        isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
      )}
    >
      <div className="space-y-1 px-4 pt-2 pb-6">
        {/* Mobile Navigation Links */}
        {navigationLinks.map((link, index) => (
          <Button asChild key={index}>
            <Link
              href={link.href}
              className="block rounded-md px-3 py-4 text-lg font-medium text-amber-900 transition-colors duration-200 hover:bg-amber-100 hover:text-amber-800"
              style={{
                animationDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          </Button>
        ))}

        {/* Mobile Cart */}
      </div>
    </div>
  );
}
