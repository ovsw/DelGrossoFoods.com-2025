import { sanityFetch } from "@workspace/sanity-config/live";
import { getRecipesBySauceIdsQuery } from "@workspace/sanity-config/query";
import { getSiteParams } from "@workspace/sanity-config/site";

import { RelatedRecipesLayout } from "@/components/layouts/related-recipes-layout";
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

  const [result] = await handleErrors<{
    data: Array<{
      _id: string;
      name: string;
      slug: string;
      tags: string[] | null;
      meat: string[] | null;
      versions: string[];
      categories: Array<{
        _id: string;
        title: string;
        slug: { current: string };
      }> | null;
      descriptionPlain: "";
      mainImage: {
        id: string;
        preview: string | null;
        hotspot: { x: number; y: number } | null;
        crop: {
          top: number;
          bottom: number;
          left: number;
          right: number;
        } | null;
      } | null;
      sauceLines: string[] | null;
    }>;
  }>(
    sanityFetch({
      query: getRecipesBySauceIdsQuery,
      params: { ...getSiteParams(), sauceIds: ids },
    }),
  );

  if (!result?.data) return null;

  const items = result.data.filter((item): item is RecipeListItem => {
    // Validate required properties
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
  });

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
