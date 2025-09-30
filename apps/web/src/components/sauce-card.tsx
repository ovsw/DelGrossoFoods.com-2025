"use client";
import { ListCard } from "@/components/list/list-card";
import { getLineBadge, getTypeBadge } from "@/config/sauce-taxonomy";
import { buildHref } from "@/lib/list/href";
import type { SauceListItem } from "@/types";

export function SauceCard({ item }: { item: SauceListItem }) {
  const { name, slug, mainImage, line, category, _id, _type } = item;
  const lineBadge = getLineBadge(line);
  const typeBadge = getTypeBadge(category);

  // Enhanced styling for more prominent display
  const isPremiumLine = line === "Ultra-Premium";
  const lineDisplayName = isPremiumLine
    ? "La Famiglia DelGrosso"
    : lineBadge.text;

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
