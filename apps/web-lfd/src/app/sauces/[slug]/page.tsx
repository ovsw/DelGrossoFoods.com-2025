// (kept imports tidy after refactor)
import { sanityFetch } from "@workspace/sanity-config/live";
import { getSauceBySlugQuery } from "@workspace/sanity-config/query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import { SauceHeroSection } from "@/components/page-sections/sauce-page/sauce-hero-section";
import { SauceNutritionalInfoSection } from "@/components/page-sections/sauce-page/sauce-nutritional-info-section";
import { SauceRelatedProductsSection } from "@/components/page-sections/sauce-page/sauce-related-products-section";
import { SauceRelatedRecipesSection } from "@/components/page-sections/sauce-page/sauce-related-recipes-section";
import { getSEOMetadata } from "@/lib/seo";
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

  // Related recipes are fetched within the page section

  return (
    <main>
      <SauceHeroSection sauce={sauce} />
      <SauceNutritionalInfoSection sauce={sauce} />
      <SauceRelatedProductsSection sauceId={sauce._id} />
      <SauceRelatedRecipesSection sauceId={sauce._id} sauceName={sauce.name} />
    </main>
  );
}
