import { sanityFetch } from "@workspace/sanity-config/live";
import { getSiteParams } from "@workspace/sanity-config/site";
import type { LfdStoreLocatorPageQueryResult } from "@workspace/sanity-config/types";
import { Section } from "@workspace/ui/components/section";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

import { WhereToBuyClient } from "@/components/features/where-to-buy/where-to-buy-client";
import { WhereToBuyHeroSection } from "@/components/page-sections/where-to-buy/where-to-buy-hero-section";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import {
  lfdRetailersQuery,
  lfdStoreLocatorPageQuery,
} from "@/lib/sanity/queries";
import { getSEOMetadata } from "@/lib/seo";
import {
  buildWhereToBuyData,
  type RetailerDocument,
} from "@/lib/where-to-buy/retailers";

export async function generateMetadata(): Promise<Metadata> {
  const storeLocatorData = await sanityFetch({
    query: lfdStoreLocatorPageQuery,
    params: getSiteParams(),
  });

  const data = (storeLocatorData?.data ??
    null) as LfdStoreLocatorPageQueryResult | null;

  const rawTitle = data?.title ?? null;
  const rawDescription = data?.description ?? null;

  const cleanTitle = rawTitle ? stegaClean(rawTitle) : null;
  const cleanDescription = rawDescription ? stegaClean(rawDescription) : null;

  return getSEOMetadata({
    title: cleanTitle
      ? `${cleanTitle} - DelGrosso Foods`
      : "Where to Buy - DelGrosso Foods",
    description:
      cleanDescription ||
      "Find La Famiglia DelGrosso Pasta and Pizza Sauces at a store near you. Available in grocery stores across the United States.",
    slug: data?.slug || "/where-to-buy",
  });
}

export default async function WhereToBuyPage() {
  const [storeLocatorData, retailersData] = await Promise.all([
    sanityFetch({
      query: lfdStoreLocatorPageQuery,
      params: getSiteParams(),
    }),
    sanityFetch({
      query: lfdRetailersQuery,
      params: getSiteParams(),
    }),
  ]);

  const data = (storeLocatorData?.data ??
    null) as LfdStoreLocatorPageQueryResult | null;
  const retailers = (retailersData?.data ?? []) as RetailerDocument[];
  const { storeLocations, allStates, productLineLabels, productFilterOptions } =
    buildWhereToBuyData(retailers);

  const heading = data?.title || "Find DelGrosso Near You";
  const intro =
    data?.description ||
    "La Famiglia DelGrosso Pasta and Pizza Sauces are available at fine grocery stores across the United States. Select your state to find stores near you.";
  const documentId = data?._id ?? null;
  const documentType = data?._type ?? null;
  const titleAttribute = createPresentationDataAttribute({
    documentId,
    documentType,
    path: "title",
  });
  const descriptionAttribute = createPresentationDataAttribute({
    documentId,
    documentType,
    path: "description",
  });

  return (
    <main>
      <WhereToBuyHeroSection />
      <Section spacingTop="default" spacingBottom="default">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl text-start">
            <h1
              className="text-3xl font-bold sm:text-5xl text-brand-green"
              data-sanity={titleAttribute ?? undefined}
            >
              {heading}
            </h1>
            <p
              className="mt-4 text-xl leading-8 text-muted-foreground"
              data-sanity={descriptionAttribute ?? undefined}
            >
              {intro}
            </p>
          </div>

          <WhereToBuyClient
            sanityDocumentId={documentId}
            sanityDocumentType={documentType}
            allStates={allStates}
            storeLocations={storeLocations}
            productLineLabels={productLineLabels}
            productFilterOptions={productFilterOptions}
          />
        </div>
      </Section>
    </main>
  );
}
