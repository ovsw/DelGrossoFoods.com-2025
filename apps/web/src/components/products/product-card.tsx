"use client";
import { stegaClean } from "next-sanity";

import { ListCard } from "@/components/list/list-card";
import { getPackagingText, toPackagingSlug } from "@/config/product-taxonomy";
import { getLineBadge, getTypeBadge } from "@/config/sauce-taxonomy";
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
    // Derive unique line (single) or skip if mixed/none
    const uniqueLine = (() => {
      const set = new Set<string>();
      for (const v of sauceLines ?? []) set.add(stegaClean(String(v)));
      return set.size === 1 ? [...set][0] : undefined;
    })();
    if (uniqueLine) {
      const b = getLineBadge(uniqueLine);
      badges.push({ text: b.text, variant: b.variant });
    }

    // Derive type: one => specific badge, >1 => Mix, 0 => none
    const typeSet = new Set<string>();
    for (const v of sauceTypes ?? []) typeSet.add(stegaClean(String(v)));
    if (typeSet.size === 1) {
      const b = getTypeBadge([...typeSet][0]);
      badges.push({ text: b.text, variant: b.variant });
    } else if (typeSet.size > 1) {
      badges.push({ text: "Mix" });
    }
  }

  const href = slug?.startsWith("/") ? slug : `/products/${slug}`;
  return (
    <ListCard
      href={href}
      title={name}
      ariaLabel={`View ${name}`}
      image={mainImage}
      imageAlt={name}
      subtitle={subtitle}
      badges={badges}
    />
  );
}
