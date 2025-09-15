"use client";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";

import { SanityImage } from "@/components/elements/sanity-image";
import { getLineBadge, getTypeBadge } from "@/config/sauce-taxonomy";
import type { SauceListItem } from "@/types";

export function SauceCard({ item }: { item: SauceListItem }) {
  const { name, slug, mainImage, line, category } = item;
  const lineBadge = getLineBadge(line);
  const typeBadge = getTypeBadge(category);

  return (
    <Link
      href={`/sauces/${slug}`}
      aria-label={`View ${name} sauce`}
      className="group block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl overflow-hidden border border-border shadow-sm transition hover:shadow-md"
    >
      <div className="relative">
        {mainImage?.id ? (
          <SanityImage
            image={mainImage}
            width={600}
            height={600}
            alt={mainImage?.alt ?? `${name} sauce`}
            className="w-full aspect-square object-cover"
          />
        ) : (
          <div className="w-full aspect-square bg-muted" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge
            className="text-xs"
            style={{
              background: `var(${lineBadge.colorVar})`,
              color: "white",
            }}
          >
            {lineBadge.text}
          </Badge>
          <Badge
            className="text-xs"
            style={{
              background: `var(${typeBadge.colorVar || "--color-th-neutral-300"})`,
              color: typeBadge.colorVar ? "black" : "black",
            }}
          >
            {typeBadge.text}
          </Badge>
        </div>

        <h3 className="text-base font-semibold leading-tight group-hover:underline">
          {name}
        </h3>
      </div>
    </Link>
  );
}
