import {
  DEFAULT_STATE,
  type RecipeQueryState,
  serializeStateToParams,
} from "@/lib/recipes/url";

export function buildRecipesFilterLink(
  partial: Partial<RecipeQueryState>,
): string {
  const params = serializeStateToParams({
    ...DEFAULT_STATE,
    ...partial,
  });
  const query = params.toString();
  return query ? `/recipes?${query}` : "/recipes";
}

export function normalizeSauceHref(
  slug: string | null | undefined,
): string | null {
  if (!slug) return null;
  const cleaned = slug.trim();
  if (!cleaned) return null;
  const withoutLeadingSlash = cleaned.replace(/^\/+/, "");
  const path = withoutLeadingSlash.startsWith("sauces/")
    ? withoutLeadingSlash
    : `sauces/${withoutLeadingSlash}`;
  return `/${path}`;
}

export function hasBlocks(blocks: unknown[] | null | undefined): boolean {
  return Array.isArray(blocks) && blocks.length > 0;
}
