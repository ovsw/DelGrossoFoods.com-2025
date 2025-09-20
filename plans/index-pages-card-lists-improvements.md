# Index Pages and Card Lists: Architecture Review and Improvement Plan

This document reviews the current implementation of the list pages (`/sauces`, `/store`, `/recipes`) and their card/list components, and proposes targeted improvements to simplify, reduce duplication, and strengthen maintainability while preserving UX and Live Content API behavior.

## Current Architecture Overview

- Shared card abstraction: `ListCard` encapsulates image aspect/fit, subtitle, badges, and A11y.
  - Reference: `apps/web/src/components/list/list-card.tsx`
- Page structure: server components fetch CMS copy + items in parallel, parse URL state, then render a client “container” for filters and results.
  - Sauces: `apps/web/src/app/sauces/page.tsx`
  - Store (Products): `apps/web/src/app/store/page.tsx`
  - Recipes: `apps/web/src/app/recipes/page.tsx`
- Client containers manage filter state, URL syncing, and results rendering with a shared layout.
  - Sauces: `apps/web/src/components/sauces/sauces-client.tsx`
  - Products: `apps/web/src/components/products/products-client.tsx`
  - Recipes: `apps/web/src/components/recipes/recipes-client.tsx`
  - Shared layout: `apps/web/src/components/filterable/filterable-list-layout.tsx`
- Taxonomy helpers normalize Sanity Live Preview strings and provide stable slugs and badge variants.
  - Sauces/product lines/types: `apps/web/src/config/sauce-taxonomy.ts`
  - Product packaging: `apps/web/src/config/product-taxonomy.ts`
  - Recipe tags/meats: `apps/web/src/config/recipe-taxonomy.ts`
- Filter utilities are domain-specific but follow the same pattern: search → filters → sort.
  - Sauces: `apps/web/src/lib/sauces/filters.ts`
  - Products: `apps/web/src/lib/products/filters.ts`
  - Recipes: `apps/web/src/lib/recipes/filters.ts`

Strengths

- Clean separation of concerns (data fetch vs UI state vs layout).
- Good A11y patterns (aria-live result counts, focus-visible, removable chips).
- Consistent URL sync via `history.replaceState` for shareable filter state.
- `FilterableListLayout` nicely unifies sidebar vs mobile drawer and chips.

## Duplication and Streamlining Opportunities

- Repeated client-side plumbing across all three containers:
  - Debounced search hook implemented three times.
  - URL synchronization effect duplicated.
  - First-paint hydration guard duplicated.
  - Sort dropdown markup repeated verbatim.
- Overlap in filter utilities:
  - `sortByName` and `filterBySearch` exist independently per domain with almost identical logic (different item keys).
- Page intro/header duplication:
  - Each page repeats the same container + heading + paragraph block.
- Card-level duplication:
  - Building `href` and aria label text across `SauceCard`, `ProductCard`, `RecipeCard`.
  - `ProductCard` re-derives uniqueness of type/line inline instead of leveraging existing helpers consistently.
- Minor inconsistencies:
  - Grid gaps/breakpoints vary without an explicit shared styling rationale.
  - Recipes uses a custom `resultsAnchorId`; others rely on the default.

## Targeted Improvements (Low Risk, High Leverage)

1. Extract a small shared hooks kit

- `useDebouncedValue<T>(value, delay=200)` in `apps/web/src/hooks/use-debounced-value.ts`.
- `useUrlStateSync({ pathname, state, serialize })` that encapsulates the `replaceState` effect.
- Optional: `useFirstPaint()` returning a boolean to standardize hydration flash avoidance.

2. Share a `SortDropdown` component

- Props: `value: SortOrder`, `onChange(value)`, optional `label`.
- Replaces repeated dropdown markup in all three clients.

3. Introduce a reusable `IndexIntro` server component

- Renders the consistent container + heading + intro copy with fallbacks.
- Used by `sauces/page.tsx`, `recipes/page.tsx`, and `store/page.tsx` to reduce boilerplate.

4. Factor filter UI primitives

- Small composables used inside each domain `FiltersForm`:
  - `SearchField` (label, placeholder, clear button, a11y props)
  - `CheckboxList` (items, checked, onToggle)
  - `RadioList` (items, value, onChange)
  - `ClearSection` (contextual clear button)
