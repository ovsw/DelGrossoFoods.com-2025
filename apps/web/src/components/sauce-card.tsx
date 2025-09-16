"use client";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";

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

  return (
    <Link
      href={`/sauces/${slug}`}
      aria-label={`View ${name} sauce`}
      className="group block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <div className="aspect-[1/1] flex items-center justify-center p-4">
        {mainImage?.id ? (
          <SanityImage
            image={mainImage}
            respectSanityCrop={false}
            width={200}
            height={400}
            alt={mainImage?.alt ?? `${name} sauce`}
            className="max-h-full max-w-full object-contain"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
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

        <h3 className="text-base font-semibold leading-tight group-hover:underline">
          {name}
        </h3>
      </div>
    </Link>
  );
}
