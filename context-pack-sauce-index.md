You are a coding assistant. Follow the docs below in the given authority order.

AUTHORITY

1. PRD = business constraints (tie-breaker on scope/URLs/data model)
2. Plan = implementation plan (tie-breaker on code structure/tasks)

WHEN YOU RESPOND

1. Open questions (if any)
2. Next commit(s): files touched + diffs/code blocks
3. Test/QA checklist

--- PRD (short) ---

# PRD: Sauces Index Page (/sauces)

## Objective

Build an accessible, SSR-first Sauces Index page that lists all published `sauce` documents from Sanity with client-side filtering, sorting, and deep-linkable state via query params. No pagination for now. Images lazy-load. Fully keyboard-accessible. Mobile uses a filter Sheet.

## Scope

- In scope: SSR data fetch; client filtering (search, product line multi-select, sauce type single-select), sorting (name A→Z/Z→A), URL param sync, responsive layout (sidebar on desktop, sheet on mobile), a11y.
- Out of scope: backend filtering; Finsweet; featured block; analytics; facet counts (can be added later); pagination.

## Data Model

- Source: Sanity `sauce` docs (published only).
- Fields used: `name` (string), `slug` (string, required, unique), `line` ("Original" | "Organic" | "Ultra-Premium"), `category` ("Pasta Sauce" | "Pizza Sauce" | "Salsa Sauce" | "Sandwich Sauce"), `description` (richText), `mainImage` (image with `asset._ref`, `metadata.lqip`, `hotspot`, `crop`, `alt`).
- Page copy/SEO: `sauceIndex` document.

## Routes

- Index: `/sauces` (App Router)
- Detail: `/sauces/[slug]`

## URL Parameters (Deep-Linkable State)

- `search`: string; fuzzy search across `name` and plain-text description.
- `productLine`: multi-valued; canonical slugs (e.g., `productLine=original&productLine=organic`).
- `sauceType`: single-valued; canonical slug (e.g., `sauceType=pasta`); `all` or omitted == no filter.
- `sort`: `az` (default) | `za`.

Canonical value slugs (config-driven):

- Lines: `original`, `organic`, `premium` (maps to Sanity `Ultra-Premium`).
- Types: `pasta`, `pizza`, `salsa`, `sandwich`.

## Label Translations and Colors (Config)

Create `apps/web/src/config/sauce-taxonomy.ts`:

- Mapping between canonical slugs ↔ Sanity labels + display labels.
  - Lines display labels: Original → "Original"; Organic → "Organic"; Ultra-Premium → "Premium" (confirmed).
  - Types display labels: full names (e.g., "Pasta Sauce").
- Badge color tokens (via CSS var classes or styles):
  - Lines: Organic → `--color-th-green-500`; Original → `--color-th-red-600`; Premium → `--color-th-dark-900`.
  - Types: Pasta Sauce → `--color-brand-red`; Pizza Sauce → `--color-brand-yellow`; Salsa Sauce → `--color-brand-green`; Sandwich Sauce → neutral.
- Helpers:
  - `toLineSlug(label)`, `toTypeSlug(label)`
  - `fromLineSlug(slug)`, `fromTypeSlug(slug)`
  - `getLineBadge(label)` / `getTypeBadge(label)` → `{ text: string, colorVar: string }`

## Data Fetching (SSR + Live)

- Queries in `apps/web/src/lib/sanity/query.ts`:
  - `getSauceIndexPageQuery`: fetch `sauceIndex` doc (title, description, SEO fields).
  - `getAllSaucesForIndexQuery`: fetch all published sauces ordered by `name asc` with projection:
    - `_id`, `name`, `"slug": slug.current`, `line`, `category`,
    - `"descriptionPlain": pt::text(description)`,
    - `mainImage{ "id": asset._ref, "preview": asset->metadata.lqip, hotspot, crop, alt }`.
- Live (preview): wrap list area in next-sanity LiveQuery boundary when draft/preview is enabled using same query + params.
- Production: plain SSR; no revalidate needed (live queries handle freshness in preview; production relies on SSR on request or ISR as globally configured if any).

## Server-Side Behavior

- Parse `searchParams` in the server page and compute initial filtered+sorted list (using same pure functions as client) to avoid hydration flash. Still fetch the full dataset on the server. Hydration picks up with identical state.

