"use client";
import { ListCard } from "@/components/list/list-card";
import { getLineBadge, getTypeBadge } from "@/config/sauce-taxonomy";
import type { SauceListItem } from "@/types";

export function SauceCard({ item }: { item: SauceListItem }) {
  const { name, slug, mainImage, line, category } = item;
  const lineBadge = getLineBadge(line);
  const typeBadge = getTypeBadge(category);

  return (
    <ListCard
      href={`/sauces/${slug}`}
      title={name}
      ariaLabel={`View ${name} sauce`}
      image={mainImage}
      imageAlt={`${name} sauce`}
      imageAspect="sauce"
      badges={[
        { text: lineBadge.text, variant: lineBadge.variant },
        { text: typeBadge.text, variant: typeBadge.variant },
      ]}
    />
  );
}
