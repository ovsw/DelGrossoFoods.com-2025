import { RelatedRecipesLayout } from "@/components/layouts/related-recipes-layout";
import { sanityFetch } from "@/lib/sanity/live";
import {
  getRecipeByIdQuery,
  getRecipesBySauceIdsQuery,
} from "@/lib/sanity/query";
import type { RecipeListItem } from "@/types";
import { handleErrors } from "@/utils";

interface RecipeRelatedRecipesSectionProps {
  readonly recipeId: string | undefined;
}

export async function RecipeRelatedRecipesSection({
  recipeId,
}: RecipeRelatedRecipesSectionProps) {
  if (!recipeId) return null;

  // Load the recipe to get related sauce IDs
  const [recipeResult] = await handleErrors(
    sanityFetch({ query: getRecipeByIdQuery, params: { id: recipeId } }),
  );
  const recipe = recipeResult?.data as
    | (Record<string, unknown> & {
        dgfSauces?: { _id?: string }[];
        lfdSauces?: { _id?: string }[];
      })
    | null;
  if (!recipe) return null;

  const sauceIds = [
    ...((recipe.dgfSauces ?? []).map((s) => s?._id) as (string | undefined)[]),
    ...((recipe.lfdSauces ?? []).map((s) => s?._id) as (string | undefined)[]),
  ]
    .filter((id): id is string => typeof id === "string" && id.length > 0)
    .map((id) => id.replace(/^drafts\./, ""));

  if (sauceIds.length === 0) return null;

  const [result] = await handleErrors(
    sanityFetch({
      query: getRecipesBySauceIdsQuery,
      params: { sauceIds },
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
