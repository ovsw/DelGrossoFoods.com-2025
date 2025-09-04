"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

import LogoSvg from "@/components/elements/Logo";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";

import { DesktopActions } from "./DesktopActions";
import { DesktopNav } from "./DesktopNav";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { MobileNavPanel } from "./MobileNavPanel";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled, isVisible } = useScrollVisibility();

  const navigationLinks = [
    { href: "/sauces", label: "Sauces" },
    { href: "/store", label: "Store" },
    { href: "/history", label: "History" },
    { href: "/where-to-buy", label: "Where to Buy" },
    { href: "/contact", label: "Contact" },
    // { href: '/recipes', label: 'Recipes' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen && !isVisible) {
      setIsMobileMenuOpen(false);
    }
  }, [isVisible, isMobileMenuOpen]);

  return (
    <>
      {/* Sticky Navigation Bar Wrapper */}
      <div className="fixed top-8 right-0 left-0 z-50 px-4 sm:px-6 lg:px-8">
        <nav
          className={cn(
            "bg-light-100 mx-auto max-w-[80rem] transform rounded-lg p-1 transition-all duration-300",
            isScrolled ? "shadow-lg" : "shadow-md",
            isVisible ? "translate-y-0" : "-translate-y-full",
          )}
        >
          <div className="border-dark-800 rounded-sm border px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <LogoSvg className="h-7" />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <DesktopNav navigationLinks={navigationLinks} />

              {/* Desktop Search and Cart */}
              <DesktopActions />

              {/* Mobile actions group */}
              <div className="flex items-center space-x-4 lg:hidden">
                {/* Mobile Cart Button */}
                <div>
                  <Button variant="secondary" size="sm">
                    Cart (<span data-fc-id="minicart-quantity">0</span>)
                  </Button>
                </div>

                {/* Mobile menu button */}
                <MobileMenuToggle
                  isMobileMenuOpen={isMobileMenuOpen}
                  toggleMobileMenu={toggleMobileMenu}
                />
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <MobileNavPanel
            isMobileMenuOpen={isMobileMenuOpen}
            navigationLinks={navigationLinks}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </nav>
      </div>
    </>
  );
}
