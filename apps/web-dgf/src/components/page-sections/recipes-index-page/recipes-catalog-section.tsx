"use client";
import { SectionShell } from "@workspace/ui/components/section-shell";

import { RecipesClient } from "@/components/features/catalog/recipes-client";
import type { RecipeQueryState } from "@/lib/recipes/url";
import type { RecipeCategoryOption, RecipeListItem } from "@/types";

type Props = {
  readonly items: RecipeListItem[];
  readonly initialState: RecipeQueryState;
  readonly categories: RecipeCategoryOption[];
};

export function RecipesCatalogSection({
  items,
  initialState,
  categories,
}: Props) {
  return (
    <SectionShell
      spacingTop="default"
      spacingBottom="large"
      background="transparent"
      allowOverflow
    >
      <RecipesClient
        items={items}
        initialState={initialState}
        categories={categories}
      />
    </SectionShell>
  );
}
