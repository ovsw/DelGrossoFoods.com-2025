// (kept imports tidy after refactor)
import { sanityFetch } from "@workspace/sanity-config/live";
import {
  getAllRecipeSlugsForStaticParamsQuery,
  getRecipeBySlugQuery,
} from "@workspace/sanity-config/query";
import { getSiteParams } from "@workspace/sanity-config/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import { RecipeDetailsSection } from "@/components/page-sections/recipe-page/recipe-details-section";
import { RecipeHeroSection } from "@/components/page-sections/recipe-page/recipe-hero-section";
import { RecipeRelatedRecipesSection } from "@/components/page-sections/recipe-page/recipe-related-recipes-section";
import { RecipeRelatedSaucesSection } from "@/components/page-sections/recipe-page/recipe-related-sauces-section";
import { getSEOMetadata } from "@/lib/seo";
import type { RecipeDetailData } from "@/types";
import { handleErrors } from "@/utils";

async function fetchRecipe(slug: string): Promise<RecipeDetailData | null> {
  const normalizedSlug = slug.startsWith("/recipes/")
    ? slug.replace(/^\/recipes\//, "")
    : slug;
  const prefixedSlug = `/recipes/${normalizedSlug}`;
  const [result] = await handleErrors(
    sanityFetch({
      query: getRecipeBySlugQuery,
      params: {
        ...getSiteParams(),
        slug: normalizedSlug,
        prefixedSlug,
      },
    }),
  );

  return (result?.data ?? null) as RecipeDetailData | null;
}

function normalizeRecipeStaticSlug(slug: string): string {
  return slug.replace(/^\/recipes\//, "");
}

function getRelatedSauceIds(recipe: RecipeDetailData): string[] {
  return Array.from(
    new Set(
      [
        ...(recipe.dgfSauces ?? []).map((sauce) => sauce?._id),
        ...(recipe.lfdSauces ?? []).map((sauce) => sauce?._id),
        recipe.organicSauce?._id,
      ]
        .filter((id): id is string => typeof id === "string" && id.length > 0)
        .map((id) => id.replace(/^drafts\./, "")),
    ),
  );
}

async function fetchRecipeStaticParams(): Promise<Array<{ slug: string }>> {
  const [result] = await handleErrors<{ data: unknown }>(
    sanityFetch({
      query: getAllRecipeSlugsForStaticParamsQuery,
      params: getSiteParams(),
      perspective: "published",
      stega: false,
    }),
  );
  const data = result?.data;

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    )
    .map(normalizeRecipeStaticSlug)
    .filter((slug) => slug.length > 0)
    .map((slug) => ({ slug }));
}

// Related recipes fetched within the page section

export async function generateStaticParams() {
  return await fetchRecipeStaticParams();
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
    recipe.ingredients?.[0]?.children?.[0]?.text ||
    recipe.directions?.[0]?.children?.[0]?.text;

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

  const sauceIds = getRelatedSauceIds(recipe);

  // Related recipes are fetched within the page section

  return (
    <>
      <RecipeHeroSection recipe={recipe} />

      <RecipeDetailsSection recipe={recipe} />

      <RecipeRelatedSaucesSection sauceIds={sauceIds} />

      <RecipeRelatedRecipesSection recipeId={recipe._id} sauceIds={sauceIds} />
    </>
  );
}
