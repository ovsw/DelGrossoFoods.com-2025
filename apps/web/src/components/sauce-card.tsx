"use client";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import {
  getLineBadge,
  getTypeBadge,
  toLineSlug,
  toTypeSlug,
} from "@/config/sauce-taxonomy";
import type { SauceListItem } from "@/types";

export function SauceCard({ item }: { item: SauceListItem }) {
  const { name, slug, mainImage, line, category } = item;
  const lineBadge = getLineBadge(line);
  const typeBadge = getTypeBadge(category);
  // Clean non-visible a11y strings from Sanity stega metadata
  const a11yName = stegaClean(name);
  const altText = stegaClean(mainImage?.alt ?? `${a11yName} sauce`);

  return (
    <Link
      href={`/sauces/${slug}`}
      aria-label={`View ${a11yName} sauce`}
      className="group block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <div className="aspect-[33/40] flex items-center justify-center">
        {mainImage?.id ? (
          <SanityImage
            image={mainImage}
            respectSanityCrop={false}
            width={200}
            height={400}
            alt={altText}
            className="max-h-full max-w-full object-contain"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge
            text={lineBadge.text}
            variant={toLineSlug(line) ?? "neutral"}
            className="text-xs"
          />
          <Badge
            text={typeBadge.text}
            variant={toTypeSlug(category) ?? "neutral"}
            className="text-xs"
          />
        </div>

        <h3 className="text-base font-semibold leading-tight group-hover:underline text-center">
          {name}
        </h3>
      </div>
    </Link>
  );
}
