import { stegaClean } from "next-sanity";

import { HeroLayout } from "@/components/layouts/hero-layout";
import {
  meatMap,
  tagMap,
  toMeatSlug,
  toRecipeTagSlug,
} from "@/config/recipe-taxonomy";
import type { RecipeDetailData } from "@/types";

interface RecipeHeroSectionProps {
  readonly recipe: RecipeDetailData;
}

export function RecipeHeroSection({ recipe }: RecipeHeroSectionProps) {
  // Name: visible uses raw; logic/alt use cleaned
  const rawName = recipe.name ?? "";
  const recipeName = rawName;

  // Categories for eyebrow
  const categories = recipe.categories ?? [];
  const categoryNames = categories.map((cat) => cat.title).filter(Boolean);
  const eyebrowText =
    categoryNames.length > 0 ? categoryNames.join(", ") : "Recipe";

  // Create badges for meat and tags using the same logic as recipe cards
  const meatBadges = (recipe.meat ?? []).map((value) => {
    const slugValue = toMeatSlug(value);
    if (slugValue) {
      const cfg = meatMap[slugValue];
      return { text: cfg.display, variant: "meat" as const };
    }
    return { text: String(value) };
  });

  const tagBadges = (recipe.tags ?? []).map((value) => {
    const slugValue = toRecipeTagSlug(value);
    if (slugValue) {
      const cfg = tagMap[slugValue];
      return {
        text: cfg.display,
        variant: cfg.badgeVariant as
          | "outline"
          | "original"
          | "premium"
          | "neutral"
          | "organic"
          | "pasta"
          | "pizza"
          | "salsa"
          | "sandwich"
          | "low-carb"
          | "quick"
          | "vegetarian"
          | "gluten-free"
          | "meat"
          | "accent"
          | null
          | undefined,
      };
    }
    return { text: String(value) };
  });

  const allBadges = [...meatBadges, ...tagBadges].filter(
    (
      badge,
    ): badge is { text: string; variant: NonNullable<typeof badge.variant> } =>
      badge.variant !== null && badge.variant !== undefined,
  );

  return (
    <HeroLayout
      title={recipeName}
      eyebrow={eyebrowText}
      image={
        recipe.mainImage
          ? {
              id: recipe.mainImage.id,
              preview: recipe.mainImage.preview,
              hotspot: recipe.mainImage.hotspot,
              crop: recipe.mainImage.crop,
              alt: recipe.mainImage.alt || `${stegaClean(recipeName)} recipe`,
            }
          : null
      }
      badges={allBadges}
      variant="overlay"
    />
  );
}
