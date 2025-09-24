import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import { SanityButtons } from "@/components/elements/sanity-buttons";
import { ProductCard } from "@/components/products/product-card";
import { SauceHero } from "@/components/sauces/sauce-hero";
import { SauceNutritionalInfo } from "@/components/sauces/sauce-nutritional-info";
import { sanityFetch } from "@/lib/sanity/live";
import {
  getProductsBySauceIdQuery,
  getSauceBySlugQuery,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type { SanityButtonProps, SauceProductListItem } from "@/types";
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
  const hasRelatedProducts = relatedProducts.length > 0;
  const primaryCta: SanityButtonProps = {
    _key: "order-online-cta",
    _type: "button",
    text: "Shop all products",
    variant: "default",
    href: "/store",
    openInNewTab: false,
  };
  const relatedCopy = "Pick a bundle and stock up straight from our store.";

  return (
    <main>
      <SauceHero sauce={sauce} />
      <SauceNutritionalInfo sauce={sauce} />
      {hasRelatedProducts ? (
        <Section id="related-products" spacingTop="large" spacingBottom="large">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <Eyebrow text="Order online" />
              <h2 className="mt-4 text-3xl font-semibold text-balance md:text-5xl">
                Bring DelGrosso sauces to your pantry
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
                {relatedCopy}
              </p>
              <SanityButtons
                buttons={[primaryCta]}
                className="mt-6"
                buttonClassName="w-full sm:w-auto"
              />
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} item={product} />
              ))}
            </div>
          </div>
        </Section>
      ) : null}
    </main>
  );
}
