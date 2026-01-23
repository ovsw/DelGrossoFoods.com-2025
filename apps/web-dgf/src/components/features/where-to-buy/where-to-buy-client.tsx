"use client";

import { WhereToBuyClient as SharedWhereToBuyClient } from "@workspace/ui/components/where-to-buy-client";
import type {
  WhereToBuyProductFilterOption,
  WhereToBuyProductLine,
  WhereToBuyProductLineLabels,
  WhereToBuyStateStores,
  WhereToBuyStoreChain,
} from "@workspace/ui/components/where-to-buy-types";
import { useCallback, useMemo } from "react";

import { createPresentationDataAttribute } from "@/lib/sanity/presentation";

type WhereToBuyClientProps = {
  sanityDocumentId?: string | null;
  sanityDocumentType?: string | null;
  sanityFieldPath?: string | null;
  allStates: string[];
  storeLocations: WhereToBuyStateStores[];
  productLineLabels: WhereToBuyProductLineLabels;
  productFilterOptions: WhereToBuyProductFilterOption[];
};

export function WhereToBuyClient({
  sanityDocumentId,
  sanityDocumentType,
  sanityFieldPath = "pageBuilder",
  allStates,
  storeLocations,
  productLineLabels,
  productFilterOptions,
}: WhereToBuyClientProps) {
  const dataAttribute = createPresentationDataAttribute({
    documentId: sanityDocumentId,
    documentType: sanityDocumentType,
    path: sanityFieldPath,
  });

  const getStoresByState = useCallback(
    (
      state: string,
      productLineFilter?: WhereToBuyProductLine,
    ): WhereToBuyStoreChain[] => {
      const found = storeLocations.find((entry) => entry.state === state);
      if (!found) return [];

      if (!productLineFilter) return found.stores;

      return found.stores.filter((store) =>
        store.productLines.some((line) => line.line === productLineFilter),
      );
    },
    [storeLocations],
  );

  const stableStates = useMemo(() => allStates, [allStates]);

  return (
    <SharedWhereToBuyClient
      allStates={stableStates}
      getStoresByState={getStoresByState}
      productLineLabels={productLineLabels}
      productFilterOptions={productFilterOptions}
      rootProps={
        dataAttribute
          ? {
              "data-sanity": dataAttribute,
            }
          : undefined
      }
    />
  );
}
