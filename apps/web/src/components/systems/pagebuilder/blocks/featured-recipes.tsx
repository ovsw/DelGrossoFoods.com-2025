import { Section } from "@workspace/ui/components/section";

import { RecipeCard } from "@/components/elements/recipe-card";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

export type FeaturedRecipesBlockProps =
  PageBuilderBlockProps<"featuredRecipes">;

// Renders three selected recipes in a responsive grid (Tailwind UI-style card grid)
export function FeaturedRecipesBlock({
  recipes,
  spacing,
  isPageTop = false,
}: FeaturedRecipesBlockProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const items = recipes ?? [];
  if (!items.length) return null;

  return (
    <Section
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <RecipeCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </Section>
  );
}
