import { createDataAttribute } from "next-sanity";

import { dataset, projectId, studioUrl } from "@/config";

type PresentationAttributeConfig = {
  documentId?: string | null;
  documentType?: string | null;
  path?: string | null;
};

export function createPresentationDataAttribute({
  documentId,
  documentType,
  path,
}: PresentationAttributeConfig): string | null {
  if (!documentId || !documentType || !path) {
    return null;
  }

  return createDataAttribute({
    id: documentId,
    type: documentType,
    path,
    baseUrl: studioUrl,
    projectId,
    dataset,
  }).toString();
}
