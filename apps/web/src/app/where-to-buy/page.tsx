import type { Metadata } from "next";

import { WhereToBuyClient } from "@/components/features/where-to-buy/where-to-buy-client";
import { getSEOMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getSEOMetadata({
    title: "Where to Buy",
    description:
      "Find La Famiglia DelGrosso Pasta and Pizza Sauces at a store near you. Available in grocery stores across the United States.",
    slug: "/where-to-buy",
  });
}

export default function WhereToBuyPage() {
  const heading = "Find DelGrosso Near You";
  const intro =
    "La Famiglia DelGrosso Pasta and Pizza Sauces are available at fine grocery stores across the United States. Select your state to find stores near you.";

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

        <WhereToBuyClient />
      </div>
    </main>
  );
}
