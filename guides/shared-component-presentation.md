## Sharing UI Components While Preserving Sanity Presentation Metadata

When we move Sanity-driven UI into `packages/ui`, we must keep Sanity’s click-to-edit metadata in the app layer. Use the following pattern whenever you extract components that render content sourced from Sanity.

### 1. Keep Sanity Context in Each App

Create a small helper that wraps `createDataAttribute` so every app can generate `data-sanity` strings without copying boilerplate. Example (`apps/web-dgf/src/lib/sanity/presentation.ts`):

```ts
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
  if (!documentId || !documentType || !path) return null;

  return createDataAttribute({
    id: documentId,
    type: documentType,
    path,
    baseUrl: studioUrl,
    projectId,
    dataset,
  }).toString();
}
```

Do the same in any sibling app (e.g., `apps/web-lfd`).

### 2. Expose a Metadata Slot in the Shared Component

In the shared UI component (inside `packages/ui`):

1. Import the shared typing helper from `packages/ui/src/lib/data-attributes.ts` (e.g., `RootProps<HTMLDivElement>` or `DataAttributes`) so every component handles metadata consistently.
2. Add an optional prop (e.g., `rootProps?: RootProps<HTMLDivElement>`) so consumers can pass `data-*`, ARIA, or IDs.
3. Spread those props onto the outermost wrapper:

```tsx
import { type RootProps } from "../lib/data-attributes";

export type WhereToBuyClientProps = {
  /* existing props */
  rootProps?: RootProps<HTMLDivElement>;
};

export function WhereToBuyClient({
  rootProps,
  ...props
}: WhereToBuyClientProps) {
  const { className, ...rest } = rootProps ?? {};
  return (
    <div className={cn("mt-12", className)} {...rest}>
      {/* component contents */}
    </div>
  );
}
```

> Keep the shared component presentation-agnostic: no direct imports from app `config` or `next-sanity`.

### 3. Create an App-Level Wrapper

Inside each app, build a thin wrapper that:

1. Knows the Sanity document ID/type/field path.
2. Calls `createPresentationDataAttribute`.
3. Passes the resulting string through `rootProps`.

```tsx
import { WhereToBuyClient as SharedWhereToBuyClient } from "@workspace/ui/components/where-to-buy-client";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import {
  allStates,
  getStoresByState,
  productLineLabels,
  storeLogos,
} from "@/lib/stores/data";

type Props = {
  sanityDocumentId?: string | null;
  sanityDocumentType?: string | null;
  sanityFieldPath?: string | null;
};

export function WhereToBuyClient({
  sanityDocumentId,
  sanityDocumentType,
  sanityFieldPath = "pageBuilder",
}: Props) {
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
```

### Wrapper Expectations Checklist

Whenever you build one of these thin wrappers, mirror the following contract:

- **Props**: Accept `sanityDocumentId`, `sanityDocumentType`, and `sanityFieldPath` (default `"pageBuilder"`) so the wrapper works for page sections, blocks, and feature clients without additional plumbing.
- **Metadata fan-out**: Call `createPresentationDataAttribute` for each editable surface and pass it down via `rootProps` (and other slots like `imageProps` if the shared component exposes them) so every clickable element remains traceable in Presentation.
- **Null safety**: If any part of the trio is missing, skip the attribute altogether—never fabricate IDs or reuse a stale string.
- **Field-level tagging**: Pages/sections should still tag surrounding headings, paragraphs, and CTAs with their own attributes so editors can click exactly what they expect.
- **Stega hygiene**: Keep stega metadata on all visible content; only call `stegaClean` when using text for aria labels, IDs, or announcer messages.

### 4. Forward Document Context from the Page/Section

When a page or section renders the wrapper, pass the document metadata:

```tsx
const documentId = data?._id ?? null;
const documentType = data?._type ?? null;

<WhereToBuyClient
  sanityDocumentId={documentId}
  sanityDocumentType={documentType}
/>;
```

Also tag any local elements (titles, descriptions) with field-level attributes so Presentation continues to work across the entire surface.

### 5. QA in Sanity Presentation

After extracting a component:

1. Open the page in Presentation mode.
2. Verify the shared area highlights correctly and “click to edit” jumps to the expected document/field.
3. If it fails, confirm the wrapper received a valid `documentId`, `documentType`, and `path`.

### Why This Pattern Matters

- **Keeps shared UI clean**: `packages/ui` stays free of CMS-specific code.
- **Preserves editor workflows**: Editors can still click any shared widget and edit the source document.
- **Reusable**: Next component you extract only needs a `rootProps` slot and an app-level wrapper.

Whenever you move Sanity-backed UI into a shared package, follow this checklist to keep Presentation metadata intact. Save time later by copying the helper + wrapper structure shown above.
