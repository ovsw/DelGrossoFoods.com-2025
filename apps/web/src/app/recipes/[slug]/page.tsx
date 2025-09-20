import type { Metadata } from "next";
import Link from "next/link";

import { getSEOMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  return getSEOMetadata({
    title: `Recipe: ${slug}`,
    description: "Recipe details coming soon.",
    slug: `/recipes/${slug}`,
    pageType: "article",
  });
}

export default async function RecipeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{slug}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Recipe details coming soon.
          </p>
          <div className="mt-8">
            <Link
              href="/recipes"
              className="underline underline-offset-4 hover:no-underline"
            >
              ← Back to recipes
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