- Keeps domain logic per page but removes repeated structure/styling code.

5. Consolidate shared filter utilities

- Move `sortByName` + `filterBySearch` into a shared util (e.g., `apps/web/src/lib/list/shared-filters.ts`) with generic options (keys to search, locale, etc.).
- Leave domain-specific filters (e.g., product mix handling, category constraints) in their modules.

6. Normalize card helpers

- `buildHref(base: "/sauces" | "/recipes" | "/store", slug: string)` to unify path composition.
- Use taxonomy helpers to compute unique line/type in `ProductCard` rather than ad hoc set logic.

7. Image delivery enhancement in `ListCard`

- Expose a `sizes` prop (with sensible default e.g. `"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`) to cut bandwidth on mobile.
- Surface `loading`, `priority` plumbing if not already handled by `sanity-image` wrapper.

8. Styling consistency

- Standardize grid gaps and breakpoints across list pages or codify intentional differences with a small token map in `@workspace/ui`.

## Scalable Architecture Options (Later, If Needed)

- Generic filterable list hook
  - `useFilterableList<TItem, TState>({ items, initialState, applyFilters, serialize })` returning `{ state, setState, results, resultsText, firstPaint, clearFns }`.
  - Each screen keeps its domain `FiltersForm` but loses most boilerplate.

- Server-driven filtering (progressive enhancement)
  - If item counts grow large, consider performing filtering server-side based on search params, while preserving fast client toggles.

- Search performance
  - Load Fuse.js lazily on first search interaction or move search to a Web Worker for very large lists.

## A11y and SEO Notes

- A11y is solid (live regions, focus-visible, chip buttons with labels). Keep parity when factoring primitives.
- Metadata generation could be de-duplicated via a small helper (e.g., `buildIndexMetadata(query, fallback)`), but current approach is correct and readable.

## Suggested Refactor Roadmap

- Step 1: Extract shared hooks (`useDebouncedValue`, `useUrlStateSync`, `useFirstPaint`).
- Step 2: Add `SortDropdown` and replace repeated dropdowns in all clients.
- Step 3: Add `IndexIntro` and adopt in the three list pages.
- Step 4: Factor filter UI primitives and adopt inside existing `FiltersForm`s.
- Step 5: Move common `sortByName` and `filterBySearch` to `lib/list/shared-filters.ts` and update domain modules to import them.
- Step 6: Normalize card helpers (`buildHref` + taxonomy helpers in `ProductCard`).
- Step 7 (optional): Add `sizes`/`loading` options to `ListCard` and pass defaults.

Each step is incremental and non-breaking; you can stage them in small PRs.

## Risks and Mitigations

- Risk: Over-abstracting filter UIs makes domain forms harder to read.
  - Mitigation: Keep primitives small and focused; do not hide domain logic.
- Risk: Changing search utilities affects perceived results quality.
  - Mitigation: Preserve current Fuse options; only centralize the function.
- Risk: Layout consistency changes affect visual density.
  - Mitigation: Document intended grid/gap differences and encode them as explicit props or tokens.

## Key References (selected)

- List Card: `apps/web/src/components/list/list-card.tsx`
- List Layout: `apps/web/src/components/filterable/filterable-list-layout.tsx`
- Client Containers:
  - Sauces: `apps/web/src/components/sauces/sauces-client.tsx`
  - Products: `apps/web/src/components/products/products-client.tsx`
  - Recipes: `apps/web/src/components/recipes/recipes-client.tsx`
- Pages:
  - `apps/web/src/app/sauces/page.tsx`
  - `apps/web/src/app/store/page.tsx`
  - `apps/web/src/app/recipes/page.tsx`
- Filters:
  - `apps/web/src/lib/sauces/filters.ts`
  - `apps/web/src/lib/products/filters.ts`
  - `apps/web/src/lib/recipes/filters.ts`
- Taxonomy:
  - `apps/web/src/config/sauce-taxonomy.ts`
  - `apps/web/src/config/product-taxonomy.ts`
  - `apps/web/src/config/recipe-taxonomy.ts`

---

If you want, I can start with Step 1 (shared hooks) and Step 2 (SortDropdown) as a minimal PR to demonstrate the wins with very limited churn.
