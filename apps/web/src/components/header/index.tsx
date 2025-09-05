"use client";

import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

import LogoSvg from "@/components/elements/Logo";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";

import { CartButton } from "./CartButton";
import { DesktopActions } from "./DesktopActions";
import { DesktopNav } from "./DesktopNav";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { MobileNavPanel } from "./MobileNavPanel";
import { RecipesButton } from "./RecipesButton";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isVisible } = useScrollVisibility();

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
      <div
        role="banner"
        className={cn(
          "nav_wrap fixed top-0 right-0 left-0 z-50 transform px-4 transition-all will-change-auto sm:px-6 lg:px-8",
          isVisible
            ? "translate-y-0 opacity-100 duration-300 ease-out"
            : "-translate-y-full opacity-0 duration-200 ease-in",
        )}
      >
        <nav
          aria-label="Main navigation"
          className={cn(
            "nav_contain mx-auto mt-8 max-w-[80rem] rounded-lg  bg-th-light-100 p-1 shadow-lg",
            // isScrolled ? "shadow-lg" : "shadow-md",
          )}
        >
          <div className="nav_layout flex h-16 items-center justify-between rounded-sm border border-th-brown-400 px-4 sm:px-6 lg:px-8">
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
              {/* Mobile Recipes Button */}
              <div>
                <RecipesButton variant="accent" size="sm" />
              </div>
              {/* Mobile Cart Button */}
              <div>
                <CartButton variant="outline" />
              </div>

              {/* Mobile menu button */}
              <MobileMenuToggle
                isMobileMenuOpen={isMobileMenuOpen}
                toggleMobileMenu={toggleMobileMenu}
              />
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
