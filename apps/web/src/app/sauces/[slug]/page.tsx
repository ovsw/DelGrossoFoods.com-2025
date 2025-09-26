// (kept imports tidy after refactor)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import { RelatedRecipesSection } from "@/components/recipes/related-recipes-section";
import { SauceHeroSection } from "@/components/sauces/sauce-hero-section";
import { SauceNutritionalInfoSection } from "@/components/sauces/sauce-nutritional-info-section";
import { SauceRelatedProductsSection } from "@/components/sauces/sauce-related-products-section";
import { sanityFetch } from "@/lib/sanity/live";
import {
  getProductsBySauceIdQuery,
  getRecipesBySauceIdQuery,
  getSauceBySlugQuery,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type { RecipeListItem, SauceProductListItem } from "@/types";
import { handleErrors } from "@/utils";

async function fetchSauce(slug: string) {
  const normalizedSlug = slug.startsWith("/sauces/")
    ? slug.replace(/^\/sauces\//, "")
    : slug;
  const prefixedSlug = `/sauces/${normalizedSlug}`;
  const [result] = await handleErrors(
    sanityFetch({
      query: getSauceBySlugQuery,
      params: { slug: normalizedSlug, prefixedSlug },
    }),
  );

  return result?.data ?? null;
}

async function fetchRelatedProducts(
  sauceId: string | undefined,
): Promise<SauceProductListItem[]> {
  if (!sauceId) {
    return [];
  }

  const [result] = await handleErrors(
    sanityFetch({
      query: getProductsBySauceIdQuery,
      params: { sauceId },
    }),
  );

  return (result?.data ?? []) as SauceProductListItem[];
}

async function fetchRelatedRecipes(
  sauceId: string | undefined,
): Promise<RecipeListItem[]> {
  if (!sauceId) {
    return [];
  }

  const [result] = await handleErrors(
    sanityFetch({
      query: getRecipesBySauceIdQuery,
      params: { sauceId },
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
  const sauce = await fetchSauce(slug);

  if (!sauce) {
    return getSEOMetadata({
      title: `Sauce: ${slug}`,
      description: "Discover our family sauces.",
      slug: `/sauces/${slug}`,
      pageType: "article",
    });
  }

  const rawName = sauce.name ?? slug;
  const cleanedName = stegaClean(rawName);
  const name = (
    typeof cleanedName === "string" ? cleanedName : String(rawName)
  ).trim();
  const cleanedDescription = stegaClean(sauce.descriptionPlain ?? "");
  const description = (
    typeof cleanedDescription === "string"
      ? cleanedDescription
      : String(sauce.descriptionPlain ?? "")
  ).trim();

  return getSEOMetadata({
    title: name || `Sauce: ${slug}`,
    description:
      description ||
      `Learn more about ${name || "this sauce"} from La Famiglia DelGrosso.`,
    slug: `/sauces/${slug}`,
    contentId: sauce._id,
    contentType: sauce._type,
    pageType: "article",
  });
}

export default async function SauceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sauce = await fetchSauce(slug);

  if (!sauce) {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(sauce._id);
  const relatedRecipes = await fetchRelatedRecipes(sauce._id);
  const hasRelatedProducts = relatedProducts.length > 0;
  const hasRelatedRecipes = relatedRecipes.length > 0;
  // relatedProducts rendered via SauceRelatedProducts

  return (
    <main>
      <SauceHeroSection sauce={sauce} />
      <SauceNutritionalInfoSection sauce={sauce} />
      {hasRelatedProducts ? (
        <SauceRelatedProductsSection products={relatedProducts} />
      ) : null}
      {hasRelatedRecipes ? (
        <RelatedRecipesSection recipes={relatedRecipes} />
      ) : null}
    </main>
  );
}
