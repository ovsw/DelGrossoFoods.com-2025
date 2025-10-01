import { RelatedRecipesLayout } from "@/components/layouts/related-recipes-layout";
import { sanityFetch } from "@/lib/sanity/live";
import { getRecipesBySauceIdsQuery } from "@/lib/sanity/query";
import type { RecipeListItem } from "@/types";
import { handleErrors } from "@/utils";

interface ProductRelatedRecipesSectionProps {
  readonly sauceIds: readonly string[];
}

export async function ProductRelatedRecipesSection({
  sauceIds,
}: ProductRelatedRecipesSectionProps) {
  const ids = Array.from(
    new Set(
      (sauceIds ?? [])
        .filter((id): id is string => typeof id === "string" && id.length > 0)
        .map((id) => id.replace(/^drafts\./, "")),
    ),
  );
  if (ids.length === 0) return null;

  const [result] = await handleErrors(
    sanityFetch({
      query: getRecipesBySauceIdsQuery,
      params: { sauceIds: ids },
    }),
  );
  const items = (result?.data ?? []) as RecipeListItem[];
  if (!items || items.length === 0) return null;

  return (
    <RelatedRecipesLayout
      items={items}
      title={items.length > 1 ? "Related recipes" : undefined}
      eyebrow={items.length > 1 ? "Recipe ideas" : undefined}
      description={
        items.length > 1
          ? "Try these recipes featuring this product."
          : undefined
      }
      variant={items.length === 1 ? "single-item-prominent" : "default"}
    />
  );
}
