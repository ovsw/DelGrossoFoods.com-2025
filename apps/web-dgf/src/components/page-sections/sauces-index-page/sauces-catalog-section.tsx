"use client";
import { SectionShell } from "@workspace/ui/components/section-shell";

import { SaucesClient } from "@/components/features/catalog/sauces-client";
import type { SauceQueryState } from "@/lib/sauces/url";
import type { SauceListItem } from "@/types";

type Props = {
  readonly items: SauceListItem[];
  readonly initialState: SauceQueryState;
};

export function SaucesCatalogSection({ items, initialState }: Props) {
  return (
    <SectionShell
      spacingTop="default"
      spacingBottom="large"
      background="transparent"
      allowOverflow
    >
      <SaucesClient items={items} initialState={initialState} />
    </SectionShell>
  );
}
