import { sanityFetch } from "@workspace/sanity-config/live";
import { getSiteParams } from "@workspace/sanity-config/site";
import type { DgfNavbarQueryResult } from "@workspace/sanity-config/types";

import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import { dgfNavbarQuery } from "@/lib/sanity/queries";

import { Header } from "./index";

type HeaderLink = { href: string; label: string };
type HeaderCtaButton = {
  text: string;
  href: string;
  openInNewTab?: boolean | null;
  dataAttribute?: string | null;
};
type NavbarData = NonNullable<DgfNavbarQueryResult>;
type NavbarButton = NonNullable<NavbarData["buttons"]>[number];

const fallbackLinks: HeaderLink[] = [
  { href: "/sauces", label: "Sauces" },
  { href: "/store", label: "Store" },
  { href: "/history", label: "History" },
  { href: "/where-to-buy", label: "Where to Buy" },
  { href: "/contact", label: "Contact" },
];

function normalizeHref(rawHref: string | null | undefined): string | null {
  if (!rawHref) return null;
  if (
    rawHref.startsWith("/") ||
    rawHref.startsWith("http://") ||
    rawHref.startsWith("https://") ||
    rawHref.startsWith("mailto:") ||
    rawHref.startsWith("tel:")
  ) {
    return rawHref;
  }
  return `/${rawHref}`;
}

function escapeKey(value?: string | null) {
  if (!value) return "";
  return value.replace(/"/g, '\\"');
}

function extractNavbarLinks(
  navbarData: DgfNavbarQueryResult | null | undefined,
): HeaderLink[] {
  const entries = navbarData?.columns ?? [];
  return entries
    .map((link) => {
      const href = normalizeHref(link?.href);
      const label = link?.name;
      if (!href || !label) return null;
      return { href, label };
    })
    .filter((link): link is HeaderLink => Boolean(link));
}

function extractNavbarCtaButton(
  navbarData: DgfNavbarQueryResult | null | undefined,
  navbarDocumentId?: string | null,
  navbarDocumentType?: string | null,
): HeaderCtaButton | null {
  const buttons = (navbarData?.buttons ?? []) as NavbarButton[];
  const fallbackIndex = buttons.findIndex(
    (button) => button?.text && button?.href,
  );
  if (fallbackIndex < 0) return null;

  const button = buttons[fallbackIndex];
  if (!button) return null;

  const href = normalizeHref(button.href);
  if (!href || !button.text) return null;

  const buttonKey = escapeKey(button._key);
  const buttonPath = buttonKey
    ? `buttons[_key == "${buttonKey}"]`
    : `buttons[${fallbackIndex}]`;
  const dataAttribute = createPresentationDataAttribute({
    documentId: navbarDocumentId,
    documentType: navbarDocumentType,
    path: buttonPath,
  });

  return {
    text: button.text,
    href,
    openInNewTab: button.openInNewTab,
    dataAttribute,
  };
}

export async function HeaderServer() {
  const navbarData = await sanityFetch({
    query: dgfNavbarQuery,
    params: getSiteParams(),
  });
  const navigationLinks = extractNavbarLinks(navbarData.data);
  const navbarDocumentId = navbarData.data?._id ?? null;
  const navbarDocumentType = navbarData.data?._type ?? null;
  const ctaButton = extractNavbarCtaButton(
    navbarData.data,
    navbarDocumentId,
    navbarDocumentType,
  );

  return (
    <Header
      navigationLinks={
        navigationLinks.length > 0 ? navigationLinks : fallbackLinks
      }
      ctaButton={ctaButton ?? undefined}
    />
  );
}