## Client Filtering & Sorting

- Base array: SSR dataset.
- Search: fuzzy across `name` and `descriptionPlain`. Use Fuse.js with keys `["name", "descriptionPlain"]`, threshold ~0.3, case-insensitive; debounce input 200ms.
- Product Line: multi-select inclusion based on line slug.
- Sauce Type: single-select equality; `all` disables the filter.
- Sort: by `name` using `localeCompare('en-US', { sensitivity: 'base' })`; `az` ascending, `za` descending.
- URL syncing: Reflect changes via `router.replace` with updated query params; don’t scroll.

## Layout & Responsiveness

- Desktop (≥lg): two-column layout with left filter sidebar (sticky) and right card grid.
  - Grid columns: 3 (lg), 2 (md), 1 (sm).
- Mobile (<lg): hide sidebar; show a "Filters" button that opens `Sheet` from `@workspace/ui`. The sheet contains the same filters and an "Apply" button that commits changes (URL + state) and closes the sheet.

## Components

- Page: `apps/web/src/app/sauces/page.tsx` (server component)
  - Fetch `sauceIndex` and all sauces; parse `searchParams`; compute initial filtered list; render header + pass data and initial state into client component.
- Client: `apps/web/src/components/sauces/sauces-client.tsx`
  - Renders: top bar (filters button on mobile, results count, sort dropdown), sidebar or sheet filters, and the grid.
  - Manages: state, URL syncing, fuzzy search, filtering, sorting, a11y announcements.
- Card: `apps/web/src/components/sauce-card.tsx`
  - Entire card clickable (`Link` wrapper to `/sauces/[slug]`), `SanityImage` mainImage with LQIP; heading (`h3`) for name; line/type badges using taxonomy config.
- Reuse from `@workspace/ui`: `Sheet`, `DropdownMenu`, `Badge`, `Button`.

## Filters UI

- Search: labeled input ("Search sauces"); clear button.
- Product Line: checkbox group (Original, Organic, Premium). Legend/fieldset; each checkbox labeled.
- Sauce Type: radio group (All, Pasta Sauce, Pizza Sauce, Salsa Sauce, Sandwich Sauce). Legend/fieldset.
- Actions: per-section "Clear" and global "Clear all".

## Accessibility

- Use semantic `fieldset`/`legend` for filter groups.
- Native inputs with visible labels; adequate hit targets.
- Results count uses `aria-live="polite"` to announce changes.
- Card link has discernible name (e.g., `aria-label="View {name} sauce"`). Visible focus ring.
- Sheet: labeled header, focus trap, ESC closes, restores focus to trigger button.

## Performance

- SSR initial render with filtered list when params are present.
- Client filtering is memoized; search debounced (200ms).
- Images lazy-load via `SanityImage` with LQIP; specify width/height to avoid CLS.
- Keep deps minimal (Fuse.js for fuzzy only).

## Error & Empty States

- If Sanity fetch fails: render safe fallback (header + empty state), log server error.
- If 0 matches: show generic message and "Clear all" action.

## Acceptance Criteria

- `/sauces` SSR renders title/description + all sauces by default.
- URL params control initial SSR filtering; reloading deep links preserves view.
- Search fuzzy-matches; debounce works; clearing restores list.
- Product Line multi-select narrows results; Sauce Type single-select filters; Clear and Clear all function.
- Sorting defaults to A→Z and toggles to Z→A; persists in URL.
- Mobile filter sheet works; Apply closes sheet and applies filters; focus management correct.
- A11y: labels, focus, live region; keyboard-only usage verified.
- Lint, typecheck, build pass.

## Implementation Tasks

1. Queries: add `getSauceIndexPageQuery`, `getAllSaucesForIndexQuery` in `apps/web/src/lib/sanity/query.ts` using existing image fragments style.
2. Config: create `apps/web/src/config/sauce-taxonomy.ts` with mappings, colors, and helpers.
3. Page: implement `apps/web/src/app/sauces/page.tsx` (server) to fetch, SSR-apply initial filtering, and render structure.
4. Client: implement `apps/web/src/components/sauces/sauces-client.tsx` with URL syncing and a11y.
5. Card: add `apps/web/src/components/sauce-card.tsx` using `SanityImage` + badges.
6. Wire UI: use `@workspace/ui` `Sheet`, `DropdownMenu`, `Badge`, `Button`.
7. QA: run `pnpm -C apps/web lint:fix && pnpm -C apps/web typecheck && pnpm -C apps/web build`.

