import type { SanityImageSource } from "@sanity/asset-utils";
import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

// Note: Avoid dynamic indexing like process.env[key] so that
// NEXT_PUBLIC_* variables can be inlined in browser bundles.
const firstDefined = (...vals: Array<string | undefined>): string | undefined =>
  vals.find((v) => typeof v === "string" && v.length > 0);

export const projectId: string = (() => {
  const val = firstDefined(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    process.env.SANITY_STUDIO_PROJECT_ID,
    process.env.SANITY_PROJECT_ID,
  );
  if (!val) {
    throw new Error(
      "Missing Sanity project id. Set NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID",
    );
  }
  return val;
})();

export const dataset: string = (() => {
  const val = firstDefined(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    process.env.SANITY_STUDIO_DATASET,
    process.env.SANITY_DATASET,
  );
  if (!val) {
    throw new Error(
      "Missing Sanity dataset. Set NEXT_PUBLIC_SANITY_DATASET or SANITY_DATASET",
    );
  }
  return val;
})();

export const apiVersion: string =
  firstDefined(
    process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    process.env.SANITY_API_VERSION,
  ) ?? "2025-02-19";

export const studioUrl: string =
  firstDefined(
    process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    process.env.SANITY_STUDIO_URL,
  ) ?? "http://localhost:3333";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: {
    studioUrl,
  },
});

const imageBuilder = createImageUrlBuilder({
  projectId,
  dataset,
});

export const urlFor = (source: SanityImageSource) =>
  imageBuilder.image(source).auto("format").fit("max").format("webp");
