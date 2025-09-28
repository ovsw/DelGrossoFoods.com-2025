// (kept imports tidy after refactor)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import { RecipeHeroSection } from "@/components/recipes/recipe-hero-section";
import { RelatedRecipesSection } from "@/components/recipes/related-recipes-section";
import { sanityFetch } from "@/lib/sanity/live";
import {
  getRecipeBySlugQuery,
  getRecipesBySauceIdsQuery,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type { RecipeDetailData, RecipeListItem } from "@/types";
import { handleErrors } from "@/utils";

async function fetchRecipe(slug: string): Promise<RecipeDetailData | null> {
  const normalizedSlug = slug.startsWith("/recipes/")
    ? slug.replace(/^\/recipes\//, "")
    : slug;
  const prefixedSlug = `/recipes/${normalizedSlug}`;
  const [result] = await handleErrors(
    sanityFetch({
      query: getRecipeBySlugQuery,
      params: { slug: normalizedSlug, prefixedSlug },
    }),
  );

  return (result?.data ?? null) as RecipeDetailData | null;
}

async function fetchRelatedRecipes(
  sauceIds: readonly string[] | undefined,
): Promise<RecipeListItem[]> {
  const ids = (sauceIds ?? []).filter(
    (id): id is string => typeof id === "string" && id.length > 0,
  );
  if (ids.length === 0) {
    return [];
  }

  const [result] = await handleErrors(
    sanityFetch({
      query: getRecipesBySauceIdsQuery,
      params: { sauceIds: ids },
    }),
  );
  return (result?.data ?? []) as RecipeListItem[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await fetchRecipe(slug);

  if (!recipe) {
    return getSEOMetadata({
      title: `Recipe: ${slug}`,
      description: "Discover delicious family recipes.",
      slug: `/recipes/${slug}`,
      pageType: "article",
    });
  }

  const rawName = recipe.name ?? slug;
  const cleanedName = stegaClean(rawName);
  const name = (
    typeof cleanedName === "string" ? cleanedName : String(rawName)
  ).trim();

  // Get first few sentences of ingredients or directions as description
  const description =
    recipe.dgfIngredients?.[0]?.children?.[0]?.text ||
    recipe.lfdIngredients?.[0]?.children?.[0]?.text ||
    `Learn how to make ${name} with La Famiglia DelGrosso sauces.`;

  return getSEOMetadata({
    title: name || `Recipe: ${slug}`,
    description:
      description.length > 160
        ? `${description.substring(0, 157)}...`
        : description,
    slug: `/recipes/${slug}`,
    contentId: recipe._id,
    contentType: recipe._type,
    pageType: "article",
  });
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await fetchRecipe(slug);

  if (!recipe) {
    notFound();
  }

  // Get all sauce IDs from both DGF and LFD versions
  const dgfSauceIds =
    recipe.dgfSauces?.map((sauce) => sauce._id).filter(Boolean) ?? [];
  const lfdSauceIds =
    recipe.lfdSauces?.map((sauce) => sauce._id).filter(Boolean) ?? [];
  const allSauceIds = Array.from(new Set([...dgfSauceIds, ...lfdSauceIds]));

  const relatedRecipes = await fetchRelatedRecipes(allSauceIds);
  const hasRelatedRecipes = relatedRecipes.length > 0;

  return (
    <main>
      <RecipeHeroSection recipe={recipe} />

      {/* Recipe content sections will go here */}
      <div className="container mx-auto px-4 py-8">
        {/* Recipe details will be added in the next steps */}
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">
            Recipe detail sections will be implemented next.
          </p>
        </div>
      </div>

      {hasRelatedRecipes ? (
        <RelatedRecipesSection recipes={relatedRecipes} />
      ) : null}
    </main>
  );
}
