// Taxonomy config and helpers for Sauces Index
// Mapping canonical slugs to Sanity labels, display labels, and badge colors

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
  readonly colorVar: string; // CSS variable name, e.g. --color-th-green-500
}

interface LineConfigItem {
  readonly label: LineLabel;
  readonly display: string;
  readonly colorVar: string;
}

interface TypeConfigItem {
  readonly label: TypeLabel;
  readonly display: string;
  readonly colorVar: string;
}

export const lineMap: Record<LineSlug, LineConfigItem> = {
  original: {
    label: "Original",
    display: "Original",
    colorVar: "--color-th-red-600",
  },
  organic: {
    label: "Organic",
    display: "Organic",
    colorVar: "--color-th-green-500",
  },
  premium: {
    label: "Ultra-Premium",
    display: "Premium",
    colorVar: "--color-th-dark-900",
  },
} as const;

export const typeMap: Record<TypeSlug, TypeConfigItem> = {
  pasta: {
    label: "Pasta Sauce",
    display: "Pasta Sauce",
    colorVar: "--color-brand-red",
  },
  pizza: {
    label: "Pizza Sauce",
    display: "Pizza Sauce",
    colorVar: "--color-brand-yellow",
  },
  salsa: {
    label: "Salsa Sauce",
    display: "Salsa Sauce",
    colorVar: "--color-brand-green",
  },
  sandwich: {
    label: "Sandwich Sauce",
    display: "Sandwich Sauce",
    colorVar: "",
  },
} as const;

const inverseLine: Record<LineLabel, LineSlug> = {
  Original: "original",
  Organic: "organic",
  "Ultra-Premium": "premium",
} as const;

const inverseType: Record<TypeLabel, TypeSlug> = {
  "Pasta Sauce": "pasta",
  "Pizza Sauce": "pizza",
  "Salsa Sauce": "salsa",
  "Sandwich Sauce": "sandwich",
} as const;

export function toLineSlug(label: LineLabel): LineSlug {
  return inverseLine[label];
}

export function toTypeSlug(label: TypeLabel): TypeSlug {
  return inverseType[label];
}

export function fromLineSlug(slug: LineSlug): LineLabel {
  return lineMap[slug].label;
}

export function fromTypeSlug(slug: TypeSlug): TypeLabel {
  return typeMap[slug].label;
}

export function getLineBadge(label: LineLabel): BadgeConfig {
  const slug = toLineSlug(label);
  const cfg = lineMap[slug];
  return { text: cfg.display, colorVar: cfg.colorVar };
}

export function getTypeBadge(label: TypeLabel): BadgeConfig {
  const slug = toTypeSlug(label);
  const cfg = typeMap[slug];
  return { text: cfg.display, colorVar: cfg.colorVar };
}

export const allLineSlugs: LineSlug[] = ["original", "organic", "premium"];
export const allTypeSlugs: TypeSlug[] = ["pasta", "pizza", "salsa", "sandwich"];
