"use client";

import { ListCard } from "@/components/list/list-card";
import {
  getPackagingText,
  getUniqueLineSlug,
  getUniqueTypeSlug,
  toPackagingSlug,
} from "@/config/product-taxonomy";
import { lineMap, typeMap } from "@/config/sauce-taxonomy";
import { buildHref } from "@/lib/list/href";
import type { ProductListItem } from "@/types";

function formatUSD(value: number | null | undefined): string | null {
  if (value == null) return null;
  const hasCents = Math.round(value * 100) % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(value);
}

export function ProductCard({ item }: { item: ProductListItem }) {
  const { name, slug, mainImage, category, price, sauceLines, sauceTypes } =
    item;

  // Subtitle: "{Packaging} – {Price}"
  const packaging = getPackagingText(category);
  const priceText = formatUSD(price ?? null);
  const subtitle = [packaging, priceText].filter(Boolean).join(" – ") || null;

  // Badges: skip entirely for merchandise (other)
  const pkgSlug = toPackagingSlug(category);
  const badges: {
    text: string;
    variant?:
      | "neutral"
      | "original"
      | "organic"
      | "premium"
      | "pasta"
      | "pizza"
      | "salsa"
      | "sandwich";
  }[] = [];
  if (pkgSlug !== "other") {
    // Unique line badge (skip if mixed/none)
    const lineSlug = getUniqueLineSlug(sauceLines ?? undefined);
    if (lineSlug) {
      badges.push({ text: lineMap[lineSlug].display, variant: lineSlug });
    }

    // Type badge: single => specific, multiple => Mix
    const typeSlug = getUniqueTypeSlug(sauceTypes ?? undefined);
    if (typeSlug) {
      badges.push({ text: typeMap[typeSlug].display, variant: typeSlug });
    } else if ((sauceTypes?.length ?? 0) > 1) {
      badges.push({ text: "Mix" });
    }
  }

  const href = buildHref("/store", slug);
  return (
    <ListCard
      href={href}
      title={name}
      ariaLabel={`View ${name}`}
      image={mainImage}
      imageAlt={name}
      imageAspect="product"
      imageWidth={800}
      imageHeight={533}
      subtitle={subtitle}
      badges={badges}
    />
  );
}
