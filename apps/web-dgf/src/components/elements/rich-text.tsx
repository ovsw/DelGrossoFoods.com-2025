"use client";

import { createRichText } from "@workspace/ui/components/rich-text";

import { parseChildrenToSlug } from "@/utils";

import { SanityImage } from "./sanity-image";

export const RichText = createRichText({
  SanityImage,
  parseChildrenToSlug,
});
