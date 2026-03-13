import { sanityFetch } from "@workspace/sanity-config/live";
import { getAllProductsForIndexQuery } from "@workspace/sanity-config/query";
import { getSiteParams } from "@workspace/sanity-config/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductsCatalogSection } from "@/components/page-sections/products-index-page/products-catalog-section";
import { PageHeadingSection } from "@/components/page-sections/shared/page-heading-section";
import { parseSearchParams } from "@/lib/products/url";
import { dgfProductIndexPageQuery } from "@/lib/sanity/queries";
import { getSEOMetadata } from "@/lib/seo";
import type { ProductIndexPageData, ProductListItem } from "@/types";
import { handleErrors } from "@/utils";

type CatalogSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export async function generateMetadata(): Promise<Metadata> {
  const [result] = await handleErrors(
    sanityFetch({
      query: dgfProductIndexPageQuery,
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
    sanityFetch({
      query: getAllProductsForIndexQuery,
      params: { excludeLines: null },
    }),
  );
}

async function fetchIndexCopy() {
  return await handleErrors(
    sanityFetch({ query: dgfProductIndexPageQuery, params: getSiteParams() }),
  );
}

export default async function ProductsIndexPage({
  searchParams,
}: {
  searchParams?: CatalogSearchParams;
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

  const eyebrow = null;
  const heading = indexDoc?.title ?? null;
  const intro = indexDoc?.description ?? null;
  const backgroundImage = indexDoc?.pageHeaderImage ?? null;
  const initialState = parseSearchParams((await searchParams) ?? {});

  return (
    <>
      <PageHeadingSection
        eyebrow={eyebrow}
        title={heading}
        description={intro}
        backgroundImage={backgroundImage}
        sanityDocumentId={indexDoc?._id}
        sanityDocumentType={indexDoc?._type}
      />
      <ProductsCatalogSection items={items} initialState={initialState} />
    </>
  );
}
