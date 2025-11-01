# Multi‑Site Editing with a Single Dataset and Multi‑Workspace Studio

This guide outlines a practical approach to run multiple websites from one Next.js app while giving editors a clean, separate experience for each site in a single Sanity Studio using multiple workspaces.

## Summary

- One Next.js app, many domains; host → site/brand resolver.
- One Sanity project/dataset; two Studio workspaces (Site A, Site B).
- Editors choose their site workspace; each workspace shows only relevant content.
- Content is scoped by `site` (single) or `sites` (array) references.
- Queries filter by `siteId`; styling is brand‑driven via CSS variables.

## Core Pieces

- Content model:
  - `site` document (id/key, label, domains, optional theme hints).
  - `page.site` (reference → `site`, required) for site‑specific pages.
  - `product.sites` (array<reference → `site`>) for shared/subset catalogs.
  - Slug uniqueness per site (custom `isUnique` scoped by `site._ref`).
- Studio workspaces (Studio v4):
  - Two `defineConfig` entries share the same `projectId`/`dataset`.
  - Workspace‑specific desk structure, initial values, new‑doc options, and document actions.
- Next.js integration:
  - Host → `siteId` resolver in `layout.tsx`/middleware.
  - Pass `siteId` to all GROQ queries; set `<html data-brand="…">` for styling.
- Presentation URLs route each workspace to the correct domain.

## Implementation Sketch

1. Schemas
   - Add `site` document; seed Site A/B.
   - Extend `page` with `site` (required); extend `product` with `sites` (array).
   - Implement site‑scoped slug uniqueness.
2. Studio (multi‑workspace)
   - Export two workspaces from `sanity.config.ts` (titles: “Site A”, “Site B”).
   - Desk structure factory: lists filtered by workspace `siteId`.
     - Pages: `_type == "page" && site._ref == $siteId`
     - Products: `_type == "product" && $siteId in sites[]._ref`
   - Initial value templates set membership by default per workspace.
   - New document options limited to the workspace’s types/templates.
   - Document actions hide/lock when a doc is outside the workspace’s membership.
3. Preview & Presentation
   - Workspace → domain map in `presentation-url.ts` (prod + local).
   - Include `siteId` param if previewing on a shared domain.
4. Web app
   - Host → `siteId` resolver; thread through `sanityFetch`.
   - CSS brand overrides via `[data-brand="…"]` variables (colors, fonts, patterns).

## Editor UX for Subsets

- Site B workspace shows only products where `B ∈ product.sites`.
- Optional doc action: “Add to/Remove from Site B” to toggle membership.
- For per‑site overrides (titles/pricing), add an overlay doc keyed by (product, site) and join in queries.

## Caveats & Gotchas

- Separation vs security: workspace filtering is a UX boundary, not a permissions wall. If strict isolation is required, use separate datasets.
- Global search can surface cross‑site docs; rely on desk lists and consider a filtered search tool if needed.
- Slug collisions: ensure your `isUnique` includes `site._ref`.
- Content migration: backfill `site`/`sites` on existing docs before enabling filters.
- Preview/local dev: configure per‑site domains/ports or host aliases so the app resolves `siteId` correctly.
- Roles: roles can restrict types, not per‑document membership—keep UI guardrails (structure, actions) in place.

## Key Files (by convention)

- `apps/studio/sanity.config.ts` (multi‑workspace config)
- `apps/studio/structure.ts` (desk structure factory by `siteId`)
- `apps/studio/plugins/presentation-url.ts` (workspace → domain)
- `apps/studio/schemaTypes/documents/site.ts` (site doc)
- `apps/web/src/app/layout.tsx` (host → `siteId`, brand data attribute)
- `apps/web/src/lib/sanity/query.ts` (site‑scoped GROQ queries)

## Minimal Query Patterns

- Page by slug & site:
  ```groq
  *[_type == "page" && site._ref == $siteId && slug.current == $slug][0] { ... }
  ```
- Products for a site:
  ```groq
  *[_type == "product" && $siteId in sites[]._ref] { ... }
  ```

## When to Split into Two Studios

- Choose separate Studio apps/URLs only if you need maximum psychological separation or operationally distinct deployments. Keep schema/structure shared and pass `siteId` at build time to avoid drift.

---

## Concrete Setup (Copy‑Pasteable Recipes)

The following sections provide concrete, workspace‑aware examples aligned with Studio v4 and Next.js App Router used in this repo.

### Multi‑Workspace Studio Config

