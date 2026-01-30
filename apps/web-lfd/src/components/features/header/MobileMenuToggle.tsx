import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export function MobileMenuToggle({
  isMobileMenuOpen,
  toggleMobileMenu,
}: MobileMenuToggleProps) {
  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        surface="onDark"
        size="icon"
        onClick={toggleMobileMenu}
        className={cn(
          "text-brand-yellow hover:bg-brand-yellow/15 hover:text-brand-yellow",
          "focus-visible:border-brand-yellow focus-visible:ring-brand-yellow/60",
          "transition-colors duration-200",
        )}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle navigation menu"
      >
        <div className="relative flex h-6 w-6 items-center justify-center">
          <Menu
            className={cn(
              "absolute inset-0 size-6 transition-all duration-300",
              isMobileMenuOpen
                ? "rotate-180 opacity-0"
                : "rotate-0 opacity-100",
            )}
          />
          <X
            className={cn(
              "absolute inset-0 size-6 transition-all duration-300",
              isMobileMenuOpen
                ? "rotate-0 opacity-100"
                : "-rotate-180 opacity-0",
            )}
          />
        </div>
      </Button>
    </div>
  );
}
