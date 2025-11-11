"use client";

import type { ElementType, JSX, MemoExoticComponent } from "react";
import { memo } from "react";
import {
  SanityImage as BaseSanityImage,
  type WrapperProps,
} from "sanity-image";

export type SanityImageHotspot = {
  x?: number | null;
  y?: number | null;
};

export type SanityImageCrop = {
  top?: number | null;
  bottom?: number | null;
  left?: number | null;
  right?: number | null;
};

export type SanityImageSource = {
  id?: string | null;
  preview?: string | null;
  hotspot?: SanityImageHotspot | null;
  crop?: SanityImageCrop | null;
};

export type CreateSanityImageOptions = {
  projectId: string;
  dataset: string;
};

export type SharedSanityImageProps<TImage extends SanityImageSource> = {
  image: TImage;
  respectSanityCrop?: boolean;
} & Omit<WrapperProps<"img">, "id">;

export type SanityImageComponent<TImage extends SanityImageSource> =
  MemoExoticComponent<
    (props: SharedSanityImageProps<TImage>) => JSX.Element | null
  >;

type ProcessedImageData = {
  readonly id: string;
  readonly preview?: string;
  readonly hotspot?: { x: number; y: number };
  readonly crop?: { top: number; bottom: number; left: number; right: number };
};

export function createSanityImage<TImage extends SanityImageSource>({
  projectId,
  dataset,
}: CreateSanityImageOptions): SanityImageComponent<TImage> {
  const SANITY_BASE_URL =
    `https://cdn.sanity.io/images/${projectId}/${dataset}/` as const;

  const ImageWrapper = <TElement extends ElementType = "img">(
    props: WrapperProps<TElement>,
  ) => <BaseSanityImage baseUrl={SANITY_BASE_URL} {...props} />;

  function SanityImageImpl({
    image,
    respectSanityCrop = true,
    ...props
  }: SharedSanityImageProps<TImage>) {
    const processedImageData = processImageData(image, respectSanityCrop);

    if (!processedImageData) {
      console.debug("SanityImage: Failed to process image data", image);
      return null;
    }

    return <ImageWrapper {...props} {...processedImageData} />;
  }

  return memo(SanityImageImpl) as SanityImageComponent<TImage>;
}

function processImageData(
  image: SanityImageSource,
  includeTransforms: boolean,
): ProcessedImageData | null {
  if (!image?.id || typeof image.id !== "string") {
    console.warn("SanityImage: Invalid image data provided", image);
    return null;
  }

  const hotspot = includeTransforms ? extractHotspot(image.hotspot) : undefined;
  const crop = includeTransforms ? extractCrop(image.crop) : undefined;
  const preview =
    typeof image.preview === "string" && image.preview.length > 0
      ? image.preview
      : undefined;

  return {
    id: image.id,
    ...(preview && { preview }),
    ...(hotspot && { hotspot }),
    ...(crop && { crop }),
  };
}

function extractHotspot(hotspot: SanityImageHotspot | null | undefined) {
  if (!hotspot) return undefined;
  const { x, y } = hotspot;
  if (!isValidNumber(x) || !isValidNumber(y)) return undefined;
  return { x, y };
}

function extractCrop(crop: SanityImageCrop | null | undefined) {
  if (!crop) return undefined;
  const { top, bottom, left, right } = crop;
  if (
    !isValidNumber(top) ||
    !isValidNumber(bottom) ||
    !isValidNumber(left) ||
    !isValidNumber(right)
  ) {
    return undefined;
  }
  return { top, bottom, left, right };
}

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}
