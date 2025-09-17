// Taxonomy config and helpers for Sauces Index
// Mapping canonical slugs to Sanity labels, display labels, and badge colors
import { stegaClean } from "next-sanity";

export type LineSlug = "original" | "organic" | "premium";
export type TypeSlug = "pasta" | "pizza" | "salsa" | "sandwich";

export type LineLabel = "Original" | "Organic" | "Ultra-Premium";
export type TypeLabel =
  | "Pasta Sauce"
  | "Pizza Sauce"
  | "Salsa Sauce"
  | "Sandwich Sauce";

export interface BadgeConfig {
  readonly text: string;
  /**
   * Visual variant key expected by the shared <Badge /> component.
   * Typically the canonical slug (e.g., "original", "organic", "pizza").
   */
  readonly variant: "neutral" | LineSlug | TypeSlug;
}

interface LineConfigItem {
  readonly label: LineLabel;
  readonly display: string;
}

interface TypeConfigItem {
  readonly label: TypeLabel;
  readonly display: string;
}

/**
 * Canonical product line configuration keyed by slug.
 *
 * Used to:
 * - Render badge colors/labels in UI
 * - Convert between slugs and human-readable labels
 */
export const lineMap: Record<LineSlug, LineConfigItem> = {
  original: {
    label: "Original",
    display: "Original",
  },
  organic: {
    label: "Organic",
    display: "Organic",
  },
  premium: {
    label: "Ultra-Premium",
    display: "Premium",
  },
} as const;

/**
 * Canonical sauce type configuration keyed by slug.
 *
 * Used to:
 * - Render badge colors/labels in UI
 * - Convert between slugs and human-readable labels
 */
export const typeMap: Record<TypeSlug, TypeConfigItem> = {
  pasta: {
    label: "Pasta Sauce",
    display: "Pasta Sauce",
  },
  pizza: {
    label: "Pizza Sauce",
    display: "Pizza Sauce",
  },
  salsa: {
    label: "Salsa Sauce",
    display: "Salsa Sauce",
  },
  sandwich: {
    label: "Sandwich Sauce",
    display: "Sandwich Sauce",
  },
} as const;

/**
 * Inverse lookup: human-readable line label -> canonical slug.
 */
const inverseLine: Record<LineLabel, LineSlug> = {
  Original: "original",
  Organic: "organic",
  "Ultra-Premium": "premium",
} as const;

/**
 * Inverse lookup: human-readable type label -> canonical slug.
 */
const inverseType: Record<TypeLabel, TypeSlug> = {
  "Pasta Sauce": "pasta",
  "Pizza Sauce": "pizza",
  "Salsa Sauce": "salsa",
  "Sandwich Sauce": "sandwich",
} as const;

/**
 * Convert a human-readable product line label from Sanity into a canonical line slug.
 *
 * Why: UI components (e.g., Badge variants, filters) key off stable slugs
 * such as "original"/"organic"/"premium" rather than the display labels.
 *
 * Note: Strings coming from the Sanity Live Content API may contain hidden
 * steganographic metadata for live preview features. We call `stegaClean` to
 * strip that metadata so exact map lookups work as expected.
 *
 * Examples:
 * - toLineSlug("Original") -> "original"
 * - toLineSlug("Organic") -> "organic"
 * - toLineSlug("Ultra-Premium") -> "premium"
 */
export function toLineSlug(label: unknown): LineSlug | undefined {
  if (!label) return undefined;
  // Sanity Live Content API embeds invisible stega metadata in strings.
  // Clean it to ensure exact key matches against our inverse map.
  const clean = stegaClean(String(label));
  return inverseLine[clean as LineLabel];
}

/**
 * Convert a human-readable sauce type label from Sanity into a canonical type slug.
 *
 * Why: Filtering, sorting, and visual variants expect type slugs like
 * "pasta"/"pizza"/"salsa"/"sandwich".
 *
 * Also strips any Live Preview stega metadata to ensure map lookups succeed.
 *
 * Examples:
 * - toTypeSlug("Pasta Sauce") -> "pasta"
 * - toTypeSlug("Pizza Sauce") -> "pizza"
 * - toTypeSlug("Salsa Sauce") -> "salsa"
 */
export function toTypeSlug(label: unknown): TypeSlug | undefined {
  if (!label) return undefined;
  const clean = stegaClean(String(label));
  return inverseType[clean as TypeLabel];
}

/**
 * Convert a canonical line slug back to its human-readable label.
 *
 * Used when hydrating canonical data back into UI-facing shapes
 * (see `hydrateFromCanonical` in `lib/sauces/filters.ts`).
 *
 * Examples:
 * - fromLineSlug("original") -> "Original"
 * - fromLineSlug("organic") -> "Organic"
 */
export function fromLineSlug(slug: LineSlug): LineLabel {
  return lineMap[slug].label;
}

/**
 * Convert a canonical type slug back to its human-readable label.
 *
 * Used when transforming canonical internal values into display strings
 * for UI components and content.
 *
 * Examples:
 * - fromTypeSlug("pizza") -> "Pizza Sauce"
 * - fromTypeSlug("sandwich") -> "Sandwich Sauce"
 */
export function fromTypeSlug(slug: TypeSlug): TypeLabel {
  return typeMap[slug].label;
}

/**
 * Derive a badge configuration for a product line label.
 *
 * Returns a stable `text` and `variant` used by the shared `<Badge />`
 * component (CVA variants). Falls back to a neutral badge when unknown.
 *
 * Examples:
 * - getLineBadge("Organic") -> { text: "Organic", variant: "organic" }
 * - getLineBadge("Unknown Line") -> { text: "Unknown Line", variant: "neutral" }
 */
export function getLineBadge(label: unknown): BadgeConfig {
  const slug = toLineSlug(label);
  const cfg = slug ? lineMap[slug] : undefined;
  if (!cfg) {
    const text = typeof label === "string" && label ? label : "Unknown";
    return { text, variant: "neutral" };
  }
  return {
    text: cfg.display,
    variant: slug ?? "neutral",
  };
}

/**
 * Derive a badge configuration for a sauce type label.
 *
 * Returns a stable `text` and `variant` for use with `<Badge />`.
 * Falls back to a neutral display when the label cannot be mapped.
 *
 * Examples:
 * - getTypeBadge("Pizza Sauce") -> { text: "Pizza Sauce", variant: "pizza" }
 * - getTypeBadge(123) -> { text: "Unknown", variant: "neutral" }
 */
export function getTypeBadge(label: unknown): BadgeConfig {
  const slug = toTypeSlug(label);
  const cfg = slug ? typeMap[slug] : undefined;
  if (!cfg) {
    const text = typeof label === "string" && label ? label : "Unknown";
    return { text, variant: "neutral" };
  }
  return {
    text: cfg.display,
    variant: slug ?? "neutral",
  };
}

/**
 * Enumerates all valid product line slugs.
 * Useful for filters, checkboxes, or generating UI menus.
 */
export const allLineSlugs: LineSlug[] = ["original", "organic", "premium"];

/**
 * Enumerates all valid sauce type slugs.
 * Useful for type filters, tabs, and validation.
 */
export const allTypeSlugs: TypeSlug[] = ["pasta", "pizza", "salsa", "sandwich"];
