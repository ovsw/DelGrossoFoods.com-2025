import type { SanityImageSource } from "@sanity/asset-utils";
import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/config";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  // Always emit stega metadata for visible content so Presentation
  // click-to-edit works across environments. Use stegaClean only for
  // a11y/logic where needed.
  stega: {
    studioUrl,
  },
});

const imageBuilder = createImageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
});

export const urlFor = (source: SanityImageSource) =>
  imageBuilder.image(source).auto("format").fit("max").format("webp");
