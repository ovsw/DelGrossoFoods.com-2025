"use client";
import { Section } from "@workspace/ui/components/section";

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
    <Section spacingTop="default" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6">
        <RecipesClient
          items={items}
          initialState={initialState}
          categories={categories}
        />
      </div>
    </Section>
  );
}
