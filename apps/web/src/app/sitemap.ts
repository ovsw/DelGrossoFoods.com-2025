import type { MetadataRoute } from "next";

import { client } from "@/lib/sanity/client";
import { querySitemapData } from "@/lib/sanity/query";
import { getBaseUrl } from "@/utils";

const baseUrl = getBaseUrl();

type SitemapEntry = { slug: string; lastModified?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { slugPages, blogPages, saucePages, productPages, recipePages } =
    (await client.fetch(querySitemapData)) as {
      slugPages: SitemapEntry[];
      blogPages: SitemapEntry[];
      saucePages: SitemapEntry[];
      productPages: SitemapEntry[];
      recipePages: SitemapEntry[];
    };
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...slugPages.map((page: SitemapEntry) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...blogPages.map((page: SitemapEntry) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...saucePages.map((page: SitemapEntry) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...productPages.map((page: SitemapEntry) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...recipePages.map((page: SitemapEntry) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
