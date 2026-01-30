import { Eyebrow } from "@workspace/ui/components/eyebrow";
import {
  RecipeCard as RecipeHighlightCard,
  type RecipeCardBadge,
  type RecipeCardSauce,
} from "@workspace/ui/components/recipe-card";
import { Section } from "@workspace/ui/components/section";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
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
}: FeaturedRecipesBlockProps) {
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
            <Eyebrow text={eyebrow} className="text-brand-green" />
          ) : null}

          {title ? (
            <HeadingTag className="mt-3 text-pretty text-3xl font-semibold tracking-tight text-th-dark-900 sm:text-4xl">
              {title}
            </HeadingTag>
          ) : null}

          {intro ? (
            <p className="mt-4 text-pretty text-base text-th-dark-700 sm:text-lg">
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
            const badges: RecipeCardBadge[] = [...meatBadges, ...tagBadges];
            const sauces: RecipeCardSauce[] = saucesWithMedia.map((sauce) => ({
              name: sauce.name,
              image: sauce.mainImage ? (
                <SanityImage
                  image={sauce.mainImage}
                  alt={stegaClean(
                    sauce.mainImage.alt ?? sauce.name ?? "Sauce jar",
                  )}
                  width={64}
                  height={64}
                  loading="lazy"
                />
              ) : undefined,
            }));
            const titleText = recipe.name ?? "Featured recipe";
            const ariaLabel = href
              ? `View recipe ${stegaClean(titleText)}`
              : stegaClean(titleText);

            return (
              <RecipeHighlightCard
                key={recipe._id}
                href={href || undefined}
                title={titleText}
                ariaLabel={ariaLabel}
                image={
                  recipe.mainImage ? (
                    <SanityImage
                      image={recipe.mainImage}
                      alt={stegaClean(
                        recipe.mainImage.alt ?? recipe.name ?? "Recipe image",
                      )}
                      width={640}
                      height={640}
                      loading="lazy"
                    />
                  ) : undefined
                }
                badges={badges}
                sauces={sauces}
              />
            );
          })}
        </div>
      </div>
    </Section>
  );
}
