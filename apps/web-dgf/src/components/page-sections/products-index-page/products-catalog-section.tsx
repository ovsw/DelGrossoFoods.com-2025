"use client";
import { SectionShell } from "@workspace/ui/components/section-shell";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import { ProductsClient } from "@/components/features/catalog/products-client";
import { DEFAULT_STATE, parseSearchParams } from "@/lib/products/url";
import { searchParamsToRecord } from "@/lib/search-params";
import type { ProductListItem } from "@/types";

type Props = {
  readonly items: ProductListItem[];
};

function ProductsCatalogSectionContent({ items }: Props) {
  const searchParams = useSearchParams();
  const initialState = useMemo(
    () =>
      searchParams
        ? parseSearchParams(searchParamsToRecord(searchParams))
        : DEFAULT_STATE,
    [searchParams],
  );

  return <ProductsClient items={items} initialState={initialState} />;
}

export function ProductsCatalogSection({ items }: Props) {
  return (
    <SectionShell
      spacingTop="default"
      spacingBottom="large"
      background="transparent"
      allowOverflow
    >
      <Suspense
        fallback={<ProductsClient items={items} initialState={DEFAULT_STATE} />}
      >
        <ProductsCatalogSectionContent items={items} />
      </Suspense>
    </SectionShell>
  );
}
