"use client";

import { WhereToBuyClient as SharedWhereToBuyClient } from "@workspace/ui/components/where-to-buy-client";

import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import {
  allStates,
  getStoresByState,
  productLineLabels,
  storeLogos,
} from "@/lib/stores/data";

type WhereToBuyClientProps = {
  sanityDocumentId?: string | null;
  sanityDocumentType?: string | null;
  sanityFieldPath?: string | null;
};

export function WhereToBuyClient({
  sanityDocumentId,
  sanityDocumentType,
  sanityFieldPath = "pageBuilder",
}: WhereToBuyClientProps) {
  const dataAttribute = createPresentationDataAttribute({
    documentId: sanityDocumentId,
    documentType: sanityDocumentType,
    path: sanityFieldPath,
  });

  return (
    <SharedWhereToBuyClient
      allStates={allStates}
      getStoresByState={getStoresByState}
      productLineLabels={productLineLabels}
      storeLogos={storeLogos}
      productFilterOptions={[]}
      forcedProductFilter="la-famiglia"
      showProductLineBadges={false}
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
