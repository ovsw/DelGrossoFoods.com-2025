import { sanityFetch } from "@workspace/sanity-config/live";
import { getRecipesBySauceIdsQuery } from "@workspace/sanity-config/query";
import { getSiteParams } from "@workspace/sanity-config/site";

import { RelatedRecipesLayout } from "@/components/layouts/related-recipes-layout";
import type { RecipeListItem } from "@/types";
import { handleErrors } from "@/utils";

interface RecipeRelatedRecipesSectionProps {
  readonly recipeId: string | undefined;
  readonly sauceIds: readonly string[];
}

export async function RecipeRelatedRecipesSection({
  recipeId,
  sauceIds,
}: RecipeRelatedRecipesSectionProps) {
  if (!recipeId || sauceIds.length === 0) return null;

  const siteParams = getSiteParams();

  const [result] = await handleErrors(
    sanityFetch({
      query: getRecipesBySauceIdsQuery,
      params: { ...siteParams, sauceIds },
    }),
  );
  let items = (result?.data ?? []) as RecipeListItem[];

  // Exclude the current recipe if it appears in results
  items = items.filter((r) => r._id !== recipeId);
  if (items.length === 0) return null;

  return (
    <RelatedRecipesLayout
      items={items}
      title={items.length > 1 ? "Related recipes" : undefined}
      eyebrow={items.length > 1 ? "Recipe ideas" : undefined}
      description={
        items.length > 1 ? "You might also like these recipes." : undefined
      }
      variant={items.length === 1 ? "single-item-prominent" : "default"}
    />
  );
}
