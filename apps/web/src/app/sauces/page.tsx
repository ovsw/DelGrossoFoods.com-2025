import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SaucesClient } from "@/components/sauces/sauces-client";
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
  const { data: result } = await sanityFetch({
    query: getSauceIndexPageQuery,
  });

  const data = result as SauceIndexPageData | null;
  return getSEOMetadata(
    data
      ? {
          title: data?.title ?? "",
          description: data?.description ?? "",
          slug: "/sauces",
          contentId: data?._id,
          contentType: data?._type,
        }
      : {},
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

  return (
    <main>
      <div className="container py-60 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {indexDoc?.title ?? "Sauces"}
          </h1>
          {indexDoc?.description ? (
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {indexDoc.description}
            </p>
          ) : null}
        </div>

        <div className="mt-8">
          <SaucesClient items={items} initialState={initialState} />
        </div>
      </div>
    </main>
  );
}
