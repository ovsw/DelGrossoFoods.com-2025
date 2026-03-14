"use client";
import { SectionShell } from "@workspace/ui/components/section-shell";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import { SaucesClient } from "@/components/features/catalog/sauces-client";
import { DEFAULT_STATE, parseSearchParams } from "@/lib/sauces/url";
import { searchParamsToRecord } from "@/lib/search-params";
import type { SauceListItem } from "@/types";

type Props = {
  readonly items: SauceListItem[];
};

function SaucesCatalogSectionContent({ items }: Props) {
  const searchParams = useSearchParams();
  const initialState = useMemo(
    () =>
      searchParams
        ? parseSearchParams(searchParamsToRecord(searchParams))
        : DEFAULT_STATE,
    [searchParams],
  );

  return <SaucesClient items={items} initialState={initialState} />;
}

export function SaucesCatalogSection({ items }: Props) {
  return (
    <SectionShell
      spacingTop="default"
      spacingBottom="large"
      background="transparent"
      allowOverflow
    >
      <Suspense
        fallback={<SaucesClient items={items} initialState={DEFAULT_STATE} />}
      >
        <SaucesCatalogSectionContent items={items} />
      </Suspense>
    </SectionShell>
  );
}
