import type { JSX } from "react";

import { RelatedRecipesLayout } from "@/components/layouts/related-recipes-layout";
import { sanityFetch } from "@/lib/sanity/live";
import { getRecipesBySauceIdQuery } from "@/lib/sanity/query";
import type { RecipeListItem } from "@/types";
import { handleErrors } from "@/utils";

interface SauceRelatedRecipesSectionProps {
  readonly sauceId: string | undefined;
}

export async function SauceRelatedRecipesSection({
  sauceId,
}: SauceRelatedRecipesSectionProps): Promise<JSX.Element | null> {
  if (!sauceId) return null;

  const [result] = await handleErrors(
    sanityFetch({
      query: getRecipesBySauceIdQuery,
      params: { sauceId },
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
        items.length > 1 ? "Try these recipes featuring this sauce." : undefined
      }
      variant={items.length === 1 ? "single-item-prominent" : "default"}
    />
  );
}