Export multiple workspaces from `apps/studio/sanity.config.ts`, all pointing to the same `projectId`/`dataset`. Each workspace passes its `siteId` into structure/templates.

```ts
// apps/studio/sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure"; // make it a factory

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig([
  {
    name: "siteA",
    title: "Site A",
    projectId,
    dataset,
    plugins: [
      presentationTool({
        previewUrl: {
          origin: "https://a.example.com",
          previewMode: { enable: "/api/presentation-draft" },
        },
      }),
      structureTool({ structure: (S) => structure(S, { siteId: "siteA-id" }) }),
    ],
    schema: { types: schemaTypes },
  },
  {
    name: "siteB",
    title: "Site B",
    projectId,
    dataset,
    plugins: [
      presentationTool({
        previewUrl: {
          origin: "https://b.example.com",
          previewMode: { enable: "/api/presentation-draft" },
        },
      }),
      structureTool({ structure: (S) => structure(S, { siteId: "siteB-id" }) }),
    ],
    schema: { types: schemaTypes },
  },
]);
```

Note: If you prefer a single workspace (as in this repo today), you can still route Presentation URLs per document or per field action. See “Preview & Presentation” below.

### Workspace‑Aware Desk Structure

Filter lists using a `siteId` parameter so each workspace shows only its relevant docs.

```ts
// apps/studio/structure.ts
import type { StructureBuilder } from "sanity/structure";

export const structure = (
  S: StructureBuilder,
  { siteId }: { siteId: string },
) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.documentList()
            .title("Pages")
            .filter('_type == "page" && site._ref == $siteId')
            .params({ siteId }),
        ),
      S.listItem()
        .title("Products")
        .child(
          S.documentList()
            .title("Products")
            .filter('_type == "product" && $siteId in sites[]._ref')
            .params({ siteId }),
        ),
    ]);
```

This is a UX boundary only; it does not enforce permissions.

### Slug Uniqueness Scoped by Site

Ensure per‑site slug uniqueness across both drafts and published documents.

```ts
// slug uniqueness util
export const isUniqueWithinSite = (slug: string, ctx: any) => {
  const { document, getClient } = ctx;
  const siteId = document?.site?._ref;
  const id = String(document?._id || "").replace(/^drafts\./, "");
  if (!siteId) return true;
  const client = getClient({ apiVersion: "2023-10-01" });
  const params = { type: document?._type, slug, siteId, id };
  const query = `!defined(*[_type == $type && slug.current == $slug && site._ref == $siteId && !(_id in [$id, 'drafts.' + $id])][0]._id)`;
  return client.fetch(query, params);
};
```

Use it on `page.slug` (and other site‑scoped slugs):

```ts
defineField({
  name: "slug",
  type: "slug",
  options: { isUnique: isUniqueWithinSite },
});
```

### Preview & Presentation

Two viable patterns:

1. Workspace → external domain mapping (recommended when you export multiple workspaces):

```ts
// In each workspace's presentationTool config
presentationTool({
  previewUrl: {
    origin: "https://a.example.com",
    previewMode: { enable: "/api/presentation-draft" },
  },
});
```

2. Single workspace with a document field action that opens a Presentation route or external origin based on site membership:

```ts
// apps/studio/plugins/presentation-url.ts (example)
import { defineDocumentFieldAction } from "sanity";

const ORIGINS: Record<string, string> = {
  siteA: "https://a.example.com",
  siteB: "https://b.example.com",
};

export const openInPresentation = defineDocumentFieldAction({
  name: "open-in-presentation",
  useAction: ({ documentId, path, onAction, ...ctx }) => {
    const getFormValue = ctx.useGetFormValue?.() as any;
    return {
      type: "action" as const,
      title: "Open in Presentation",
      hidden: path.length > 0,
      onAction: () => {
        const slug = getFormValue(["slug", "current"]);
        const siteRef = getFormValue(["site", "_ref"]);
        const origin = siteRef === "siteB-id" ? ORIGINS.siteB : ORIGINS.siteA;
        const url = `${origin}/api/presentation-draft?slug=${encodeURIComponent(slug)}&siteId=${encodeURIComponent(siteRef)}`;
        window.open(url, "_blank");
      },
    };
  },
});
```

Align with your current implementation intent. This repo ships a field action that opens an in‑Studio Presentation route; switch to external origin mapping if you want to preview on the real domain.

### Next.js: Host → `siteId` Resolver

