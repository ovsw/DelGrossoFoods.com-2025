import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductsCatalogSection } from "@/components/page-sections/products-index-page/products-catalog-section";
import { parseSearchParams, type ProductQueryState } from "@/lib/products/url";
import { sanityFetch } from "@/lib/sanity/live";
import {
  getAllProductsForIndexQuery,
  getProductIndexPageQuery,
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import type { ProductIndexPageData, ProductListItem } from "@/types";
import { handleErrors } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [result] = await handleErrors(
    sanityFetch({
      query: getProductIndexPageQuery,
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
  return await handleErrors(sanityFetch({ query: getProductIndexPageQuery }));
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

  const heading = indexDoc?.title ?? "Premium Sauces";
  const intro =
    indexDoc?.description ??
    "Discover the Heart of Authentic Italian Flavor with Our Original Pasta, Pizza and Sandwich Sauces.";

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
        <ProductsCatalogSection items={items} initialState={initialState} />
      </div>
    </main>
  );
}
