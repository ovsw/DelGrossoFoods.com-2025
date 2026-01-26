import { urlFor } from "@workspace/sanity-config/client";
import { InfoLabel } from "@workspace/ui/components/info-label";
import { SectionShell } from "@workspace/ui/components/section-shell";
import { stegaClean } from "next-sanity";

import type { RecipeDetailData } from "@/types";

// Video poster dimensions constants
const VIDEO_POSTER_WIDTH = 1280;
const VIDEO_POSTER_HEIGHT = 720;

import {
  hasBlocks,
  InfoRow,
  mapSaucesToDisplay,
  RecipeBadges,
  SauceList,
  VariantContent,
  type VariantKey,
} from "./recipe-details";
import { RecipeVideoClient } from "./recipe-video/recipe-video-client";

export interface RecipeDetailsSectionProps {
  readonly recipe: RecipeDetailData;
}

export function RecipeDetailsSection({ recipe }: RecipeDetailsSectionProps) {
  const hasOriginal =
    hasBlocks(recipe.dgfIngredients) ||
    hasBlocks(recipe.dgfDirections) ||
    hasBlocks(recipe.dgfNotes) ||
    (recipe.dgfSauces?.length ?? 0) > 0;
  const hasPremium =
    hasBlocks(recipe.lfdIngredients) ||
    hasBlocks(recipe.lfdDirections) ||
    hasBlocks(recipe.lfdNotes) ||
    (recipe.lfdSauces?.length ?? 0) > 0;

  const available: VariantKey[] =
    hasOriginal && hasPremium
      ? ["original", "premium"]
      : hasOriginal
        ? ["original"]
        : ["premium"];

  const hasOriginalText =
    hasBlocks(recipe.dgfIngredients) ||
    hasBlocks(recipe.dgfDirections) ||
    hasBlocks(recipe.dgfNotes);
  const hasPremiumText =
    hasBlocks(recipe.lfdIngredients) ||
    hasBlocks(recipe.lfdDirections) ||
    hasBlocks(recipe.lfdNotes);
  const primaryVariant: VariantKey = "original";
  const secondaryVariant: VariantKey = "premium";
  const defaultVariant: VariantKey = available[0] ?? primaryVariant;
  const selectedVariant: VariantKey =
    hasOriginalText && available.includes(primaryVariant)
      ? primaryVariant
      : hasPremiumText && available.includes(secondaryVariant)
        ? secondaryVariant
        : available.includes(primaryVariant)
          ? primaryVariant
          : defaultVariant;

  // If neither variant has any content, don't render the section
  if (!hasOriginal && !hasPremium) {
    return null;
  }

  const { meatBadges, tagBadges, categoryBadges } = RecipeBadges({ recipe });

  const originalSauces = mapSaucesToDisplay(recipe.dgfSauces);
  const premiumSauces = mapSaucesToDisplay(recipe.lfdSauces);
  const showOriginalSauces =
    available.includes("original") && originalSauces.length > 0;
  const showPremiumSauces =
    available.includes("premium") && premiumSauces.length > 0;

  const documentId = recipe._id ?? null;
  const documentType = recipe._type ?? null;
  const variantFieldPaths = {
    original: {
      ingredients: "dgfIngredients",
      directions: "dgfDirections",
      notes: "dgfNotes",
    },
    premium: {
      ingredients: "lfdIngredients",
      directions: "lfdDirections",
      notes: "lfdNotes",
    },
  } as const;

  // We intentionally preserve stega metadata in visible rich text below.
  const video = recipe.video;
  const playbackId = video?.playbackId ?? null;
  const posterUrl =
    playbackId && video?.posterImage?.id
      ? urlFor(video.posterImage.id)
          .width(VIDEO_POSTER_WIDTH)
          .height(VIDEO_POSTER_HEIGHT)
          .fit("crop")
          .url()
      : null;
  const cleanTitle = stegaClean(recipe.name ?? "");
  const ariaLabel = cleanTitle
    ? `Watch recipe video: ${cleanTitle}`
    : undefined;

  return (
    <SectionShell
      spacingTop="none"
      spacingBottom="large"
      background="transparent"
      allowOverflow
      innerClassName="container mx-auto px-4 md:px-6 lg:max-w-7xl xl:max-w-6xl 2xl:max-w-8xl"
      data-html="c-recipe-details-section"
    >
      <div
        className="grid grid-cols-1 gap-10 md:grid-cols-12"
        data-html="c-recipe-details-grid"
      >
        {/* Left: Video (if present) + Variant content */}
        <div className="order-2 md:order-1 md:col-span-7 lg:col-span-8">
          {playbackId ? (
            <RecipeVideoClient
              playbackId={playbackId}
              posterUrl={posterUrl}
              metaTitle={cleanTitle}
              ariaLabel={ariaLabel}
              className="mb-8"
            />
          ) : null}
          <div className="space-y-10" data-html="c-recipe-single-variant">
            <VariantContent
              ingredients={
                selectedVariant === "premium"
                  ? recipe.lfdIngredients
                  : recipe.dgfIngredients
              }
              directions={
                selectedVariant === "premium"
                  ? recipe.lfdDirections
                  : recipe.dgfDirections
              }
              notes={
                selectedVariant === "premium"
                  ? recipe.lfdNotes
                  : recipe.dgfNotes
              }
              documentId={documentId}
              documentType={documentType}
              fieldPaths={variantFieldPaths[selectedVariant]}
            />
          </div>
        </div>

        {/* Right: Info panel */}
        <aside
          className="order-1 md:order-2 md:col-span-5 lg:col-span-4 md:self-start md:sticky md:top-36"
          data-html="c-recipe-info-panel"
        >
          <div
            className="md:max-h-[calc(100vh-6rem)] md:overflow-y-auto md:pr-2"
            data-html="c-recipe-info-scroll"
          >
            <h3 className="sr-only" data-html="c-recipe-info-heading">
              Recipe Info
            </h3>
            <dl
              className="mt-4 grid gap-5 md:grid-cols-1 lg:grid-cols-2"
              data-html="c-recipe-info-list"
            >
              {recipe.serves ? (
                <InfoRow title="Serves" valueClassName="mt-1">
                  {recipe.serves}
                </InfoRow>
              ) : null}

              {meatBadges.length > 0 ? (
                <InfoRow title="Meat">{meatBadges}</InfoRow>
              ) : null}

              {categoryBadges.length > 0 ? (
                <InfoRow title="Categories">{categoryBadges}</InfoRow>
              ) : null}

              {tagBadges.length > 0 ? (
                <InfoRow title="Tags">{tagBadges}</InfoRow>
              ) : null}

              {(showOriginalSauces || showPremiumSauces) && (
                <div className="md:col-span-2">
                  <InfoLabel asChild>
                    <dt>Sauces</dt>
                  </InfoLabel>
                  <dd className="mt-2 space-y-3">
                    {showOriginalSauces ? (
                      <SauceList
                        title="DelGrosso Original Sauces:"
                        items={originalSauces}
                      />
                    ) : null}
                    {showPremiumSauces ? (
                      <SauceList
                        title="La Famiglia DelGrosso sauces:"
                        items={premiumSauces}
                      />
                    ) : null}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
}
