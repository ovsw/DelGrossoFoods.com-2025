import { Badge, type BadgeVariant } from "@workspace/ui/components/badge";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import Link from "next/link";
import { createDataAttribute } from "next-sanity";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import { dataset, projectId, studioUrl } from "@/config";
import {
  meatMap,
  tagMap,
  toMeatSlug,
  toRecipeTagSlug,
} from "@/config/recipe-taxonomy";
import { buildHref } from "@/lib/list/href";
import type { SanityImageProps } from "@/types";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

type FeaturedRecipesBlockProps = PageBuilderBlockProps<"featuredRecipes">;

function isSanityImage(value: unknown): value is SanityImageProps {
  if (!value || typeof value !== "object") {
    return false;
  }

  const image = value as Record<string, unknown>;
  return typeof image.id === "string" && image.id.length > 0;
}

type RecipeSauceReference = {
  readonly name: string | null;
  readonly mainImage?: SanityImageProps;
};

type RecipeBadgeSpec = {
  readonly text: string;
  readonly variant?: BadgeVariant;
};

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function FeaturedRecipesBlock({
  eyebrow,
  title,
  intro,
  recipes,
  spacing,
  isPageTop = false,
  sanityDocumentId,
  sanityDocumentType,
  _key,
}: FeaturedRecipesBlockProps & {
  sanityDocumentId?: string;
  sanityDocumentType?: string;
}) {
  if (!recipes?.length) {
    return null;
  }

  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const HeadingTag = isPageTop ? "h1" : "h2";

  return (
    <Section
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <Eyebrow
              text={eyebrow}
              className="text-brand-green"
              data-sanity={
                sanityDocumentId && sanityDocumentType
                  ? createDataAttribute({
                      id: sanityDocumentId,
                      type: sanityDocumentType,
                      path: `pageBuilder[_key=="${_key}"].eyebrow`,
                      baseUrl: studioUrl,
                      projectId,
                      dataset,
                    }).toString()
                  : undefined
              }
            />
          ) : null}

          {title ? (
            <HeadingTag
              className="mt-3 text-pretty text-3xl font-semibold tracking-tight text-th-dark-900 sm:text-4xl"
              data-sanity={
                sanityDocumentId && sanityDocumentType
                  ? createDataAttribute({
                      id: sanityDocumentId,
                      type: sanityDocumentType,
                      path: `pageBuilder[_key=="${_key}"].title`,
                      baseUrl: studioUrl,
                      projectId,
                      dataset,
                    }).toString()
                  : undefined
              }
            >
              {title}
            </HeadingTag>
          ) : null}

          {intro ? (
            <p
              className="mt-4 text-pretty text-base text-th-dark-700 sm:text-lg"
              data-sanity={
                sanityDocumentId && sanityDocumentType
                  ? createDataAttribute({
                      id: sanityDocumentId,
                      type: sanityDocumentType,
                      path: `pageBuilder[_key=="${_key}"].intro`,
                      baseUrl: studioUrl,
                      projectId,
                      dataset,
                    }).toString()
                  : undefined
              }
            >
              {intro}
            </p>
          ) : null}
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">
          {recipes.map((recipe) => {
            if (!recipe?._id) {
              return null;
            }

            const slugValue =
              typeof recipe.slug === "string" ? stegaClean(recipe.slug) : "";
            const href = slugValue ? buildHref("/recipes", slugValue) : "";
            const combinedSauces = [
              ...(Array.isArray(recipe.dgfSauces) ? recipe.dgfSauces : []),
              ...(Array.isArray(recipe.lfdSauces) ? recipe.lfdSauces : []),
            ].flatMap<RecipeSauceReference>((sauce) => {
              if (!sauce || typeof sauce !== "object") {
                return [];
              }

              const data = sauce as Record<string, unknown>;
              const name =
                typeof data.name === "string" && data.name.length > 0
                  ? data.name
                  : null;

              const mainImage =
                "mainImage" in data && isSanityImage(data.mainImage)
                  ? data.mainImage
                  : undefined;

              return [
                {
                  name,
                  mainImage,
                },
              ];
            });

            const saucesWithMedia = combinedSauces.filter(
              (sauce): sauce is RecipeSauceReference & { name: string } =>
                typeof sauce.name === "string" && sauce.name.length > 0,
            );
            const meatBadges = Array.isArray(recipe.meat)
              ? recipe.meat.flatMap((value) => {
                  const slugValue = toMeatSlug(value);
                  if (!slugValue) {
                    return [];
                  }

                  const config = meatMap[slugValue];
                  return [
                    {
                      text: config.display,
                      variant: "meat" as const,
                    },
                  ];
                })
              : [];
            const tagBadges = Array.isArray(recipe.tags)
              ? recipe.tags.flatMap((value) => {
                  const slugValue = toRecipeTagSlug(value);
                  if (!slugValue) {
                    return [];
                  }

                  const config = tagMap[slugValue];
                  return [
                    {
                      text: config.display,
                      variant: config.badgeVariant,
                    },
                  ];
                })
              : [];
            const badges: RecipeBadgeSpec[] = [...meatBadges, ...tagBadges];
            const cardClassName =
              "group relative isolate flex h-full min-h-[36rem] flex-col overflow-hidden rounded-3xl bg-th-dark-900 text-th-light-100 shadow-xl transition-transform";
            const cardInner = (
              <>
                {recipe.mainImage ? (
                  <SanityImage
                    image={recipe.mainImage}
                    alt={stegaClean(
                      recipe.mainImage.alt ?? recipe.name ?? "Recipe image",
                    )}
                    width={640}
                    height={640}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus:scale-105 group-focus-visible:scale-105"
                    loading="lazy"
                  />
                ) : null}

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-green/80 via-brand-green/40 to-brand-green/0"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-green/95 via-brand-green/80 to-transparent"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-6 sm:p-8">
                  {badges.length ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {badges.map((badge, index) => (
                        <Badge
                          key={`${badge.text}-${index}`}
                          text={badge.text}
                          variant={badge.variant}
                          className="text-xs font-medium"
                        />
                      ))}
                    </div>
                  ) : null}

                  <h3 className="text-2xl font-semibold leading-tight text-th-light-100">
                    {recipe.name}
                  </h3>

                  {saucesWithMedia.length ? (
                    <div className="flex flex-wrap items-center gap-3 text-sm text-th-light-200">
                      <span>with</span>
                      {saucesWithMedia.map((sauce, index) => (
                        <span
                          key={`${sauce.name}-${index}`}
                          className="inline-flex items-center gap-2"
                        >
                          {sauce.mainImage ? (
                            <SanityImage
                              image={sauce.mainImage}
                              alt={stegaClean(
                                sauce.mainImage.alt ??
                                  sauce.name ??
                                  "Sauce jar",
                              )}
                              width={64}
                              height={64}
                              className="h-8 w-8 shrink-0 rounded-full border border-th-light-100/40 bg-th-light-100/10 object-contain p-0.5 shadow-sm"
                              loading="lazy"
                            />
                          ) : null}
                          <span>
                            {sauce.name}
                            {index < saucesWithMedia.length - 1 ? "," : ""}
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <span className="inline-flex items-center text-sm font-semibold text-brand-green-text transition-colors group-hover:text-th-light-100 group-focus:text-th-light-100 group-focus-visible:text-th-light-100">
                    View recipe{" "}
                    <span aria-hidden="true" className="ml-1">
                      &rarr;
                    </span>
                  </span>
                </div>
              </>
            );

            if (href) {
              return (
                <Link
                  key={recipe._id}
                  href={href}
                  className={`${cardClassName} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green`}
                  aria-label={`View recipe ${stegaClean(recipe.name ?? "")}`}
                >
                  {cardInner}
                </Link>
              );
            }

            return (
              <article
                key={recipe._id}
                className={cardClassName}
                aria-label={stegaClean(recipe.name ?? "Featured recipe")}
              >
                {cardInner}
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
