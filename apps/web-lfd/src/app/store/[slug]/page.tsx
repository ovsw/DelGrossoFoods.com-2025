import { sanityFetch } from "@workspace/sanity-config/live";
import { getProductBySlugQuery } from "@workspace/sanity-config/query";
import type { GetProductBySlugQueryResult } from "@workspace/sanity-config/types";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import { SauceCard } from "@/components/elements/sauce-card";
import { SingleSauceFeature } from "@/components/features/single-sauce-feature";
import { ProductHeroSection } from "@/components/page-sections/product-page/product-hero-section";
import { ProductRelatedRecipesSection } from "@/components/page-sections/product-page/product-related-recipes-section";
import { ProductSummarySection } from "@/components/page-sections/product-page/product-summary-section";
import { getPackagingText } from "@/config/product-taxonomy";
import { getSEOMetadata } from "@/lib/seo";
import type { ProductDetailData, SauceListItem } from "@/types";
import { handleErrors } from "@/utils";

const shippingCategoryCopy: Record<
  "normal_item" | "large_crate" | "gift_pack",
  string
> = {
  normal_item: "Normal Item (ships together with other items)",
  large_crate: "Large Crate (ships separately from other items)",
  gift_pack: "Gift Pack (ships two per large box)",
};

function cleanForLogic(value: unknown): string {
  if (!value) return "";
  const raw = typeof value === "string" ? value : String(value);
  const cleaned = stegaClean(raw);
  if (typeof cleaned === "string") {
    return cleaned.trim();
  }
  return raw.trim();
}

function formatUSD(value: number | null | undefined): string | null {
  if (value == null) return null;
  const hasCents = Math.round(value * 100) % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(value);
}

function formatWeight(value: number | null | undefined): string | null {
  if (value == null) return null;
  const isInteger = Number.isInteger(value);
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: isInteger ? 0 : 2,
  }).format(value)} lb`;
}

type ProductSauce = NonNullable<ProductDetailData["sauces"]>[number];

function toSauceListItem(
  sauce: ProductSauce | null | undefined,
): SauceListItem | null {
  if (!sauce?.mainImage) {
    return null;
  }

  const mainImage = sauce.mainImage;

  return {
    ...sauce,
    mainImage: {
      ...mainImage,
      alt: mainImage.alt ?? "",
    },
  };
}

async function fetchProduct(slug: string): Promise<ProductDetailData | null> {
  const normalizedSlug = slug.startsWith("/store/")
    ? slug.replace(/^\/store\//, "")
    : slug;
  const prefixedSlug = `/store/${normalizedSlug}`;
  const [result] = await handleErrors<{ data: GetProductBySlugQueryResult }>(
    sanityFetch({
      query: getProductBySlugQuery,
      params: { slug: normalizedSlug, prefixedSlug },
    }),
  );

  const product = result?.data ?? null;
  if (!product) {
    return null;
  }
  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return getSEOMetadata({
      title: `Product: ${slug}`,
      description: "Explore our premium products.",
      slug: `/store/${slug}`,
      pageType: "article",
    });
  }

  const rawName = product.name ?? slug;
  const cleanedName = stegaClean(rawName);
  const name =
    typeof cleanedName === "string" && cleanedName.trim().length > 0
      ? cleanedName.trim()
      : String(rawName).trim();

  const rawDescription = product.descriptionPlain ?? "";
  const cleanedDescription = stegaClean(rawDescription);
  const description =
    typeof cleanedDescription === "string" &&
    cleanedDescription.trim().length > 0
      ? cleanedDescription.trim()
      : String(rawDescription).trim();

  return getSEOMetadata({
    title: name || `Product: ${slug}`,
    description:
      description ||
      `Take a closer look at ${name || "this product"} from La Famiglia DelGrosso.`,
    slug: `/store/${slug}`,
    contentId: product._id,
    contentType: product._type,
    pageType: "article",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  const packagingLabel = getPackagingText(product.category);
  const priceText = formatUSD(
    typeof product.price === "number" ? product.price : null,
  );
  const weightText = formatWeight(
    typeof product.weight === "number" ? product.weight : null,
  );
  const shippingKey = cleanForLogic(
    product.shippingCategory,
  ) as keyof typeof shippingCategoryCopy;
  const shippingText = shippingCategoryCopy[shippingKey] ?? null;
  const rawSauces = product.sauces ?? [];
  const associatedSauces = rawSauces
    .map(toSauceListItem)
    .filter((sauce): sauce is SauceListItem => sauce !== null);

  const hasOneSauce = associatedSauces.length === 1;
  const hasManySauces = associatedSauces.length > 1;

  // Derive published sauce IDs (drop drafts) for querying related recipes
  const sauceIds = Array.from(
    new Set(
      rawSauces
        .map((s) => s?._id)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
        .map((id) => id.replace(/^drafts\./, "")),
    ),
  );
  // Related recipes are fetched within the page section

  return (
    <main>
      <ProductHeroSection product={product} />

      <ProductSummarySection
        product={product}
        packagingLabel={packagingLabel}
        priceText={priceText}
        weightText={weightText}
        shippingText={shippingText}
      />

      {associatedSauces.length > 0 ? (
        <Section spacingTop="large" spacingBottom="large" id="related-sauces">
          <div className="container mx-auto px-4 md:px-6">
            {hasOneSauce ? (
              <SingleSauceFeature item={associatedSauces[0]!} />
            ) : hasManySauces ? (
              <>
                <div className="text-center">
                  <Eyebrow text="Pairs well with" />
                  <h2 className="heading-section">Complementary sauces</h2>
                  <p className="mt-4 text-muted-foreground">
                    Build your next meal with these favorites from La Famiglia
                    DelGrosso.
                  </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {associatedSauces.map((sauce) => (
                    <SauceCard key={sauce._id} item={sauce} />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </Section>
      ) : null}

      <ProductRelatedRecipesSection sauceIds={sauceIds} />
    </main>
  );
}
