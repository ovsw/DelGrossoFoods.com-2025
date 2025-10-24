import { Badge } from "@workspace/ui/components/badge";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
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
  const recipeName = recipe.name ?? "";

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

  const image = recipe.mainImage
    ? {
        id: recipe.mainImage.id,
        preview: recipe.mainImage.preview,
        hotspot: recipe.mainImage.hotspot,
        crop: recipe.mainImage.crop,
        alt: recipe.mainImage.alt,
      }
    : null;

  const altText = image?.alt || `${stegaClean(recipeName)} recipe`;

  return (
    <div className="relative">
      <div className="relative max-h-[85svh] min-h-[80vh] w-full overflow-hidden bg-muted">
        {image?.id ? (
          <SanityImage
            image={image}
            alt={altText}
            width={1920}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover"
            mode="cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <div className="text-muted-foreground text-lg">
              {stegaClean(recipeName) || "Image"}
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-th-dark-900/70 via-th-dark-900/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="container mx-auto lg:max-w-6xl">
          {eyebrowText && (
            <div className="mb-4">
              <Eyebrow text={eyebrowText} className="text-white/80" />
            </div>
          )}
          <h1 className="text-4xl font-bold md:text-6xl">{recipeName}</h1>
          {allBadges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {allBadges.map((badge, index) => (
                <Badge
                  key={`${badge.text}-${index}`}
                  text={badge.text}
                  variant={badge.variant}
                  className="text-sm"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