--- PLAN ---

<?xml version="1.0" encoding="UTF-8"?>
<plan id="sauces-index" version="1.0" status="pending" created="2025-09-15">
  <summary>
    <title>Sauces Index Page (/sauces)</title>
    <objective>
      Build an accessible, SSR-first Sauces Index that lists all published sauce documents from Sanity with client-side filtering, sorting, and deep-linkable URL state. No pagination initially. Images lazy-load. Full keyboard accessibility. Mobile uses a filter Sheet.
    </objective>
    <scope>
      <in>
        <item>SSR data fetch</item>
        <item>Client filtering: search, product line multi-select, sauce type single-select</item>
        <item>Sorting: name az/za</item>
        <item>URL param sync (deep-linkable state)</item>
        <item>Responsive layout: desktop sidebar, mobile Sheet</item>
        <item>Accessibility</item>
      </in>
      <out>
        <item>Backend filtering</item>
        <item>Finsweet</item>
        <item>Featured block</item>
        <item>Analytics</item>
        <item>Facet counts</item>
        <item>Pagination</item>
      </out>
    </scope>
  </summary>

  <assumptions>
    <item>Sanity types exist for sauce and sauceIndex; slugs for sauce use /sauces/... prefix.</item>
    <item>next-sanity defineLive is configured; use sanityFetch pattern.</item>
    <item>@workspace/ui provides Button, Badge, DropdownMenu, Sheet with Tailwind v4 tokens.</item>
    <item>App is light-only; no dark variants or theme toggles.</item>
  </assumptions>

  <deliverables>
    <item>Route /sauces with SSR initial filtering and consistent hydration.</item>
    <item>Sanity queries for sauceIndex meta and full sauce list projection.</item>
    <item>Client filters, sorting, URL syncing, and a11y live updates.</item>
    <item>Card UI using SanityImage with LQIP and taxonomy badges.</item>
    <item>XML plan with progress tracking (this document).</item>
  </deliverables>

  <dependencies>
    <runtime>
      <dep name="fuse.js" workspace="apps/web" purpose="fuzzy search" required="true" />
      <dep name="@workspace/ui" purpose="UI primitives (Button, Badge, DropdownMenu, Sheet)" required="true" />
    </runtime>
    <env>
      <var>NODE_ENV</var>
      <var>NEXT_PUBLIC_SANITY_PROJECT_ID</var>
      <var>SANITY_API_READ_TOKEN</var>
    </env>
  </dependencies>

  <files>
    <file path="apps/web/src/lib/sanity/query.ts" role="add-queries" />
    <file path="apps/web/src/config/sauce-taxonomy.ts" role="taxonomy-config" />
    <file path="apps/web/src/lib/sauces/filters.ts" role="pure-filter-sort-search" />
    <file path="apps/web/src/lib/sauces/url.ts" role="parse-serialize-url-state" />
    <file path="apps/web/src/app/sauces/page.tsx" role="server-route" />
    <file path="apps/web/src/components/sauces/sauces-client.tsx" role="client-ui-state" />
    <file path="apps/web/src/components/sauce-card.tsx" role="card" />
    <file path="apps/web/src/types.ts" role="types-augment" />
  </files>

  <taxonomy>
    <line-slugs>
      <map slug="original" label="Original" display="Original" colorVar="--color-th-red-600" />
      <map slug="organic" label="Organic" display="Organic" colorVar="--color-th-green-500" />
      <map slug="premium" label="Ultra-Premium" display="Premium" colorVar="--color-th-dark-900" />
    </line-slugs>
    <type-slugs>
      <map slug="pasta" label="Pasta Sauce" display="Pasta Sauce" colorVar="--color-brand-red" />
      <map slug="pizza" label="Pizza Sauce" display="Pizza Sauce" colorVar="--color-brand-yellow" />
      <map slug="salsa" label="Salsa Sauce" display="Salsa Sauce" colorVar="--color-brand-green" />
      <map slug="sandwich" label="Sandwich Sauce" display="Sandwich Sauce" colorVar="" />
    </type-slugs>
  </taxonomy>

  <phases>
    <phase index="0" name="DesignAndPrep" status="pending">
      <tasks>
        <task id="0.1" status="pending">Confirm taxonomy canonical slugs and display labels.</task>
        <task id="0.2" status="pending">Verify color tokens exist in packages/ui/src/styles/globals.css.</task>
        <task id="0.3" status="pending">Identify reusable SSR/SEO patterns from blog index and SanityImage usage.</task>
        <task id="0.4" status="pending">Decide on pure utility locations for shared server/client logic.</task>
      </tasks>
      <outputs>
        <output>Validated taxonomy and tokens.</output>
        <output>Confirmed file layout for utilities and components.</output>
      </outputs>
      <done-when>Taxonomy and tokens are confirmed; file layout finalized.</done-when>
    </phase>

    <phase index="1" name="DataAndConfig" status="pending">
      <tasks>
        <task id="1.1" status="pending">Add getSauceIndexPageQuery to query.ts.</task>
        <task id="1.2" status="pending">Add getAllSaucesForIndexQuery with projection (_id, name, slug, line, category, descriptionPlain, mainImage fields).</task>
        <task id="1.3" status="pending">Create sauce-taxonomy.ts with mappings, colors, helpers.</task>
      </tasks>
      <outputs>
        <output>Two queries implemented and typed.</output>
        <output>Taxonomy config module with helpers.</output>
      </outputs>
      <done-when>Queries compile and taxonomy helpers export types.</done-when>
    </phase>

    <phase index="2" name="TypesAndUtilities" status="pending">
      <tasks>
        <task id="2.1" status="pending">Augment apps/web/src/types.ts with index response types.</task>
        <task id="2.2" status="pending">Create filters.ts with pure filter/search/sort functions (Fuse.js threshold ~0.3).</task>
        <task id="2.3" status="pending">Create url.ts to parse/serialize SauceQueryParams.</task>
      </tasks>
      <outputs>
        <output>Shared pure utilities for server and client.</output>
      </outputs>
      <done-when>Utilities unit-tested informally and types validated by typecheck.</done-when>
    </phase>

    <phase index="3" name="ServerRoute" status="pending">
      <tasks>
        <task id="3.1" status="pending">Implement /sauces page.tsx server component.</task>
        <task id="3.2" status="pending">Fetch sauceIndex and sauces via sanityFetch.</task>
        <task id="3.3" status="pending">Parse searchParams and compute initial results with shared utilities.</task>
        <task id="3.4" status="pending">Render header and pass SSR data + initial state to client component.</task>
        <task id="3.5" status="pending">Add generateMetadata using getSEOMetadata.</task>
        <task id="3.6" status="pending">Handle error and empty states gracefully.</task>
      </tasks>
      <outputs>
        <output>SSR page that matches URL-driven initial state.</output>
      </outputs>
      <done-when>Reload of deep links preserves filtered/sorted results.</done-when>
    </phase>

    <phase index="4" name="ClientUI" status="pending">
      <tasks>
        <task id="4.1" status="pending">Implement sauces-client.tsx with state, debounced search, filters, sorting.</task>
        <task id="4.2" status="pending">URL syncing via router.replace without scroll.</task>
        <task id="4.3" status="pending">Desktop: sticky sidebar; Mobile: Sheet with Apply and focus management.</task>
        <task id="4.4" status="pending">Add aria-live results count and labeled inputs.</task>
        <task id="4.5" status="pending">Sorting via @workspace/ui DropdownMenu.</task>
      </tasks>
      <outputs>
        <output>Interactive, accessible client UI.</output>
      </outputs>
      <done-when>Keyboard-only interactions fully supported; URL reflects state.</done-when>
    </phase>

    <phase index="5" name="CardComponent" status="pending">
      <tasks>
        <task id="5.1" status="pending">Implement sauce-card.tsx with SanityImage, badges, and accessible Link.</task>
        <task id="5.2" status="pending">Ensure width/height set to avoid CLS; use LQIP preview.</task>
      </tasks>
      <outputs>
        <output>Reusable SauceCard for the grid.</output>
      </outputs>
      <done-when>Images lazy-load and focus ring is visible.</done-when>
    </phase>

    <phase index="6" name="QAAndPolish" status="pending">
      <tasks>
        <task id="6.1" status="pending">Run lint, typecheck, and build for apps/web.</task>
        <task id="6.2" status="pending">Manual QA against acceptance criteria (desktop and mobile).</task>
        <task id="6.3" status="pending">Create a changeset for web (patch).</task>
      </tasks>
      <outputs>
        <output>Passing quality gates and changeset recorded.</output>
      </outputs>
      <done-when>All acceptance criteria are met; build succeeds.</done-when>
    </phase>

  </phases>

  <acceptance-criteria>
    <item>/sauces SSR renders title/description and all sauces by default.</item>
    <item>URL params control initial SSR filtering; refresh preserves the view.</item>
    <item>Fuzzy search debounced; clear restores list.</item>
    <item>Product line multi-select; sauce type single-select; per-section Clear and global Clear all.</item>
    <item>Sorting defaults to az, toggles to za, persists in URL.</item>
    <item>Mobile Sheet applies filters and manages focus correctly.</item>
    <item>A11y: fieldset/legend, labeled controls, aria-live updates, focus-visible, ESC closes Sheet.</item>
    <item>Lint, typecheck, build pass for apps/web.</item>
  </acceptance-criteria>

  <a11y>
    <requirement>Use semantic fieldset/legend for filter groups.</requirement>
    <requirement>Native inputs with visible labels and adequate target size.</requirement>
    <requirement>aria-live="polite" on results count; announce changes.</requirement>
    <requirement>Card link with discernible name: aria-label="View {name} sauce".</requirement>
    <requirement>Sheet has labeled header, focus trap, ESC to close, restores focus to trigger.</requirement>
  </a11y>

  <performance>
    <guideline>SSR initial render uses server-side filtered list when params exist.</guideline>
    <guideline>Memoize client filtering; debounce search by 200ms.</guideline>
    <guideline>SanityImage uses LQIP and explicit width/height to avoid CLS.</guideline>
    <guideline>Minimize deps; use Fuse.js only for fuzzy search.</guideline>
  </performance>

  <risks>
    <risk id="r1">
      <desc>Large dataset without pagination may slow SSR and client filtering.</desc>
      <mitigation>Keep projection minimal; consider server-side filtering or pagination later if needed.</mitigation>
    </risk>
    <risk id="r2">
      <desc>URL state complexity could drift between server and client.</desc>
      <mitigation>Centralize parse/serialize utilities and reuse on both sides.</mitigation>
    </risk>
    <risk id="r3">
      <desc>Live preview behavior divergence.</desc>
      <mitigation>Use sanityFetch consistently; keep optional Live boundary isolated.</mitigation>
    </risk>
  </risks>

  <commands>
    <quality-gates>
      <cmd>pnpm -C apps/web lint:fix</cmd>
      <cmd>pnpm -C apps/web typecheck</cmd>
      <cmd>pnpm -C apps/web build</cmd>
    </quality-gates>
    <versioning>
      <cmd>pnpm changeset:add</cmd>
      <note>Select only web; choose patch; add concise summary.</note>
    </versioning>
  </commands>

  <progress>
    <current phase="0" task="0.0" status="pending" updated="2025-09-15" />
    <history>
      <event ts="2025-09-15">Plan created from PRD and saved.</event>
    </history>
    <instructions>
      Update phase and task status attributes (pending|in_progress|completed) as work advances. Keep exactly one in_progress task at a time. Record notable events in &lt;history&gt;.</instructions>
  </progress>

  <appendix>
    <routes>
      <index>/sauces</index>
      <detail>/sauces/[slug]</detail>
      <url-params>
        <param name="search" type="string" />
        <param name="productLine" type="multi" canonical="original|organic|premium" />
        <param name="sauceType" type="single" canonical="pasta|pizza|salsa|sandwich" />
        <param name="sort" type="enum" values="az|za" default="az" />
      </url-params>
    </routes>
    <ui-imports>
      <import>@workspace/ui/components/button</import>
      <import>@workspace/ui/components/badge</import>
      <import>@workspace/ui/components/dropdown-menu</import>
      <import>@workspace/ui/components/sheet</import>
    </ui-imports>
  </appendix>
</plan>
