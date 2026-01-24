"use client";
import { SectionShell } from "@workspace/ui/components/section-shell";

import { ProductsClient } from "@/components/features/catalog/products-client";
import type { ProductQueryState } from "@/lib/products/url";
import type { ProductListItem } from "@/types";

type Props = {
  readonly items: ProductListItem[];
  readonly initialState: ProductQueryState;
};

export function ProductsCatalogSection({ items, initialState }: Props) {
  return (
    <SectionShell
      spacingTop="default"
      spacingBottom="large"
      background="transparent"
      allowOverflow
    >
      <ProductsClient items={items} initialState={initialState} />
    </SectionShell>
  );
}
