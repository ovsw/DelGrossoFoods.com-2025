"use client";
import { Section } from "@workspace/ui/components/section";

import { ProductsClient } from "@/components/features/catalog/products-client";
import type { ProductQueryState } from "@/lib/products/url";
import type { ProductListItem } from "@/types";

type Props = {
  readonly items: ProductListItem[];
  readonly initialState: ProductQueryState;
};

export function ProductsCatalogSection({ items, initialState }: Props) {
  return (
    <Section spacingTop="default" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6">
        <ProductsClient items={items} initialState={initialState} />
      </div>
    </Section>
  );
}