Resolve `siteId` from the request host and thread it through queries and a brand data attribute.

```ts
// apps/web/src/lib/site.ts
import { headers } from "next/headers";

const HOST_TO_SITE: Record<string, string> = {
  "a.example.com": "siteA-id",
  "b.example.com": "siteB-id",
  "a.localhost:3000": "siteA-id",
  "b.localhost:3000": "siteB-id",
};

export function resolveSiteId(): string {
  const host = headers().get("host")?.toLowerCase() ?? "";
  return HOST_TO_SITE[host] ?? "siteA-id";
}
```

Apply brand scoping in the root layout and pass `siteId` into GROQ queries via your `sanityFetch` params:

```tsx
// apps/web/src/app/layout.tsx (excerpt)
<html className="light" data-brand={siteId} style={{ colorScheme: 'light' }}>
```

### Per‑Site Overrides (Overlay Docs)

For fields that differ per site (e.g., product title/price), use an overlay document keyed by `(product, site)` and coalesce in queries.

```ts
// productSite.ts (document)
defineType({
  name: "productSite",
  type: "document",
  fields: [
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "site",
      type: "reference",
      to: [{ type: "site" }],
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "price", type: "number" }),
  ],
});
```

```groq
// Overlay projection example
*[_type == 'product' && $siteId in sites[]._ref]{
  ...,
  'title': coalesce(
    *[_type == 'productSite' && product._ref == ^._id && site._ref == $siteId][0].title,
    name
  ),
  'price': coalesce(
    *[_type == 'productSite' && product._ref == ^._id && site._ref == $siteId][0].price,
    price
  )
}
```

### Branding Tokens (Light‑Only Theme)

Prefer design token utilities under a `[data-brand=…]` scope rather than raw CSS variables. In this codebase, use Tailwind token utilities (e.g., `text-brand-green`) and avoid ad‑hoc `text-[var(--color-…)]` classes.

### Ops & Quality Gates

After any schema or GROQ changes:

- Generate Studio types: `pnpm --filter studio type`
- Then run Web checks: `pnpm -C apps/web lint:fix && pnpm -C apps/web typecheck`
- Skip full builds unless needed; keep Studio/Web types in sync.

### Migration & Backfill

If you’re enabling multi‑site on existing content, backfill membership before enforcing filters:

- Pages: set `page.site` to the appropriate site for all existing pages.
- Products: populate `product.sites` to include all applicable sites.
- Optionally add a one‑time script to patch documents with GROQ + mutations.

### Search Caveat & Mitigation

Global search can surface cross‑site docs. For stricter UX, hide the default search and/or add a custom, filtered search tool per workspace. This does not replace permissions; use separate datasets if you require hard isolation.

---

## AI Operator Notes (Agent‑Ready)

These notes help an AI coding agent implement and maintain the multi‑site setup with fewer mistakes.

### AI‑Ready Invariants

- Light‑only theme; never add `dark:` classes and keep `<html class="light" style={{ colorScheme: 'light' }}`>
- Prefer Tailwind token utilities (e.g., `text-brand-green`) under `[data-brand=…]`; avoid raw CSS var utilities like `text-[var(--color-…)]`.
- Use `defineLive` (apps/web/src/lib/sanity/live.ts) and pass `siteId` as a query param for caching separation.
- Do not expand images in GROQ unless explicitly required.
- Avoid legacy preview APIs (`useLiveQuery`, old preview-kit providers); use `defineLive` + Presentation Tool.
- Workspace scoping is UX‑only; use separate datasets for true isolation.

### Workspace Identity Map

Keep a canonical mapping for workspaces, site IDs, and domains. Store as code (e.g., `apps/web/src/lib/site.ts`) or documentation, then import where needed.

```json
{
  "siteA": {
    "siteId": "siteA-id",
    "domains": ["a.example.com", "a.localhost:3000"],
    "brand": "siteA"
  },
  "siteB": {
    "siteId": "siteB-id",
    "domains": ["b.example.com", "b.localhost:3000"],
    "brand": "siteB"
  }
}
```

Seeding `site` docs (stable IDs recommended):

```ts
// Example `site` docs to seed (ids must be stable across environments)
[
  {
    _id: "siteA-id",
    _type: "site",
    key: "siteA",
    label: "Site A",
    domains: ["a.example.com"],
  },
  {
    _id: "siteB-id",
    _type: "site",
    key: "siteB",
    label: "Site B",
    domains: ["b.example.com"],
  },
];
```

