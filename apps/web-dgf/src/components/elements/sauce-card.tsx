"use client";
import { ListCard } from "@workspace/ui/components/list-card";
import { createDataAttribute } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import { dataset, projectId, studioUrl } from "@/config";
import { getLineDisplayName, getTypeBadge } from "@/config/sauce-taxonomy";
import { buildHref } from "@/lib/list/href";
import type { SauceListItem } from "@/types";

export function SauceCard({ item }: { item: SauceListItem }) {
  const { name, slug, mainImage, line, category, _id, _type } = item;
  const typeBadge = getTypeBadge(category);

  // Get the display name from configuration (supports enhanced names like "La Famiglia DelGrosso")
  const lineDisplayName = getLineDisplayName(line);

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
      title={name}
      titleSecondary={lineDisplayName}
      ariaLabel={`View ${name} sauce`}
      image={
        mainImage?.id ? (
          <SanityImage
            image={mainImage}
            respectSanityCrop
            width={400}
            height={480}
            alt={`${name} sauce`}
            mode="contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-sanity={imageAttribute}
          />
        ) : undefined
      }
      imageAspect="sauce"
      textAlign="center"
      badges={[{ text: typeBadge.text, variant: typeBadge.variant }]}
    />
  );
}
