import * as React from "react";

import { RelatedProductsLayout } from "@/components/layouts/related-products-layout";
import { SingleRelatedProductLayout } from "@/components/layouts/single-related-product-layout";
import { sanityFetch } from "@/lib/sanity/live";
import { getProductsBySauceIdQuery } from "@/lib/sanity/query";
import type { GetProductsBySauceIdQueryResult } from "@/lib/sanity/sanity.types";
import { handleErrors } from "@/utils";

interface SauceRelatedProductsSectionProps {
  readonly sauceId: string;
}

type ProductWithImage = GetProductsBySauceIdQueryResult[number] & {
  mainImage: NonNullable<GetProductsBySauceIdQueryResult[number]["mainImage"]>;
};

function isProductWithImage(
  product: GetProductsBySauceIdQueryResult[number],
): product is ProductWithImage {
  return product.mainImage !== null && product.mainImage.id !== "";
}

export async function SauceRelatedProductsSection({
  sauceId,
}: SauceRelatedProductsSectionProps): Promise<React.JSX.Element | null> {
  // Use existing Sanity query and types
  const [result, error] = await handleErrors(
    sanityFetch({
      query: getProductsBySauceIdQuery,
      params: { sauceId },
    }),
  );

  // Handle errors from sanityFetch
  if (error) {
    console.error("Failed to fetch products for sauce:", error);
    return null;
  }

  // Type guard to validate result data is an array
  function isProductsArray(
    data: unknown,
  ): data is GetProductsBySauceIdQueryResult {
    return Array.isArray(data);
  }

  const products = isProductsArray(result?.data) ? result.data : [];

  if (products.length === 0) return null;

  // Filter out products without mainImage since layout expects non-null mainImage
  const productsWithImages = products.filter(isProductWithImage);

  const count = productsWithImages.length;
  if (count === 1) {
    return (
      <SingleRelatedProductLayout
        item={productsWithImages[0]!}
        title="Bring DelGrosso sauces to your pantry"
        eyebrow="Order online"
        description="Pick a bundle and stock up straight from our store."
      />
    );
  }
  return (
    <RelatedProductsLayout
      items={productsWithImages}
      title="Bring DelGrosso sauces to your pantry"
      eyebrow="Order online"
      description="Pick a bundle and stock up straight from our store."
      primaryCta={{
        text: "Shop all products",
        href: "/store",
        variant: "default",
      }}
    />
  );
}
