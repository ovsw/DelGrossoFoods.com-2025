import { Section } from "@workspace/ui/components/section";
import type { Metadata } from "next";

import { WhereToBuyClient } from "@/components/features/where-to-buy/where-to-buy-client";
import { WhereToBuyHeroSection } from "@/components/page-sections/where-to-buy/where-to-buy-hero-section";
import { sanityFetch } from "@/lib/sanity/live";
import { getStoreLocatorPageQuery } from "@/lib/sanity/query";
import type { GetStoreLocatorPageQueryResult } from "@/lib/sanity/sanity.types";
import { getSEOMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const storeLocatorData = await sanityFetch({
    query: getStoreLocatorPageQuery,
  });

  const data = (storeLocatorData?.data ??
    null) as GetStoreLocatorPageQueryResult | null;

  return getSEOMetadata({
    title: data?.title
      ? `${data.title} - DelGrosso Foods`
      : "Where to Buy - DelGrosso Foods",
    description:
      data?.description ||
      "Find La Famiglia DelGrosso Pasta and Pizza Sauces at a store near you. Available in grocery stores across the United States.",
    slug: "/where-to-buy",
  });
}

export default async function WhereToBuyPage() {
  const storeLocatorData = await sanityFetch({
    query: getStoreLocatorPageQuery,
  });

  const data = (storeLocatorData?.data ??
    null) as GetStoreLocatorPageQueryResult | null;

  const heading = data?.title || "Find DelGrosso Near You";
  const intro =
    data?.description ||
    "La Famiglia DelGrosso Pasta and Pizza Sauces are available at fine grocery stores across the United States. Select your state to find stores near you.";

  return (
    <main>
      <WhereToBuyHeroSection />
      <Section spacingTop="default" spacingBottom="default">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl text-start">
            <h1 className="text-3xl font-bold sm:text-5xl text-brand-green">
              {heading}
            </h1>
            <p className="mt-4 text-xl leading-8 text-muted-foreground">
              {intro}
            </p>
          </div>

          <WhereToBuyClient />
        </div>
      </Section>
    </main>
  );
}
