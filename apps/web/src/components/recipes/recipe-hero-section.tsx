import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { stegaClean } from "next-sanity";

import { BackLink } from "@/components/elements/back-link";
import { SanityImage } from "@/components/elements/sanity-image";
import type { RecipeDetailData } from "@/types";

interface RecipeHeroSectionProps {
  readonly recipe: RecipeDetailData;
}

export function RecipeHeroSection({ recipe }: RecipeHeroSectionProps) {
  // Name: visible uses raw; logic/alt use cleaned
  const rawName = recipe.name ?? "";
  const cleanedName = stegaClean(rawName);
  const recipeName = rawName && rawName !== "" ? rawName : cleanedName;

  // Categories for eyebrow
  const categories = recipe.categories ?? [];
  const categoryNames = categories.map((cat) => cat.title).filter(Boolean);
  const eyebrowText =
    categoryNames.length > 0 ? categoryNames.join(", ") : "Recipe";

  return (
    <>
      {/* Large hero image section */}
      <div className="relative">
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
          {recipe.mainImage?.id ? (
            <SanityImage
              image={recipe.mainImage}
              alt={
                typeof cleanedName === "string" && cleanedName.trim()
                  ? `${cleanedName.trim()} recipe`
                  : "Recipe image"
              }
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <div className="text-muted-foreground text-lg">Recipe Image</div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="mb-4">
              <Eyebrow text={eyebrowText} className="text-white/80" />
            </div>
            <h1 className="text-4xl font-bold md:text-6xl">{recipeName}</h1>
            {recipe.serves && (
              <p className="mt-2 text-lg">Serves: {recipe.serves}</p>
            )}
            {recipe.meat && recipe.meat.length > 0 && (
              <p className="mt-2 text-lg">Meat: {recipe.meat.join(", ")}</p>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
              <p className="mt-2 text-lg">Tags: {recipe.tags.join(", ")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation section */}
      <Section spacingTop="default" spacingBottom="default">
        <div className="container mx-auto px-4 md:px-6">
          <BackLink href="/recipes" label="All Recipes" />
        </div>
      </Section>
    </>
  );
}
