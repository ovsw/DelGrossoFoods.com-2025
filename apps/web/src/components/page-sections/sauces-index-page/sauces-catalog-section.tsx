"use client";
import { Section } from "@workspace/ui/components/section";

import { SaucesClient } from "@/components/features/catalog/sauces-client";
import type { SauceQueryState } from "@/lib/sauces/url";
import type { SauceListItem } from "@/types";

type Props = {
  readonly items: SauceListItem[];
  readonly initialState: SauceQueryState;
};

export function SaucesCatalogSection({ items, initialState }: Props) {
  return (
    <Section spacingTop="default" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6">
        <SaucesClient items={items} initialState={initialState} />
      </div>
    </Section>
  );
}
