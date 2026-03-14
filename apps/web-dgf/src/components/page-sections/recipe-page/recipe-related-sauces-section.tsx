import { sanityFetch } from "@workspace/sanity-config/live";
import { getSaucesByIdsQuery } from "@workspace/sanity-config/query";
import type { GetSaucesByIdsQueryResult } from "@workspace/sanity-config/types";

import { RelatedSaucesLayout } from "@/components/layouts/related-sauces-layout";
import { SingleRelatedSauceLayout } from "@/components/layouts/single-related-sauce-layout";
import { handleErrors } from "@/utils";

interface RecipeRelatedSaucesSectionProps {
  readonly sauceIds: readonly string[];
}

export async function RecipeRelatedSaucesSection({
  sauceIds,
}: RecipeRelatedSaucesSectionProps) {
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