### Explicit Integration Points (Checklist)

- Host → `siteId` resolver and `data-brand` attribute: apps/web/src/app/layout.tsx
- Site‑scoped queries: apps/web/src/lib/sanity/query.ts
- Presentation URLs and Draft Mode: apps/studio/plugins/presentation-url.ts
- Studio structure filtering: apps/studio/structure.ts
- Initial value templates: apps/studio/sanity.config.ts (or helper)
- Slug uniqueness utils: used in relevant schemas

### Schema Snippets (Copy‑Paste)

Minimal `site` document:

```ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "site",
  type: "document",
  title: "Site",
  fields: [
    defineField({
      name: "key",
      type: "string",
      title: "Key",
      description: "Stable key used in code",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      type: "string",
      title: "Label",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "domains",
      type: "array",
      title: "Domains",
      of: [{ type: "string" }],
    }),
  ],
});
```

Attach `page.site` and `product.sites`:

```ts
defineField({
  name: "site",
  type: "reference",
  to: [{ type: "site" }],
  validation: (r) => r.required(),
}); // page
defineField({
  name: "sites",
  type: "array",
  of: [{ type: "reference", to: [{ type: "site" }] }],
}); // product
```

Optional document actions to toggle product site membership (sketch):

```ts
import { defineDocumentAction } from "sanity";
export const toggleSiteAction = (siteId: string) =>
  defineDocumentAction({
    name: `toggle-${siteId}`,
    label: `Toggle in ${siteId}`,
    onHandle: async ({ patch, draft, published }) => {
      const doc = draft || published;
      const refs = (doc?.sites || []).map((r: any) => r._ref);
      const has = refs.includes(siteId);
      if (has) patch.unset([{ path: "sites", if: { _ref: siteId } }]);
      else patch.append("sites", [{ _type: "reference", _ref: siteId }]);
    },
    hidden: ({ schemaType }) => schemaType.name !== "product",
  });
```

### Preview & Presentation Matrix

- Multiple workspaces: map each workspace to its domain via `presentationTool.previewUrl.origin`.
- Single workspace: compute origin based on document’s site (field action) and include `siteId` param.
- Local dev: create host aliases (`a.localhost:3000`, `b.localhost:3000`) or distinct ports; ensure resolver matches.

### Type Binding & Safety

- Import generated query result types from `apps/web/src/lib/sanity/sanity.types.ts`:

```ts
import type { GetProductBySlugQueryResult } from "@/lib/sanity/sanity.types";
```

- Re‑generate after schema/query edits: `pnpm --filter studio type`.

### Testing & Validation Checklist

- Desk filtering shows only current site’s pages/products.
- Slug collisions across sites allowed; collisions within a site rejected.
- Presentation opens correct domain and shows drafts in Draft Mode.
- Shared product membership toggle works; listings reflect changes.
- `data-brand` scoping applies token utilities; no raw CSS var utilities.
- Visible copy retains stega metadata; use `stegaClean` for aria/announce.

### Migration Playbook

- Backfill `page.site` and `product.sites` before enabling structure filters.
- Example identification queries:

```groq
// Pages missing site
*[_type == 'page' && !defined(site._ref)]._id
// Products missing sites
*[_type == 'product' && !defined(sites[0])]._id
```

### Failure Modes & Fixes

- Wrong domain in preview: verify workspace→origin map and local dev hosts.
- Empty desk lists: likely missing membership/backfill or wrong `siteId` param.
- Search shows cross‑site docs: mitigate with filtered search or hide default search.

### Performance & Caching

- With `defineLive`, include `siteId` in query params to distinguish cache keys and reduce cross‑site invalidations.
- Avoid wide unscoped queries; always filter by `siteId`.

### CI/CD & Env Matrix

- Studio: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, optional workspace labels.
- Web: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN` (server only), `VERCEL_*` as needed.
- Next Image allowlist depends on `NEXT_PUBLIC_SANITY_PROJECT_ID` (apps/web/next.config.ts).

### Reference Locations (Quick Links)

- apps/studio/sanity.config.ts (workspaces/config)
- apps/studio/structure.ts (desk filtering)
- apps/studio/plugins/presentation-url.ts (presentation behavior)
- apps/studio/schemaTypes/\*\* (schemas)
- apps/web/src/app/layout.tsx (`data-brand` application)
- apps/web/src/lib/site.ts (host→siteId resolver; if added)
- apps/web/src/lib/sanity/query.ts (site‑scoped queries)
