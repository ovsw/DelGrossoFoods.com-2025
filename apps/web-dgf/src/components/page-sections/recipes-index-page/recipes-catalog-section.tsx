"use client";
import { SectionShell } from "@workspace/ui/components/section-shell";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import { RecipesClient } from "@/components/features/catalog/recipes-client";
import { DEFAULT_STATE, parseSearchParams } from "@/lib/recipes/url";
import { searchParamsToRecord } from "@/lib/search-params";
import type { RecipeCategoryOption, RecipeListItem } from "@/types";

type Props = {
  readonly items: RecipeListItem[];
  readonly categories: RecipeCategoryOption[];
};

function RecipesCatalogSectionContent({ items, categories }: Props) {
  const searchParams = useSearchParams();
  const initialState = useMemo(
    () =>
      searchParams
        ? parseSearchParams(searchParamsToRecord(searchParams))
        : DEFAULT_STATE,
    [searchParams],
  );

  return (
    <RecipesClient
      items={items}
      initialState={initialState}
      categories={categories}
    />
  );
}

export function RecipesCatalogSection({ items, categories }: Props) {
  return (
    <SectionShell
      spacingTop="default"
      spacingBottom="large"
      background="transparent"
      allowOverflow
    >
      <Suspense
        fallback={
          <RecipesClient
            items={items}
            initialState={DEFAULT_STATE}
            categories={categories}
          />
        }
      >
        <RecipesCatalogSectionContent items={items} categories={categories} />
      </Suspense>
    </SectionShell>
  );
}
