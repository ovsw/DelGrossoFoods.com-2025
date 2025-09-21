import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RecipesClient } from "@/components/recipes/recipes-client";
import { parseSearchParams, type RecipeQueryState } from "@/lib/recipes/url";
import { sanityFetch } from "@/lib/sanity/live";
import {
  getAllRecipeCategoriesQuery,
  getAllRecipesForIndexQuery,
  getRecipeIndexPageQuery,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type {
  RecipeCategoryOption,
  RecipeIndexPageData,
  RecipeListItem,
} from "@/types";
import { handleErrors } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [result] = await handleErrors(
    sanityFetch({
      query: getRecipeIndexPageQuery,
    }),
  );
  const data = (result?.data ?? null) as RecipeIndexPageData | null;
  return getSEOMetadata(
    data
      ? {
          title: data?.title ?? "",
          description: data?.description ?? "",
          slug: "/recipes",
          contentId: data?._id,
          contentType: data?._type,
        }
      : {
          title: "Delicious Recipes",
          description: "Explore family recipes made with DelGrosso sauces.",
          slug: "/recipes",
        },
  );
}

async function fetchRecipes() {
  return await handleErrors(sanityFetch({ query: getAllRecipesForIndexQuery }));
}
async function fetchIndexCopy() {
  return await handleErrors(sanityFetch({ query: getRecipeIndexPageQuery }));
}
async function fetchCategories() {
  return await handleErrors(
    sanityFetch({ query: getAllRecipeCategoriesQuery }),
  );
}

export default async function RecipesIndexPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [recipesRes, copyRes, catsRes] = await Promise.all([
    fetchRecipes(),
    fetchIndexCopy(),
    fetchCategories(),
  ]);
  const [recipesData, recipesErr] = recipesRes;
  const [copyData] = copyRes;
  const [catsData] = catsRes;
  if (recipesErr) notFound();

  const indexDoc = (copyData?.data ?? null) as RecipeIndexPageData | null;
  const items = (recipesData?.data ?? []) as RecipeListItem[];
  const categories = (catsData?.data ?? []) as {
    _id: string;
    title: string;
  }[] as RecipeCategoryOption[];

  const resolvedSearchParams = (await searchParams) ?? {};
  const initialState: RecipeQueryState =
    parseSearchParams(resolvedSearchParams);

  const heading = indexDoc?.title ?? "Delicious Recipes";
  const intro =
    indexDoc?.description ??
    "Need an idea for your next meal or some inspiration for your next family feast? Try these DelGrosso family recipes, all based around our Premium Sauces.";

  return (
    <main>
      <div className="container py-40 md:py-60 mx-auto px-4 md:px-6">
        <div className="max-w-3xl text-start">
          <h1 className="text-3xl font-bold sm:text-5xl text-brand-green">
            {heading}
          </h1>
          <p className="mt-4 text-xl leading-8 text-muted-foreground">
            {intro}
          </p>
        </div>
        <div className="mt-16">
          <RecipesClient
            items={items}
            initialState={initialState}
            categories={categories}
          />
        </div>
      </div>
    </main>
  );
}
