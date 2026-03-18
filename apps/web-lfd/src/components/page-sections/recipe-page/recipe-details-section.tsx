import { urlFor } from "@workspace/sanity-config/client";
import { InfoLabel } from "@workspace/ui/components/info-label";
import { SectionShell } from "@workspace/ui/components/section-shell";
import { stegaClean } from "next-sanity";

import type { RecipeDetailData } from "@/types";

import {
  hasBlocks,
  InfoRow,
  mapSaucesToDisplay,
  RecipeBadges,
  RecipeContent,
  SauceList,
} from "./recipe-details";
import { RecipeVideoClient } from "./recipe-video/recipe-video-client";

// Video poster dimensions constants
const VIDEO_POSTER_WIDTH = 1280;
const VIDEO_POSTER_HEIGHT = 720;

export interface RecipeDetailsSectionProps {
  readonly recipe: RecipeDetailData;
}

export function RecipeDetailsSection({ recipe }: RecipeDetailsSectionProps) {
  const hasRecipeText =
    hasBlocks(recipe.ingredients) ||
    hasBlocks(recipe.directions) ||
    hasBlocks(recipe.notes);

  const originalSauces = mapSaucesToDisplay(recipe.dgfSauces);
  const premiumSauces = mapSaucesToDisplay(recipe.lfdSauces);
  const showOriginalSauces = originalSauces.length > 0;
  const showPremiumSauces = premiumSauces.length > 0;
  const hasSauceContent = showOriginalSauces || showPremiumSauces;

  if (!hasRecipeText && !hasSauceContent) {
    return null;
  }

  const { meatBadges, tagBadges, categoryBadges } = RecipeBadges({ recipe });

  const documentId = recipe._id ?? null;
  const documentType = recipe._type ?? null;
  const fieldPaths = {
    ingredients: "ingredients",
    directions: "directions",
    notes: "notes",
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
        {/* Left: Video (if present) + recipe content */}
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
            <RecipeContent
              ingredients={recipe.ingredients}
              directions={recipe.directions}
              notes={recipe.notes}
              documentId={documentId}
              documentType={documentType}
              fieldPaths={fieldPaths}
            />
          </div>
        </div>

        {/* Right: Info panel */}
        <section
          className="order-1 md:order-2 md:col-span-5 lg:col-span-4 md:self-start md:sticky md:top-36"
          aria-labelledby="recipe-info-heading"
          data-html="c-recipe-info-panel"
        >
          <div
            className="md:max-h-[calc(100vh-6rem)] md:overflow-y-auto md:pr-2"
            data-html="c-recipe-info-scroll"
          >
            <h3
              id="recipe-info-heading"
              className="sr-only"
              data-html="c-recipe-info-heading"
            >
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

              {hasSauceContent && (
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
        </section>
      </div>
    </SectionShell>
  );
}
