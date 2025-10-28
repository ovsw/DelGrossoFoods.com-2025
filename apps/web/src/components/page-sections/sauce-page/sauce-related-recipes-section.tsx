import type { JSX } from "react";

import { RelatedRecipesLayout } from "@/components/layouts/related-recipes-layout";
import { sanityFetch } from "@/lib/sanity/live";
import { getRecipesBySauceIdQuery } from "@/lib/sanity/query";
import type { RecipeListItem } from "@/types";
import { handleErrors } from "@/utils";

interface SauceRelatedRecipesSectionProps {
  readonly sauceId: string | undefined;
  readonly sauceName?: string | null;
}

export async function SauceRelatedRecipesSection({
  sauceId,
  sauceName,
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
  const hasMultipleItems = items.length > 1;
  const heading =
    hasMultipleItems && sauceName
      ? `${sauceName} Recipes`
      : hasMultipleItems
        ? "Recipes for this sauce"
        : undefined;

  return (
    <RelatedRecipesLayout
      items={items}
      title={heading}
      eyebrow={hasMultipleItems ? "Recipe ideas" : undefined}
      description={
        hasMultipleItems ? "Try these recipes featuring this sauce." : undefined
      }
      variant={items.length === 1 ? "single-item-prominent" : "default"}
    />
  );
}
