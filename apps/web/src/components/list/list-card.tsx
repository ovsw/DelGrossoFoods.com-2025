"use client";
import { Badge, type BadgeVariant } from "@workspace/ui/components/badge";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import type { SanityImageProps as SanityImageData } from "@/types";

// Stable, typed map of semantic crop → Tailwind aspect class.
// Use semantic keys so wrappers can select the correct shape without
// worrying about exact ratios.
const ASPECT_CLASS = {
  sauce: "aspect-[33/40]", // tall jars / sauces
  product: "aspect-[2/1]", // landscape product shots
  recipe: "aspect-[3/2]", // portrait-forward recipe images
} as const;

type ImageAspect = keyof typeof ASPECT_CLASS; // 'sauce' | 'product' | 'recipe'

type BadgeSpec = { text: string; variant?: BadgeVariant };

type ListCardProps = {
  href: string;
  title: string;
  image?: SanityImageData | null;
  imageAlt?: string | null;
  ariaLabel?: string;
  subtitle?: string | null;
  badges?: BadgeSpec[]; // up to two typically
  imageAspect?: ImageAspect;
  imageFit?: "contain" | "cover";
  // Optional image dimensions to control CDN crop/fit
  imageWidth?: number;
  imageHeight?: number;
  textAlign?: "center" | "start";
};

export function ListCard({
  href,
  title,
  image,
  ariaLabel,
  imageAlt,
  subtitle,
  badges = [],
  imageAspect = "sauce",
  imageFit = "contain",
  imageWidth,
  imageHeight,
  textAlign = "center",
}: ListCardProps) {
  const cleanTitle = stegaClean(title);
  const altText = stegaClean(imageAlt ?? cleanTitle);
  const aspectClass = ASPECT_CLASS[imageAspect];
  const wrapperClassName =
    imageFit === "cover"
      ? `${aspectClass} relative overflow-hidden`
      : `${aspectClass} flex items-center justify-center overflow-hidden`;
  const imageClassName =
    imageFit === "cover"
      ? "absolute inset-0 h-full w-full object-cover"
      : "max-h-full max-w-full object-contain";

  const titleAlignClass = textAlign === "center" ? "text-center" : "text-start";
  const subtitleAlignClass = titleAlignClass;
  const badgesJustifyClass =
    textAlign === "center" ? "justify-center" : "justify-start";

  // Default dimension presets per semantic crop when explicit values are not provided
  const DEFAULT_DIMS: Record<ImageAspect, { w: number; h: number }> = {
    sauce: { w: 600, h: 800 },
    product: { w: 800, h: 533 },
    recipe: { w: 600, h: 800 },
  } as const;
  const dims = {
    w: imageWidth ?? DEFAULT_DIMS[imageAspect].w,
    h: imageHeight ?? DEFAULT_DIMS[imageAspect].h,
  };

  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? cleanTitle}
      className="group block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <div className={wrapperClassName}>
        {image?.id ? (
          <SanityImage
            image={image}
            respectSanityCrop={true}
            width={dims.w}
            height={dims.h}
            alt={altText}
            className={imageClassName}
            mode={imageFit}
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="py-4">
        <h3
          className={`text-base font-semibold leading-tight group-hover:underline ${titleAlignClass}`}
        >
          {title}
        </h3>

        {subtitle ? (
          <p
            className={`text-sm text-muted-foreground mt-1 ${subtitleAlignClass}`}
          >
            {subtitle}
          </p>
        ) : null}

        {badges.length > 0 ? (
          <div
            className={`mt-2 flex flex-wrap items-center ${badgesJustifyClass} gap-0.5`}
          >
            {badges.map((b, i) => (
              <Badge
                key={`${b.text}-${i}`}
                text={b.text}
                variant={b.variant}
                className="text-xs"
              />
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
