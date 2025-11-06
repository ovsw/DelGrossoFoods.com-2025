import { sanityFetch } from "@workspace/sanity-config/live";
import {
  getRecipeByIdQuery,
  getSaucesByIdsQuery,
} from "@workspace/sanity-config/query";
import type { GetSaucesByIdsQueryResult } from "@workspace/sanity-config/types";

import { RelatedSaucesLayout } from "@/components/layouts/related-sauces-layout";
import { SingleRelatedSauceLayout } from "@/components/layouts/single-related-sauce-layout";
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

  const count = saucesWithImages.length;
  if (count === 1) {
    return <SingleRelatedSauceLayout item={saucesWithImages[0]!} />;
  }
  return (
    <RelatedSaucesLayout
      items={saucesWithImages}
      title={"Sauces for this recipe"}
      eyebrow={"Featured sauces"}
      description={"These sauces pair perfectly with this recipe."}
    />
  );
}
