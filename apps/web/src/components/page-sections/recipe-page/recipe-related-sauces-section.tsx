import { RelatedItemsLayout } from "@/components/layouts/related-items-layout";
import { sanityFetch } from "@/lib/sanity/live";
import { getRecipeByIdQuery, getSaucesByIdsQuery } from "@/lib/sanity/query";
import type { GetSaucesByIdsQueryResult } from "@/lib/sanity/sanity.types";
import { handleErrors } from "@/utils";

interface RecipeRelatedSaucesSectionProps {
  readonly recipeId: string;
}

export async function RecipeRelatedSaucesSection({
  recipeId,
}: RecipeRelatedSaucesSectionProps) {
  // First fetch the recipe to get related sauce IDs
  const [recipeResult] = await handleErrors(
    sanityFetch({
      query: getRecipeByIdQuery,
      params: { id: recipeId },
    }),
  );

  const recipe = recipeResult?.data;
  if (!recipe) return null;

  // Extract sauce IDs from both DGF and LFD sauces arrays
  const dgfSauceIds =
    recipe.dgfSauces?.map((sauce: { _id: string }) => sauce._id) ?? [];
  const lfdSauceIds =
    recipe.lfdSauces?.map((sauce: { _id: string }) => sauce._id) ?? [];
  const sauceIds = [...dgfSauceIds, ...lfdSauceIds];

  // Return early if no related sauces
  if (sauceIds.length === 0) return null;

  // Fetch sauces using the extracted IDs
  const [saucesResult] = await handleErrors(
    sanityFetch({
      query: getSaucesByIdsQuery,
      params: { sauceIds },
    }),
  );
  const sauces = (saucesResult?.data ?? []) as GetSaucesByIdsQueryResult;

  if (sauces.length === 0) return null;

  // Filter out sauces without mainImage since layout expects non-null mainImage
  const saucesWithImages = sauces.filter(
    (sauce) => sauce.mainImage !== null,
  ) as Array<{
    _id: string;
    _type: "sauce";
    name: string;
    slug: string;
    line: "Original" | "Organic" | "Ultra-Premium";
    category: "Pasta Sauce" | "Pizza Sauce" | "Salsa Sauce" | "Sandwich Sauce";
    descriptionPlain: string;
    mainImage: NonNullable<GetSaucesByIdsQueryResult[number]["mainImage"]>;
  }>;

  // Return early if no sauces have images to avoid rendering empty layout
  if (saucesWithImages.length === 0) return null;

  return (
    <RelatedItemsLayout
      items={saucesWithImages}
      type="sauce"
      variant="single-item-prominent"
      title={saucesWithImages.length > 1 ? "Sauces for this recipe" : undefined}
      eyebrow={saucesWithImages.length > 1 ? "Featured sauces" : undefined}
      description={
        saucesWithImages.length > 1
          ? "These sauces pair perfectly with this recipe."
          : "This sauce pairs perfectly with this recipe."
      }
      showHeader={saucesWithImages.length > 1}
    />
  );
}
