import { stegaClean } from "next-sanity";

// This explicit extension keeps the helper runnable under Node's strip-types test mode.
// @ts-expect-error The workspace build resolves this TS module directly.
import { urlFor } from "./client.ts";

type RecipeSeoImage = {
  id?: string | null;
  preview?: string | null;
  hotspot?: {
    x?: number | null;
    y?: number | null;
    height?: number | null;
    width?: number | null;
  } | null;
  crop?: {
    top?: number | null;
    bottom?: number | null;
    left?: number | null;
    right?: number | null;
  } | null;
  alt?: string | null;
} | null;

export type RecipeSeoInput = {
  _id?: string | null;
  _type?: string | null;
  slug?: string | { current?: string | null } | null;
  name?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoImage?: string | null;
  seoNoIndex?: boolean | null;
  mainImage?: RecipeSeoImage;
};

export type ResolvedRecipeSeo = {
  title: string;
  description: string;
  image: string | null;
  seoNoIndex: boolean;
  contentId?: string;
  contentType?: string;
};

const RECIPE_FALLBACK_DESCRIPTION = "Discover delicious family recipes.";

function cleanString(value: unknown): string {
  const cleaned = typeof value === "string" ? stegaClean(value) : value;
  return typeof cleaned === "string" ? cleaned.trim() : "";
}

function normalizeRecipeSlug(slug: RecipeSeoInput["slug"]): string {
  const rawSlug =
    typeof slug === "string"
      ? slug
      : typeof slug?.current === "string"
        ? slug.current
        : "";

  return cleanString(rawSlug)
    .replace(/^\/recipes\//u, "")
    .replace(/^\/+|\/+$/gu, "");
}

function buildRecipeFallbackTitle(slug: string): string {
  return slug ? `Recipe: ${slug}` : "";
}

function buildRecipeMainImageUrl(
  image: RecipeSeoImage | undefined,
): string | null {
  if (!image?.id) {
    return null;
  }

  return urlFor({ ...image, _id: image.id })
    .width(1200)
    .height(630)
    .dpr(2)
    .url();
}

export function resolveRecipeSeo(input: RecipeSeoInput): ResolvedRecipeSeo {
  const slug = normalizeRecipeSlug(input.slug);
  const name = cleanString(input.name);
  const seoTitle = cleanString(input.seoTitle);
  const seoDescription = cleanString(input.seoDescription);
  const seoImage = cleanString(input.seoImage);

  return {
    title: seoTitle || name || buildRecipeFallbackTitle(slug),
    description:
      seoDescription ||
      (name
        ? `Learn how to make ${name} with DelGrosso sauces.`
        : RECIPE_FALLBACK_DESCRIPTION),
    image: seoImage || buildRecipeMainImageUrl(input.mainImage),
    seoNoIndex: Boolean(input.seoNoIndex),
    contentId: input._id ?? undefined,
    contentType: input._type ?? undefined,
  };
}
