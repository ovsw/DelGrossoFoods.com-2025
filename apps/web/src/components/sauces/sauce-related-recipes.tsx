import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";

import { RecipeCard } from "@/components/recipes/recipe-card";
import type { RecipeListItem } from "@/types";

interface SauceRelatedRecipesProps {
  readonly recipes: RecipeListItem[];
}

export function SauceRelatedRecipes({ recipes }: SauceRelatedRecipesProps) {
  if (recipes.length === 0) return null;

  const count = recipes.length;
  const relatedCopy = "Try these recipes featuring this sauce.";

  return (
    <Section id="related-recipes" spacingTop="large" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <Eyebrow text="Recipe ideas" />
          <h2 className="mt-4 text-3xl font-semibold text-balance md:text-5xl">
            Related recipes
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
            {relatedCopy}
          </p>
        </div>

        {count === 1 ? (
          <div className="mt-16 grid items-center gap-8 ">
            <div className="mx-auto w-full max-w-xl">
              <RecipeCard item={recipes[0]!} />
            </div>
          </div>
        ) : (
          <div
            className={
              "mt-16 grid gap-6 " +
              (count === 2
                ? "sm:grid-cols-2"
                : count === 3
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid-cols-2 xl:grid-cols-4")
            }
          >
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} item={recipe} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
