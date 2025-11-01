# Sanity Preview + Visual Editing Parity Plan (API 2025-02-19+)

This plan closes the gaps for Live Preview (stega metadata) and click‑to‑edit overlays via Presentation, while keeping production reads deterministic with a single perspective. It inventories all queries, verifies environment/config alignment, and outlines validation and rollout.

## Objectives

- Ensure stega metadata is emitted for all DOM‑visible text so click‑to‑edit works everywhere.
- Remove path‑based draft gates from GROQ and rely on a single perspective per client.
- Keep production reads strictly `published` with CDN; enable previews through overlays.
- Validate all queries and Studio integrations for Perspectives/Releases compatibility.

## Current Status (as of this plan)

- Web client uses a single perspective and always-on stega for visible content:
  - apps/web/src/lib/sanity/client.ts:12 — `perspective: "published"`
  - apps/web/src/lib/sanity/client.ts:16 — `stega: { studioUrl }` (always on)
- Draft-mode enable endpoint wired to Presentation tool:
  - apps/web/src/app/api/presentation-draft/route.ts:1
- Visual Editing and SanityLive mounted correctly:
  - apps/web/src/app/layout.tsx:89 — `<VisualEditing />` under draft mode
  - apps/web/src/app/layout.tsx:106 — `<SanityLive />` at end of body
- Removed last path-based draft filter from web queries:
  - apps/web/src/lib/sanity/query.ts:780 — removed `!(_id in path('drafts.**'))` in `getRecipeBySlugQuery`

## Remaining Work — Action Plan

1. Confirm env alignment across Web and Studio

- Web envs present and correct: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SANITY_API_READ_TOKEN`.
- Studio envs present: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_TITLE`, `SANITY_STUDIO_PRESENTATION_URL` (required in production).
- Verify Next images allowlist picks up project ID (apps/web/next.config.ts:13).

2. Sanity client, Live bridge, and Presentation

- Keep `perspective: 'published'` for all server reads in Web.
- Keep `stega` enabled globally in client; continue to use `stegaClean(...)` for aria/logic only.
- No legacy preview providers anywhere.
- If we later add `client.listen` for dashboards, pass `{ includeAllVersions: true }` (API ≥ 2025‑02‑19).

3. GROQ audit and cleanup

- Remove any residual path‑based draft filters (none remain in Web after the recipe fix).
- Do not add “complex perspectives” in queries; rely on the client perspective + overlays.
- Restrict `stega: false` only to server‑only/SEO fetches (e.g., `generateMetadata`).

4. Studio structure, actions, uniqueness

- Keep Presentation tool configured with draft-mode enable route:
  - apps/studio/sanity.config.ts:34 — `previewMode.enable: "/api/presentation-draft"`
- Replace ID‑prefix heuristics for “edited” state when feasible:
  - apps/studio/utils/helper.ts:148 — `edited: item._originalId?.startsWith("drafts.")` (acceptable for now; consider Presentation-derived signal later).
- Maintain API version pins for validators and scripts (already done):
  - apps/studio/utils/slug-validation.ts:300 — `getClient({ apiVersion: "2025-02-19" })`
- For admin scripts that truly need drafts, prefer `_id match 'drafts.*'` over path filters (already used in mutations/delete scripts).

5. QA and validation

- Presentation: From Studio, open any doc → Presentation → confirm:
  - Overlays appear on headings and visible text.
  - Draft updates reflect instantly; turning draft mode off shows only published.
- Pages to verify end‑to‑end:
  - Home: apps/web/src/app/page.tsx:10
  - Slug pages: apps/web/src/app/[...slug]/page.tsx:11
  - Blog index/slug: apps/web/src/app/blog/page.tsx:22, apps/web/src/app/blog/[slug]/page.tsx:13
  - Sauce index/slug: apps/web/src/app/sauces/page.tsx:19, apps/web/src/app/sauces/[slug]/page.tsx:21
  - Recipe index/slug: apps/web/src/app/recipes/page.tsx:23, apps/web/src/app/recipes/[slug]/page.tsx:22
  - Product index/slug: apps/web/src/app/store/page.tsx:43, apps/web/src/app/store/[slug]/page.tsx:85
  - History/Contact/Where to buy: apps/web/src/app/history/page.tsx:13, apps/web/src/app/contact/page.tsx:11, apps/web/src/app/where-to-buy/page.tsx:13

6. Observability and troubleshooting

- Next logging is enabled (apps/web/next.config.ts:10) — inspect fetch logs during Presentation.
- If overlays fail, verify:
  - `NEXT_PUBLIC_SANITY_STUDIO_URL` points to running Studio.
  - `SANITY_API_READ_TOKEN` is set and valid (viewer scope).
  - No `stega: false` on page data fetches (only allowed for metadata/OG).

## Query Inventory and Audit Notes (Web)

All queries live at apps/web/src/lib/sanity/query.ts. None contain path‑based draft filters anymore. Client perspective is `published`, so overlays will supply drafts/releases in Presentation.

