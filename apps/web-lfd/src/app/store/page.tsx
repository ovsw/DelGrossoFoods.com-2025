import { sanityFetch } from "@workspace/sanity-config/live";
import { getAllProductsForIndexQuery } from "@workspace/sanity-config/query";
import { getSiteParams } from "@workspace/sanity-config/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductsCatalogSection } from "@/components/page-sections/products-index-page/products-catalog-section";
import { PageHeadingSection } from "@/components/page-sections/shared/page-heading-section";
import { parseSearchParams, type ProductQueryState } from "@/lib/products/url";
import { lfdProductIndexPageQuery } from "@/lib/sanity/queries";
import { getSEOMetadata } from "@/lib/seo";
import type { ProductIndexPageData, ProductListItem } from "@/types";
import { handleErrors } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [result] = await handleErrors(
    sanityFetch({
      query: lfdProductIndexPageQuery,
      params: getSiteParams(),
    }),
  );
  const data = (result?.data ?? null) as ProductIndexPageData | null;
  return getSEOMetadata(
    data
      ? {
          title: data?.title ?? "",
          description: data?.description ?? "",
          slug: "/store",
          contentId: data?._id,
          contentType: data?._type,
        }
      : {
          title: "Premium Sauces",
          description:
            "Discover the Heart of Authentic Italian Flavor with Our Original Pasta, Pizza and Sandwich Sauces.",
          slug: "/store",
        },
  );
}

async function fetchProducts() {
  return await handleErrors(
    sanityFetch({ query: getAllProductsForIndexQuery }),
  );
}

async function fetchIndexCopy() {
  return await handleErrors(
    sanityFetch({ query: lfdProductIndexPageQuery, params: getSiteParams() }),
  );
}

export default async function ProductsIndexPage({
  searchParams,
}: {
  // Next.js 15: searchParams is async
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [productsRes, copyRes] = await Promise.all([
    fetchProducts(),
    fetchIndexCopy(),
  ]);
  const [productsData, productsErr] = productsRes;
  const [copyData] = copyRes;
  if (productsErr) notFound();

  const indexDoc = (copyData?.data ?? null) as ProductIndexPageData | null;
  const items = (productsData?.data ?? []) as ProductListItem[];

  const resolvedSearchParams = (await searchParams) ?? {};
  const initialState: ProductQueryState =
    parseSearchParams(resolvedSearchParams);

  const eyebrow = null;
  const heading = indexDoc?.title ?? "<< click to edit this heading >>";
  const intro = indexDoc?.description ?? "<< click to edit this description >>";
  const backgroundImage = indexDoc?.pageHeaderImage ?? null;

  return (
    <main>
      <PageHeadingSection
        eyebrow={eyebrow}
        title={heading}
        description={intro}
        backgroundImage={backgroundImage}
        sanityDocumentId={indexDoc?._id}
        sanityDocumentType={indexDoc?._type}
      />
      <ProductsCatalogSection items={items} initialState={initialState} />
    </main>
  );
}
