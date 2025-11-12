"use client";

import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import LogoSvg from "@/components/elements/logo";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

import { CartButton } from "./CartButton";
import { CookbookIcon } from "./cookbook-icon";
import { DesktopActions } from "./DesktopActions";
import { DesktopNav } from "./DesktopNav";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { MobileNavPanel } from "./MobileNavPanel";
import { RecipesButton } from "./RecipesButton";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isVisible, suppressTransitions } = useScrollVisibility();
  const pathname = usePathname();

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
          "nav_wrap fixed top-0 right-0 left-0 z-50 transform px-4 sm:px-6 lg:px-8",
          suppressTransitions ? "transition-none duration-0" : "transition-all",
          isVisible
            ? "translate-y-0 opacity-100 duration-300 ease-out"
            : "-translate-y-full opacity-0 duration-200 ease-in",
        )}
      >
        <nav
          aria-label="Main navigation"
          className="nav_contain mx-auto mt-8 max-w-[80rem] rounded-lg  bg-th-light-100 p-1 [box-shadow:var(--shadow-nav)]"
        >
          <div className="nav_layout flex h-16 items-center justify-between rounded-sm border border-th-brown-400 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex-shrink-1 flex align-bottom">
              <Link
                href="/"
                className="align-bottom inline-flex rounded-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <LogoSvg className="h-7" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <DesktopNav
              navigationLinks={navigationLinks}
              currentPath={pathname ?? undefined}
            />

            {/* Desktop Search and Cart */}
            <DesktopActions />

            {/* Mobile actions group */}
            <div className="flex items-center space-x-4 lg:hidden">
              {/* Mobile Recipes Button */}
              <div>
                <RecipesButton
                  variant="accent"
                  size="sm"
                  className="max-[450px]:h-9 max-[450px]:w-9 max-[450px]:justify-center max-[450px]:px-0"
                  aria-label="Browse recipes"
                >
                  <span className="max-[450px]:hidden">Recipes</span>
                  <CookbookIcon className="hidden size-5 max-[450px]:block" />
                </RecipesButton>
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
            currentPath={pathname ?? undefined}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </nav>
      </div>
    </>
  );
}
