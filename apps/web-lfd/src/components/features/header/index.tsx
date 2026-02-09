"use client";

import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
          "nav_wrap fixed top-0 right-0 left-0 z-50 transform px-4 text-th-light-100 sm:px-6 lg:px-8",
          suppressTransitions ? "transition-none duration-0" : "transition-all",
          isVisible
            ? "translate-y-0 opacity-100 duration-300 ease-out"
            : "-translate-y-full opacity-0 duration-200 ease-in",
        )}
      >
        <nav
          aria-label="Main navigation"
          className="nav_contain mx-auto mt-8 max-w-[80rem] rounded-lg border border-white/15 bg-black/85 p-1 text-th-light-100 [box-shadow:var(--shadow-nav)]"
        >
          <div className="nav_layout flex h-16 items-center justify-between rounded-sm border border-brand-yellow/60 bg-black px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex-shrink-1">
              <Link href="/">
                <Image
                  src="/images/logos/lfd-logo-light-short-p-500.png"
                  alt="La Famiglia DelGrosso logo"
                  width={500}
                  height={96}
                  className="h-7 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <DesktopNav
              navigationLinks={navigationLinks}
              currentPath={pathname ?? undefined}
            />

            {/* Desktop Search and Cart */}
            <DesktopActions ctaButton={hasCtaButton ? ctaButton : undefined} />

            {/* Mobile actions group */}
            <div className="flex items-center space-x-4 lg:hidden">
              {/* Mobile Recipes Button */}
              {hasCtaButton ? (
                <div>
                  <RecipesButton
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
              {/* Mobile Cart Button */}
              <div>
                <CartButton />
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
