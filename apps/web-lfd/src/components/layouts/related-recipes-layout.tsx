import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";

import { RecipeCard } from "@/components/elements/recipe-card";
import type { RecipeListItem } from "@/types";

export interface RelatedRecipesLayoutProps {
  readonly items: RecipeListItem[];
  readonly title?: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly variant?: "default" | "single-item-prominent";
}

export function RelatedRecipesLayout({
  items,
  title = "Related recipes",
  eyebrow = "Recipe ideas",
  description = "Try these recipes featuring this sauce.",
  variant = "default",
}: RelatedRecipesLayoutProps) {
  if (!items || items.length === 0) return null;
  const count = items.length;

  return (
    <Section id="related-recipes" spacingTop="large" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6">
        {(title || eyebrow || description) && (
          <div className="flex flex-col items-center text-center">
            {eyebrow ? <Eyebrow text={eyebrow} /> : null}
            {title ? <h2 className="heading-section">{title}</h2> : null}
            {description ? (
              <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        )}

        {count === 1 && variant === "single-item-prominent" ? (
          <div className="mt-16 grid items-center gap-8 ">
            <div className="mx-auto w-full max-w-xl">
              <RecipeCard item={items[0]!} />
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
            {items.map((recipe) => (
              <RecipeCard key={recipe._id} item={recipe} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
