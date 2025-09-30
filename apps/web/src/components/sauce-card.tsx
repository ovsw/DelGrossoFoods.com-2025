"use client";
import { ListCard } from "@/components/list/list-card";
import { getLineDisplayName, getTypeBadge } from "@/config/sauce-taxonomy";
import { buildHref } from "@/lib/list/href";
import type { SauceListItem } from "@/types";

export function SauceCard({ item }: { item: SauceListItem }) {
  const { name, slug, mainImage, line, category, _id, _type } = item;
  const typeBadge = getTypeBadge(category);

  // Get the display name from configuration (supports enhanced names like "La Famiglia DelGrosso")
  const lineDisplayName = getLineDisplayName(line);

  return (
    <ListCard
      href={buildHref("/sauces", slug)}
      title={name}
      titleSecondary={lineDisplayName}
      ariaLabel={`View ${name} sauce`}
      image={mainImage}
      imageAlt={`${name} sauce`}
      imageAspect="sauce"
      imageWidth={400}
      imageHeight={480}
      textAlign="center"
      badges={[{ text: typeBadge.text, variant: typeBadge.variant }]}
      sanityDocumentId={_id}
      sanityDocumentType={_type}
      sanityFieldPath="mainImage"
    />
  );
}
