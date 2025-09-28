// Product taxonomy, packaging, and helpers for the Products Index
import { stegaClean } from "next-sanity";

import {
  type LineSlug,
  toLineSlug,
  typeMap,
  type TypeSlug,
} from "@/config/sauce-taxonomy";

// Packaging slugs (canonical)
export type PackagingSlug = "case" | "gift" | "other"; // other := merchandise

// Raw category values on Product documents
export type ProductCategory = "case_of_12" | "gift_pack" | "merchandise";

export const packagingMap: Record<
  PackagingSlug,
  { label: string; display: string }
> = {
  case: { label: "Case of 12", display: "Case of 12" },
  gift: { label: "Gift Pack", display: "Gift Pack" },
  other: { label: "Merchandise", display: "Merchandise" },
} as const;

const categoryToPackaging: Record<ProductCategory, PackagingSlug> = {
  case_of_12: "case",
  gift_pack: "gift",
  merchandise: "other",
} as const;

export function toPackagingSlug(category: unknown): PackagingSlug | undefined {
  if (!category) return undefined;
  const clean = stegaClean(String(category)) as ProductCategory;
  return categoryToPackaging[clean];
}

export function getPackagingText(category: unknown): string {
  const slug = toPackagingSlug(category);
  return slug ? packagingMap[slug].display : "";
}

export function getUniqueLineSlug(
  values: readonly unknown[] | undefined,
): LineSlug | undefined {
  if (!values || values.length === 0) return undefined;
  const set = new Set<LineSlug>();
  for (const v of values) {
    const slug = toLineSlug(v);
    if (slug) set.add(slug);
  }
  return set.size === 1 ? [...set][0] : undefined; // undefined means mixed or none
}

export function getUniqueTypeSlug(
  values: readonly unknown[] | undefined,
): TypeSlug | undefined {
  if (!values || values.length === 0) return undefined;
  const set = new Set<TypeSlug>();
  for (const v of values) {
    const clean = stegaClean(String(v));
    const match = Object.entries(typeMap).find(
      ([, cfg]) => cfg.label === clean,
    )?.[0] as TypeSlug | undefined;
    if (match) set.add(match);
  }
  return set.size === 1 ? [...set][0] : undefined; // undefined means mixed or none
}
