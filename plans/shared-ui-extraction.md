# Shared UI Extraction Plan

## Goals

- Reduce duplicate UI between `web-dgf` and `web-lfd` while keeping each site’s branding hooks.
- Preserve Sanity Presentation click-to-edit, Live content, and announcer behavior by following `guides/shared-component-presentation.md`.
- Keep `packages/ui` CMS-agnostic; each app remains responsible for data fetching, stega cleaning, and metadata wiring.

## Guiding Principles

- Each shared component exposes `rootProps` (and `imageProps` when needed) for `data-*` attributes, aria hooks, and class overrides.
- App-level wrappers call `createPresentationDataAttribute` (one helper per app) and pass document context down.
- Sanity-derived strings stay stega-tagged in visible DOM; aria/logic values use `stegaClean` before announcing.
- After any block extraction, re-verify Presentation mode to ensure click targets map to the right field path.

## Workstreams & Tasks

### 1. Foundation Prep

- [x] Audit both apps for `createPresentationDataAttribute`; clone helper into any app lacking it (e.g., `apps/web-lfd/src/lib/sanity/presentation.ts`).
- [x] Add a reusable `DataAttributes` utility in `packages/ui` for consistent `rootProps` typing.
- [x] Document wrapper expectations (props, metadata flow) in `guides/shared-component-presentation.md` if gaps remain.

### 2. Shared Foundations (Atoms/Molecules)

- [x] Move `SanityImage`, `SurfaceShineOverlay`, `BackLink`, `SocialIcons`, `SanityButtons`, typography helpers, and any identical atoms into `packages/ui`.
- [x] Refactor app imports to use shared components while passing dataset/project IDs only where unavoidable (e.g., `SanityImage`).
- [x] Ensure each extracted component exposes `rootProps` and optional slots so wrappers can inject metadata or brand-specific nodes.

### 3. Listing & Card System

- [x] Extract `ListCard` into `packages/ui` (presentation only: layout, badges, image slots, CTA styling).
- [x] Update `ProductCard`, `SauceCard`, and similar wrappers in both apps to compute badges/copy, then delegate rendering to the shared `ListCard` with `rootProps` + `imageProps` for Sanity metadata.
- [x] Smoke test catalog grids on both sites to confirm layout, hover, and link behavior remain intact.

### 4. Catalog Feature Clients

- [x] Identify common UI/state management in `components/features/catalog/*-client.tsx` (filter toolbar, chips, grid, empty states).
- [x] Extract shared state machines + UI shells into `packages/ui` while keeping dataset queries and taxonomy mapping inside each app wrapper.
- [x] Provide extension points for site-specific copy (intro text, badge labels) via props/slots.

### 5. Global Chrome & Layout Skeletons

- [x] Design shared `NavbarShell`, `FooterShell`, and `SectionShell` components that own spacing, responsive grids, and token usage.
- [x] Create site-specific wrappers that fetch GROQ data, pass logos/menus/social links, and attach `data-sanity` attributes per field.
- [x] Validate keyboard/focus behavior and aria labels remain unchanged after swapping in the shells.
- [ ] Begin migrating existing page sections to `SectionShell` (or app-specific wrappers) so spacing/background logic is centralized.

### 6. Pagebuilder Blocks

- [ ] For each block (CTA, feature, accordion, featured recipes, image link cards, newsletter, slideshow, three-product panels, long form), split presentation into `packages/ui` and keep data-wiring wrappers in each app.
- [ ] Ensure block wrappers pass `sanityDocumentId`, `_type`, and `path` down via `rootProps`, matching the optimistic rendering logic in `components/systems/pagebuilder/pagebuilder.tsx`.
- [ ] After migrating each block, QA in Sanity Presentation to confirm click-to-edit surfaces light up correctly.

### 7. Where-to-Buy & Feature Systems

- [ ] Leverage existing shared `WhereToBuyClient` by ensuring both apps wrap it uniformly (state data, product filters, metadata) and extend the pattern to other business features (cart, navigation helpers) where duplication exists.
- [ ] Document expected props and metadata wiring for these feature systems so future sites can adopt them without reverse-engineering.

### 8. Verification & Tooling

- [ ] After each batch of extractions, run `pnpm --filter web-dgf format && pnpm --filter web-dgf lint:fix && pnpm --filter web-dgf typecheck` (repeat for `web-lfd`).
- [ ] Manually regression-test key flows (home hero, catalog filters, recipe detail, contact forms) on both brands.
- [ ] Re-test Presentation + Live preview to ensure no regression in optimistic updates or click-to-edit metadata.

## Next Steps for Delegation

- [ ] Align with design/content on shared token usage so extracted components can rely on CSS custom properties instead of conditional classes.
- [ ] Prioritize workstreams (e.g., finish foundations + listing system before tackling blocks) and open one ticket per numbered section for parallel delivery.
- [ ] Schedule Presentation QA checkpoints after each workstream to catch metadata issues early.
