"use client";
import { ListCard } from "@/components/list/list-card";
import {
  meatMap,
  tagMap,
  toMeatSlug,
  toRecipeTagSlug,
} from "@/config/recipe-taxonomy";
import type { RecipeListItem } from "@/types";

export function RecipeCard({ item }: { item: RecipeListItem }) {
  const { name, slug, mainImage, meat, tags } = item;

  const href = slug?.startsWith("/") ? slug : `/recipes/${slug}`;
  const meatBadges = (meat ?? []).map((value) => {
    const slugValue = toMeatSlug(value);
    if (slugValue) {
      const cfg = meatMap[slugValue];
      return { text: cfg.display, variant: "meat" as const };
    }
    return { text: String(value) };
  });
  const tagBadges = (tags ?? []).map((value) => {
    const slugValue = toRecipeTagSlug(value);
    if (slugValue) {
      const cfg = tagMap[slugValue];
      return { text: cfg.display, variant: cfg.badgeVariant };
    }
    return { text: String(value) };
  });
  const badges = [...meatBadges, ...tagBadges];

  return (
    <ListCard
      href={href}
      title={name}
      ariaLabel={`View ${name}`}
      image={mainImage}
      imageAlt={name}
      badges={badges}
      textAlign="start"
      imageAspect="portrait"
      imageWidth={340}
      imageHeight={460}
      imageFit="cover"
    />
  );
}
