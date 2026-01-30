"use client";

import { createSanityImage } from "@workspace/ui/components/sanity-image";

import { dataset, projectId } from "@/config";
import type { SanityImageProps as SanityImageData } from "@/types";

export const SanityImage = createSanityImage<SanityImageData>({
  dataset,
  projectId,
});
