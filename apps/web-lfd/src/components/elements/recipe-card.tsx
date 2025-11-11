"use client";
import {
  RecipeCard as RecipeHighlightCard,
  type RecipeCardBadge,
} from "@workspace/ui/components/recipe-card";
import { createDataAttribute, stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import { dataset, projectId, studioUrl } from "@/config";
import {
  meatMap,
  tagMap,
  toMeatSlug,
  toRecipeTagSlug,
} from "@/config/recipe-taxonomy";
import { buildHref } from "@/lib/list/href";
import type { RecipeListItem } from "@/types";

export function RecipeCard({ item }: { item: RecipeListItem }) {
  const { _id, name, slug, mainImage, meat, tags } = item;
  const displayName = name ?? "Recipe";
  const href = buildHref("/recipes", slug);

  const meatBadges: RecipeCardBadge[] = (meat ?? []).flatMap((value) => {
    const slugValue = toMeatSlug(value);
    if (!slugValue) {
      return [];
    }

    const cfg = meatMap[slugValue];
    return [{ text: cfg.display, variant: "meat" }];
  });

  const tagBadges: RecipeCardBadge[] = (tags ?? []).flatMap((value) => {
    const slugValue = toRecipeTagSlug(value);
    if (!slugValue) {
      return [];
    }

    const cfg = tagMap[slugValue];
    return [{ text: cfg.display, variant: cfg.badgeVariant }];
  });

  const badges = [...meatBadges, ...tagBadges];
  const accessibleName = `View ${stegaClean(displayName)}`;
  const imageDataAttribute =
    mainImage?.id && _id
      ? createDataAttribute({
          id: _id,
          type: "recipe",
          path: "mainImage",
          baseUrl: studioUrl,
          projectId,
          dataset,
        }).toString()
      : undefined;

  const imageNode = mainImage?.id ? (
    <SanityImage
      image={mainImage}
      width={640}
      height={640}
      alt={stegaClean(displayName)}
      loading="lazy"
      data-sanity={imageDataAttribute}
    />
  ) : undefined;

  return (
    <RecipeHighlightCard
      href={href}
      title={displayName}
      ariaLabel={accessibleName}
      image={imageNode}
      badges={badges}
      hideCtaVisually
      layout="listing"
    />
  );
}
