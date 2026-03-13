import { sanityFetch } from "@workspace/sanity-config/live";
import { getAllSaucesForIndexQuery } from "@workspace/sanity-config/query";
import { getSiteParams } from "@workspace/sanity-config/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SaucesCatalogSection } from "@/components/page-sections/sauces-index-page/sauces-catalog-section";
import { PageHeadingSection } from "@/components/page-sections/shared/page-heading-section";
import { dgfSauceIndexPageQuery } from "@/lib/sanity/queries";
import { parseSearchParams } from "@/lib/sauces/url";
import { getSEOMetadata } from "@/lib/seo";
import type { SauceIndexPageData, SauceListItem } from "@/types";
import { handleErrors } from "@/utils";
// import { draftMode } from "next/headers";

type CatalogSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export async function generateMetadata(): Promise<Metadata> {
  const [result] = await handleErrors(
    sanityFetch({
      query: dgfSauceIndexPageQuery,
      params: getSiteParams(),
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
  return await handleErrors(
    sanityFetch({ query: getAllSaucesForIndexQuery, params: { line: null } }),
  );
}

async function fetchIndexCopy() {
  return await handleErrors(
    sanityFetch({ query: dgfSauceIndexPageQuery, params: getSiteParams() }),
  );
}

export default async function SaucesIndexPage({
  searchParams,
}: {
  searchParams?: CatalogSearchParams;
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
      <SaucesCatalogSection items={items} initialState={initialState} />
    </>
  );
}
