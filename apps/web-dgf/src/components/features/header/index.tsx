"use client";

import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import LogoSvg from "@/components/elements/logo";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

import { CartButton } from "./CartButton";
import { CookbookIcon } from "./cookbook-icon";
import { DesktopActions } from "./DesktopActions";
import { DesktopNav } from "./DesktopNav";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { MobileNavPanel } from "./MobileNavPanel";
import { RecipesButton } from "./RecipesButton";

type HeaderLink = { href: string; label: string };
type HeaderCtaButton = {
  text: string;
  href: string;
  openInNewTab?: boolean | null;
  dataAttribute?: string | null;
};

type HeaderProps = {
  navigationLinks: HeaderLink[];
  ctaButton?: HeaderCtaButton;
};

export function Header({ navigationLinks, ctaButton }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isVisible, suppressTransitions } = useScrollVisibility();
  const pathname = usePathname();
  const hasCtaButton = Boolean(ctaButton?.text && ctaButton?.href);
  const ctaLabel = ctaButton?.text ?? "";
  const ctaHref = ctaButton?.href ?? "";
  const ctaLinkProps = hasCtaButton
    ? {
        ...(ctaButton?.openInNewTab
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {}),
        ...(ctaButton?.dataAttribute
          ? { "data-sanity": ctaButton.dataAttribute }
          : {}),
      }
    : {};

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isMobileMenuVisible = isMobileMenuOpen && isVisible;

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
                aria-label="DelGrosso Foods home"
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

            <div className="flex items-center space-x-4">
              {/* Desktop CTA */}
              <DesktopActions
                ctaButton={hasCtaButton ? ctaButton : undefined}
              />

              {/* Mobile Recipes Button */}
              {hasCtaButton ? (
                <div className="lg:hidden">
                  <RecipesButton
                    variant="accent"
                    size="sm"
                    className="max-[450px]:h-9 max-[450px]:w-9 max-[450px]:justify-center max-[450px]:px-0"
                    aria-label="Browse recipes"
                    href={ctaHref}
                    {...ctaLinkProps}
                  >
                    <span className="max-[450px]:hidden">{ctaLabel}</span>
                    <CookbookIcon className="hidden size-5 max-[450px]:block" />
                  </RecipesButton>
                </div>
              ) : null}

              {/* Shared cart link across breakpoints */}
              <CartButton variant="outline" />

              {/* Mobile menu button */}
              <MobileMenuToggle
                isMobileMenuOpen={isMobileMenuVisible}
                toggleMobileMenu={toggleMobileMenu}
              />
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <MobileNavPanel
            isMobileMenuOpen={isMobileMenuVisible}
            navigationLinks={navigationLinks}
            currentPath={pathname ?? undefined}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </nav>
      </div>
    </>
  );
}
