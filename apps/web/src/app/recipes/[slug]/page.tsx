// (kept imports tidy after refactor)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import { RecipeHeroSection } from "@/components/page-sections/recipe-page/hero-section";
import { RecipeRelatedSaucesSection } from "@/components/page-sections/recipe-page/related-sauces-section";
import { RecipeDetailsSection } from "@/components/recipes/recipe-details-section";
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
  const descriptionSource =
    recipe.dgfIngredients?.[0]?.children?.[0]?.text ||
    recipe.lfdIngredients?.[0]?.children?.[0]?.text;

  const descriptionClean = descriptionSource
    ? stegaClean(descriptionSource).trim()
    : null;

  const description =
    descriptionClean ||
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
  const filteredRelatedRecipes = relatedRecipes.filter(
    (r) => r._id !== recipe._id,
  );
  const hasRelatedRecipes = filteredRelatedRecipes.length > 0;

  return (
    <main>
      <RecipeHeroSection recipe={recipe} />

      <RecipeDetailsSection recipe={recipe} />

      <RecipeRelatedSaucesSection recipeId={recipe._id} />

      {hasRelatedRecipes ? (
        <RelatedRecipesSection recipes={filteredRelatedRecipes} />
      ) : null}
    </main>
  );
}