- queryImageType apps/web/src/lib/sanity/query.ts:300 — type reference only, OK.
- queryHomePageData apps/web/src/lib/sanity/query.ts:307 — OK.
- querySlugPageData apps/web/src/lib/sanity/query.ts:317 — OK.
- querySlugPagePaths apps/web/src/lib/sanity/query.ts:325 — OK.
- queryBlogIndexPageData apps/web/src/lib/sanity/query.ts:329 — Uses `seoHideFromLists`; no draft path checks, OK.
- queryBlogSlugPageData apps/web/src/lib/sanity/query.ts:346 — OK.
- queryBlogPaths apps/web/src/lib/sanity/query.ts:357 — OK.
- queryHomePageOGData apps/web/src/lib/sanity/query.ts:393 — OG only, OK.
- querySlugPageOGData apps/web/src/lib/sanity/query.ts:399 — OG only, OK.
- queryBlogPageOGData apps/web/src/lib/sanity/query.ts:405 — OG only, OK.
- queryGenericPageOGData apps/web/src/lib/sanity/query.ts:411 — OG only, OK.
- queryFooterData apps/web/src/lib/sanity/query.ts:417 — OK.
- queryNavbarData apps/web/src/lib/sanity/query.ts:438 — OK.
- querySitemapData apps/web/src/lib/sanity/query.ts:475 — Lists with `defined(slug.current)`, OK.
- queryGlobalSeoSettings apps/web/src/lib/sanity/query.ts:497 — OK.
- querySettingsData apps/web/src/lib/sanity/query.ts:517 — OK.
- getSauceIndexPageQuery apps/web/src/lib/sanity/query.ts:529 — OK.
- getAllSaucesForIndexQuery apps/web/src/lib/sanity/query.ts:548 — OK.
- getSaucesByIdsQuery apps/web/src/lib/sanity/query.ts:567 — OK.
- getSauceBySlugQuery apps/web/src/lib/sanity/query.ts:587 — OK.
- getRecipeIndexPageQuery apps/web/src/lib/sanity/query.ts:628 — OK.
- getAllRecipesForIndexQuery apps/web/src/lib/sanity/query.ts:647 — OK.
- getRecipesBySauceIdQuery apps/web/src/lib/sanity/query.ts:670 — OK.
- getRecipesBySauceIdsQuery apps/web/src/lib/sanity/query.ts:696 — OK.
- getAllRecipeCategoriesQuery apps/web/src/lib/sanity/query.ts:723 — OK.
- getRecipeByIdQuery apps/web/src/lib/sanity/query.ts:727 — OK.
- getRecipeBySlugQuery apps/web/src/lib/sanity/query.ts:778 — OK (path‑based draft exclusion removed).
- getProductIndexPageQuery apps/web/src/lib/sanity/query.ts:830 — OK.
- getAllProductsForIndexQuery apps/web/src/lib/sanity/query.ts:849 — OK.
- getProductsBySauceIdQuery apps/web/src/lib/sanity/query.ts:870 — OK.
- getProductBySlugQuery apps/web/src/lib/sanity/query.ts:895 — OK.
- getHistoryPageQuery apps/web/src/lib/sanity/query.ts:938 — OK.
- getStoreLocatorPageQuery apps/web/src/lib/sanity/query.ts:978 — OK.
- getContactPageQuery apps/web/src/lib/sanity/query.ts:989 — OK.

Inline/other fetchers using Web client (perspective applies):

- OG data API: apps/web/src/app/api/og/og-data.ts:11
- Sitemap: apps/web/src/app/sitemap.ts:13
- JSON-LD settings: apps/web/src/components/elements/json-ld.tsx:249

SEO-only/no-stega fetches (intentional):

- apps/web/src/app/blog/page.tsx:22 — `stega: false` for metadata generation
- apps/web/src/app/[...slug]/page.tsx:19 — `stega: false` for metadata generation
- apps/web/src/app/blog/[slug]/page.tsx:13 — overrides stega flag per call for metadata

Note on images: Existing queries expand image fields via shared fragments; do not refactor unless requested, as UI code expects this structure.

## Studio Inventory and Audit Notes

- Presentation tool configured with locations + preview URL:
  - apps/studio/sanity.config.ts:26–40
- Custom document action for quick Presentation navigation:
  - apps/studio/plugins/presentation-url.ts:12–39
- Uniqueness validator and slug helpers pin API version and avoid path‑based filters:
  - apps/studio/utils/slug-validation.ts:300
- Admin/mutation scripts use `_id match 'drafts.*'` where needed (acceptable):
  - apps/studio/mutations/delete-by-type.ts:109
- Migration/backfill scripts use explicit draft prefixes where appropriate; no path filters.

## Acceptance Criteria

- Click‑to‑edit overlays appear across all visible text that maps to Sanity content while in Presentation/draft mode.
- No errors about “complex perspectives” at runtime.
- All GROQ queries typecheck after changes and produce expected shapes.
- SEO/OG and sitemap continue to work; no accidental stega in generated metadata.

## Commands

```bash
# Typegen and typechecks
pnpm --filter studio type
pnpm --filter web format && pnpm --filter web lint:fix && pnpm --filter web typecheck

# Optional builds for confidence
pnpm --filter web build
pnpm --filter studio build
```

## Rollback

- To disable overlays quickly (not recommended), set `stega: { studioUrl, enabled: false }` in apps/web/src/lib/sanity/client.ts:16 and clear draft-mode.
- Revert any GROQ edits if necessary; rerun Studio typegen.

## Appendix — Troubleshooting Checklist

- Overlays missing? Validate `NEXT_PUBLIC_SANITY_STUDIO_URL` and that Studio is reachable from Web.
- Draft updates not appearing? Confirm draft mode is enabled via the Presentation tool and `VisualEditing` is mounted.
- Missing content in preview only? Check for leftover `stega: false` on page data fetches (should be limited to SEO routes/metadata only).
