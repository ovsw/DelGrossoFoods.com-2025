import type { BadgeVariant } from "@workspace/ui/components/badge";
import { stegaClean } from "next-sanity";

import { type LineSlug, toLineSlug } from "@/config/sauce-taxonomy";

export type RecipeTagSlug = "low-carb" | "quick" | "vegetarian" | "gluten-free";
export type MeatSlug = "beef" | "pork" | "poultry" | "seafood" | "none";

type RecipeTagConfig = {
  label: string;
  display: string;
  badgeVariant: BadgeVariant;
};

const tagConfig = {
  "low-carb": {
    label: "Low-Carb",
    display: "Low-Carb",
    badgeVariant: "low-carb",
  },
  quick: {
    label: "Quick",
    display: "Quick",
    badgeVariant: "quick",
  },
  vegetarian: {
    label: "Vegetarian",
    display: "Vegetarian",
    badgeVariant: "vegetarian",
  },
  "gluten-free": {
    label: "Gluten-Free",
    display: "Gluten-Free",
    badgeVariant: "gluten-free",
  },
} satisfies Record<RecipeTagSlug, RecipeTagConfig>;

export const tagMap: Record<RecipeTagSlug, RecipeTagConfig> = tagConfig;

export const meatMap: Record<MeatSlug, { label: string; display: string }> = {
  beef: { label: "Beef", display: "Beef" },
  pork: { label: "Pork", display: "Pork" },
  poultry: { label: "Poultry", display: "Poultry" },
  seafood: { label: "Seafood", display: "Seafood" },
  none: { label: "No meat", display: "No meat" },
} as const;

export const allRecipeTagSlugs: RecipeTagSlug[] = [
  "low-carb",
  "quick",
  "vegetarian",
  "gluten-free",
];

export const allMeatSlugs: MeatSlug[] = [
  "beef",
  "pork",
  "poultry",
  "seafood",
  "none",
];

const hasOwnProperty = <Obj extends object>(
  obj: Obj,
  key: PropertyKey,
): key is keyof Obj => Object.prototype.hasOwnProperty.call(obj, key);

const isRecipeTagSlug = (value: string): value is RecipeTagSlug =>
  hasOwnProperty(tagMap, value);

const isMeatSlug = (value: string): value is MeatSlug =>
  hasOwnProperty(meatMap, value);

export function toRecipeTagSlug(label: unknown): RecipeTagSlug | undefined {
  if (!label) return undefined;
  const clean = stegaClean(String(label));
  const normalized = clean.toLowerCase();

  // Direct match against known slugs
  if (isRecipeTagSlug(normalized)) return normalized;

  // Handle known aliases from Sanity values → internal slugs
  switch (normalized) {
    case "quick-to-make":
      return "quick";
  }

  // Fallback: match by label text
  const entry = Object.entries(tagMap).find(([, v]) => v.label === clean);
  return (entry?.[0] as RecipeTagSlug | undefined) ?? undefined;
}

export function toMeatSlug(label: unknown): MeatSlug | undefined {
  if (!label) return undefined;
  const clean = stegaClean(String(label));
  const normalized = clean.toLowerCase();
  if (isMeatSlug(normalized)) return normalized;
  const entry = Object.entries(meatMap).find(([, v]) => v.label === clean);
  return (entry?.[0] as MeatSlug | undefined) ?? undefined;
}

export function extractLineSlugs(
  lines: readonly unknown[] | null | undefined,
): LineSlug[] {
  const set = new Set<LineSlug>();
  for (const v of Array.isArray(lines) ? lines : []) {
    const slug = toLineSlug(v);
    if (slug) set.add(slug);
  }
  return [...set];
}
