"use client";
import { urlFor } from "@workspace/sanity-config/client";
import { InfoLabel } from "@workspace/ui/components/info-label";
import { SectionShell } from "@workspace/ui/components/section-shell";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import { stegaClean } from "next-sanity";

import type { RecipeDetailData } from "@/types";

// Video poster dimensions constants
const VIDEO_POSTER_WIDTH = 1280;
const VIDEO_POSTER_HEIGHT = 720;

import {
  BrandTabLabel,
  hasBlocks,
  InfoRow,
  mapSaucesToDisplay,
  RecipeBadges,
  SauceList,
  useVariantState,
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

  const [variant, setVariant] = useVariantState(available);

  // If neither variant has any content, don't render the section
  if (!hasOriginal && !hasPremium) {
    return null;
  }

  const { meatBadges, tagBadges, categoryBadges } = RecipeBadges({ recipe });

  const originalSauces = mapSaucesToDisplay(recipe.dgfSauces);
  const premiumSauces = mapSaucesToDisplay(recipe.lfdSauces);

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
      spacingTop="default"
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
          {available.length > 1 ? (
            <Tabs
              value={variant}
              onValueChange={(v) => setVariant(v as VariantKey)}
              className="w-full"
              data-html="c-recipe-tabs"
            >
              <TabsList
                className="pl-2 flex items-end gap-0 -mb-px min-h-24"
                data-html="c-recipe-tabs-list"
              >
                <TabsTrigger
                  value="original"
                  className={cn(
                    "cursor-pointer rounded-none rounded-b-none border px-4 py-3 text-base font-medium transition-all opacity-80 hover:opacity-90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-selected:opacity-100 aria-selected:py-4",
                    "rounded-tl-sm border-brand-green/80 bg-brand-green/90 text-brand-green-text hover:bg-brand-green aria-selected:border-brand-green aria-selected:bg-brand-green aria-selected:text-brand-green-text aria-selected:rounded-tr-sm",
                  )}
                  data-html="c-recipe-tabs-trigger-original"
                >
                  <BrandTabLabel variant="original" />
                </TabsTrigger>
                <TabsTrigger
                  value="premium"
                  className={cn(
                    "cursor-pointer rounded-none rounded-b-none border px-4 py-3 text-base font-medium transition-all opacity-80 hover:opacity-90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-selected:opacity-100 aria-selected:py-4",
                    "rounded-tr-sm border-l-0 border-th-dark-900/80 bg-th-dark-900/90 text-th-light-100 hover:bg-th-dark-900 aria-selected:border-th-dark-900 aria-selected:bg-th-dark-900 aria-selected:text-th-light-100 aria-selected:rounded-tl-sm",
                  )}
                  data-html="c-recipe-tabs-trigger-premium"
                >
                  <BrandTabLabel variant="premium" />
                </TabsTrigger>
              </TabsList>
              <div
                className="space-y-10"
                data-html="c-recipe-tabs-content-wrapper"
              >
                <TabsContent
                  value="original"
                  lazyMount
                  className="rounded-md bg-th-light-100 p-6"
                  data-html="c-recipe-tabs-content-original"
                >
                  <VariantContent
                    ingredients={recipe.dgfIngredients}
                    directions={recipe.dgfDirections}
                    notes={recipe.dgfNotes}
                  />
                </TabsContent>
                <TabsContent
                  value="premium"
                  lazyMount
                  className="rounded-md bg-th-light-100 p-6"
                  data-html="c-recipe-tabs-content-premium"
                >
                  <VariantContent
                    ingredients={recipe.lfdIngredients}
                    directions={recipe.lfdDirections}
                    notes={recipe.lfdNotes}
                  />
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div
              className="rounded-md bg-th-light-100 p-6"
              data-html="c-recipe-single-variant"
            >
              <VariantContent
                ingredients={
                  available[0] === "premium"
                    ? recipe.lfdIngredients
                    : recipe.dgfIngredients
                }
                directions={
                  available[0] === "premium"
                    ? recipe.lfdDirections
                    : recipe.dgfDirections
                }
                notes={
                  available[0] === "premium" ? recipe.lfdNotes : recipe.dgfNotes
                }
              />
            </div>
          )}
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

              {(originalSauces.length > 0 || premiumSauces.length > 0) && (
                <div className="md:col-span-2">
                  <InfoLabel asChild>
                    <dt>Sauces</dt>
                  </InfoLabel>
                  <dd className="mt-2 space-y-3">
                    <SauceList
                      title="DelGrosso Original Sauces:"
                      items={originalSauces}
                    />
                    <SauceList
                      title="La Famiglia DelGrosso sauces:"
                      items={premiumSauces}
                    />
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
