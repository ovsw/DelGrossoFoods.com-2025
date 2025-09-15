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

export async function generateMetadata() {
  const { data: result } = await sanityFetch({
    query: getSauceIndexPageQuery,
    stega: false,
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
  return await handleErrors(
    sanityFetch({ query: getAllSaucesForIndexQuery, stega: false }),
  );
}

async function fetchIndexCopy() {
  return await handleErrors(
    sanityFetch({ query: getSauceIndexPageQuery, stega: false }),
  );
}

export default async function SaucesIndexPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
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

  const initialState: SauceQueryState = parseSearchParams(searchParams ?? {});

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
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
          {/* Client manages state; SSR computes same initial results to avoid flash */}
          <SaucesClient items={items} initialState={initialState} />
        </div>
      </div>
    </main>
  );
}
