"use client";
import { ListCard } from "@workspace/ui/components/list-card";
import { createDataAttribute } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import { dataset, projectId, studioUrl } from "@/config";
import { getLineDisplayName, getTypeBadge } from "@/config/sauce-taxonomy";
import { buildHref } from "@/lib/list/href";
import type { SauceListItem } from "@/types";

export type SauceCardProps = {
  item: SauceListItem;
  showLineLabel?: boolean;
  showBadges?: boolean;
};

function buildLfdSauceDisplayName(
  name: string,
  authorName: string | null | undefined,
) {
  const trimmedName = name.trim();
  const trimmedAuthorName = authorName?.trim();

  if (!trimmedAuthorName) {
    return trimmedName;
  }

  const suffix = trimmedAuthorName.endsWith("s") ? "'" : "'s";
  return `${trimmedAuthorName}${suffix} ${trimmedName}`;
}

export function SauceCard({
  item,
  showLineLabel = true,
  showBadges = true,
}: SauceCardProps) {
  const { name, authorName, slug, mainImage, line, category, _id, _type } =
    item;
  const displayName = buildLfdSauceDisplayName(name, authorName);
  const typeBadge = showBadges ? getTypeBadge(category) : null;

  // Get the display name from configuration (supports enhanced names like "La Famiglia DelGrosso")
  const lineDisplayName = showLineLabel ? getLineDisplayName(line) : null;

  const imageAttribute = mainImage?.id
    ? createDataAttribute({
        id: _id,
        type: _type,
        path: "mainImage",
        baseUrl: studioUrl,
        projectId,
        dataset,
      }).toString()
    : undefined;

  return (
    <ListCard
      href={buildHref("/sauces", slug)}
      title={displayName}
      titleSecondary={lineDisplayName}
      ariaLabel={`View ${displayName} sauce`}
      image={
        mainImage?.id ? (
          <SanityImage
            image={mainImage}
            respectSanityCrop
            width={400}
            height={480}
            alt={`${displayName} sauce`}
            mode="contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-sanity={imageAttribute}
          />
        ) : undefined
      }
      imageAspect="sauce"
      textAlign="center"
      badges={
        showBadges && typeBadge
          ? [{ text: typeBadge.text, variant: typeBadge.variant }]
          : []
      }
    />
  );
}
