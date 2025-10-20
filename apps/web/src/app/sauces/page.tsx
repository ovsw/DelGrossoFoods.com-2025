import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SaucesCatalogSection } from "@/components/page-sections/sauces-index-page/sauces-catalog-section";
import { PageHeadingSection } from "@/components/page-sections/shared/page-heading-section";
import { sanityFetch } from "@/lib/sanity/live";
import {
  getAllSaucesForIndexQuery,
  getSauceIndexPageQuery,
} from "@/lib/sanity/query";
import { parseSearchParams, type SauceQueryState } from "@/lib/sauces/url";
import { getSEOMetadata } from "@/lib/seo";
import type { SauceIndexPageData, SauceListItem } from "@/types";
import { handleErrors } from "@/utils";
// import { draftMode } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const [result] = await handleErrors(
    sanityFetch({
      query: getSauceIndexPageQuery,
    }),
  );

  const data = (result?.data ?? null) as SauceIndexPageData | null;
  return getSEOMetadata(
    data
      ? {
          title: data?.title ?? "",
          description: data?.description ?? "",
          slug: "/sauces",
          contentId: data?._id,
          contentType: data?._type,
        }
      : {
          title: "Premium Sauces",
          description:
            "Discover the Heart of Authentic Italian Flavor with Our Original Pasta, Pizza and Sandwich Sauces.",
          slug: "/sauces",
        },
  );
}

async function fetchSauces() {
  return await handleErrors(sanityFetch({ query: getAllSaucesForIndexQuery }));
}

async function fetchIndexCopy() {
  return await handleErrors(sanityFetch({ query: getSauceIndexPageQuery }));
}

export default async function SaucesIndexPage({
  searchParams,
}: {
  // Next.js 15: searchParams is now async and must be awaited
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [saucesRes, copyRes] = await Promise.all([
    fetchSauces(),
    fetchIndexCopy(),
  ]);
  const [saucesData, saucesErr] = saucesRes;
  const [copyData] = copyRes;
  if (saucesErr) notFound();

  const indexDoc = (copyData?.data ?? null) as SauceIndexPageData | null;
  const items = (saucesData?.data ?? []) as SauceListItem[];

  const resolvedSearchParams = (await searchParams) ?? {};
  const initialState: SauceQueryState = parseSearchParams(resolvedSearchParams);

  // Fallback copy so the page always shows intro even if CMS data is missing
  const eyebrow = indexDoc?.eyebrow ?? null;
  const heading = indexDoc?.title ?? "Premium Sauces";
  const intro =
    indexDoc?.description ??
    "Discover the Heart of Authentic Italian Flavor with Our Original Pasta, Pizza and Sandwich Sauces.";

  return (
    <main>
      <PageHeadingSection
        eyebrow={eyebrow}
        title={heading}
        description={intro}
      />
      <SaucesCatalogSection items={items} initialState={initialState} />
    </main>
  );
}
