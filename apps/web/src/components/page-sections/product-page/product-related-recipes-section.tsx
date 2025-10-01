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

  const [result, error] = await handleErrors(
    sanityFetch({
      query: getRecipesBySauceIdsQuery,
      params: { sauceIds: ids },
    }),
  );

  if (error) {
    console.error(
      "ProductRelatedRecipesSection: Failed to fetch recipes",
      error,
    );
    return null;
  }

  // Runtime validation for the fetched payload
  const rawData = result?.data ?? [];
  if (!Array.isArray(rawData)) {
    console.error(
      "ProductRelatedRecipesSection: Expected array but got",
      typeof rawData,
    );
    return null;
  }

  const items: RecipeListItem[] = rawData.filter(
    (item): item is RecipeListItem => {
      // Validate required RecipeListItem properties
      if (!item || typeof item !== "object") {
        console.error(
          "ProductRelatedRecipesSection: Invalid item - not an object",
          item,
        );
        return false;
      }

      if (typeof item._id !== "string" || item._id.length === 0) {
        console.error(
          "ProductRelatedRecipesSection: Invalid item - missing or invalid _id",
          item._id,
        );
        return false;
      }

      if (typeof item.name !== "string" || item.name.length === 0) {
        console.error(
          "ProductRelatedRecipesSection: Invalid item - missing or invalid name",
          item.name,
        );
        return false;
      }

      if (typeof item.slug !== "string" || item.slug.length === 0) {
        console.error(
          "ProductRelatedRecipesSection: Invalid item - missing or invalid slug",
          item.slug,
        );
        return false;
      }

      return true;
    },
  );

  if (items.length === 0) return null;

  return (
    <RelatedRecipesLayout
      items={items}
      title={items.length > 1 ? "Related recipes" : undefined}
      eyebrow={items.length > 1 ? "Recipe ideas" : undefined}
      description={
        items.length > 1
          ? "Try these recipes featuring these sauces."
          : undefined
      }
      variant={items.length === 1 ? "single-item-prominent" : "default"}
    />
  );
}
