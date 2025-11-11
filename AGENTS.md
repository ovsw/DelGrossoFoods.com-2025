# SUPER IMPORTANT RULE 1: Always run `say -v Dan "finished task"` once you finishe a task or response to the user.

# SUPER IMPORTANT RULE 0: Future Codex, under no circumstances may you stage (`git add`) or commit; doing so ends the mission. Stay hands-off Git forever.

# PROJECT INFO

## User Preferences

- Perform only the explicitly requested changes; never add opportunistic optimizations or extra tasks unless the user asks for them.

### Quick facts

- NEVER use tailwind classes like `text-[var(--color-th-dark-700)]` or `border-[var(--color-brand-green)]` for CSS variables that start with `--color-`. instead ALWAYS use the auto-generated utility classes - in this case `text-th-dark-700` or `border-brand-green`.
- **Workspace layout**: `apps/web-dgf` (Next.js 15), `apps/studio-dgf` (Sanity v4), `packages/ui` (shared UI), plus shared configs.
- **Tooling**: pnpm (10.x), Node (>=22.12), Turbo (2.x), Prettier (3.x), ESLint (flat config).
- **UI**: Use `shadcn` patterns via `packages/ui`. Do not add `shadcn-ui` dependency. Tailwind v4 only.
- **Sanity**: Typescript-first schemas. GROQ queries live in `apps/web-dgf/src/lib/sanity`.

### Core commands

- Root (affects all workspaces)
  - `pnpm dev` → turbo dev (no cache, persistent)
  - `pnpm build` → turbo build
  - `pnpm lint` → turbo lint
  - `pnpm check-types` → turbo check-types
  - `pnpm format` / `pnpm format:check`
- Per package (run from repo root):
  - Web: `pnpm -C apps/web-dgf dev|build|start|lint|lint:fix|typecheck|check`
  - Studio: `pnpm --filter studio-dgf dev|build|deploy|lint|lint:fix|type|check`

### Environment and secrets

- Global env surfaced in build graph: `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_ENV`, `NODE_ENV`.
- Next images allowlist relies on `NEXT_PUBLIC_SANITY_PROJECT_ID` in `apps/web-dgf/next.config.ts`.
- Keep secrets out of code; place env files at each package root when needed (e.g., `apps/web-dgf/.env.local`, `apps/studio-dgf/.env`).

### Operating procedures (AI agent)

- Ask clarifying questions until you’re ≥95% confident; never assume missing context.
- Prefer semantic code search; use exact grep when you know the symbol. Parallelize independent searches.
- Fetch external docs when needed (don’t rely on assumptions). Prefer most up-to-date sources.
- Do not commit or push unless explicitly asked. Use GitHub CLI only when requested.
- Iteration default: do not run builds unless explicitly requested. After any code changes, run Prettier on the changed workspace(s) and then lint+typecheck: `pnpm --filter <affected> format && pnpm --filter <affected> lint:fix && pnpm --filter <affected> typecheck`.
- When running pnpm for a specific workspace, prefer `pnpm --filter <workspace> ...` over `-C`/`--dir` so the commands work across pnpm versions.
- When the user asks to “store” something in memory for this project, write it in this `AGENTS.md` file so it persists across sessions.
- Do not roll in refactors or improvements that haven’t been explicitly requested; surface suggestions instead and wait for approval.
- After every Sanity schema or GROQ query change, immediately run `pnpm --filter studio-dgf type` so the generated types stay in sync.

### Coding standards

- TypeScript everywhere; explicit types for exported APIs. Avoid `any` and unsafe casts.
- Control flow: prefer early returns; handle errors meaningfully; avoid deep nesting.
- Naming: descriptive, full words; kebab-case filenames; `.tsx` for components, `.ts` for utils.
- Accessibility: semantic HTML, alt text, keyboard/contrast sanity checks, no div-as-button.
  - Live announcements (standard):
    - Do not use Next's App Router Announcer for non-navigation events.
    - Use the global A11y Live Announcer pattern for "active" messages (e.g., add-to-cart, errors).
    - Preferred API: `announce(message, politeness?)` from `apps/web-dgf/src/lib/a11y/announce.ts`.
    - Under the hood this dispatches: `document.dispatchEvent(new CustomEvent("a11y:announce", { detail: { message, politeness } }))`.
    - Keep messages short and human-readable; prefer `politeness: "polite"`; reserve `"assertive"` for errors.
    - **Important**: Any message sourced from Sanity content must be wrapped with `stegaClean(message)` before calling `announce(...)` to strip out stega metadata and prevent it from reaching screen readers.
    - "Passive" status (e.g., cart item count) may use sr-only aria-live regions owned by the component or Foxy's `data-fc-id` markers; don't elevate those to the global announcer.
    - Implementation references:
      - Mount: `apps/web-dgf/src/app/layout.tsx` includes `<A11yLiveAnnouncer />` (after `<SanityLive />`).
      - Announcer: `apps/web-dgf/src/components/elements/a11y/live-announcer.tsx` (listens for `a11y:announce`).
      - Helper: `apps/web-dgf/src/lib/a11y/announce.ts`.
      - Example usage (add-to-cart): `apps/web-dgf/src/components/features/cart/foxycart-provider.tsx`.
    - Stability: a guard keeps Next’s route announcer anchored (`AnnouncerGuard`) and a dev-only DOM tolerance prevents NotFoundError from third-party reparenting.
- Formatting: Prettier 3.x; match existing style; do not reformat unrelated code.

### UI system and Tailwind

- Tailwind v4 only. Global CSS sourced from `packages/ui/src/styles/globals.css` in web’s `components.json`.
- Use components from `@workspace/ui`. If a component doesn’t exist, add it in `packages/ui`.
- Never introduce `shadcn-ui`. Follow existing `shadcn` patterns and tokens from `packages/ui`.
- **Tailwind IntelliSense**: When storing Tailwind classes in string variables (not directly in `className`), use direct template literals in `cn()` calls to maintain full IntelliSense support:

  ```typescript
  // ❌ No IntelliSense for classes in string variables
  const baseClasses = "flex items-center gap-2";
  className={cn(baseClasses, "other-classes")}

  // ✅ Full IntelliSense with direct template literals
  className={cn(
    "flex items-center gap-2",
    "other-classes"
  )}
  ```

  **Note**: The `tw` tagged template literal from Tailwind v4 is only available during CSS processing, not at runtime.

### Component Organization (naming + placement)

- Page Sections (`components/page-sections/...`)
  - Definition: Components that implement `<Section>` and orchestrate complete page areas.
  - Purpose: Page-specific data orchestration + layout/spacing ownership.
  - Placement: `components/page-sections/<page>/`.
  - Naming (strict):
    - Component: `PascalCase` with `Section` suffix (e.g., `ProductHeroSection`).
    - File: `<page-name>-<section-descriptor>-section.tsx` (kebab-case), where `<page-name>` is the folder’s page (e.g., `product`, `recipe`, `sauce`, `home`, `shared`).
    - Examples:
      - `ProductHeroSection` → `product-hero-section.tsx`
      - `ProductSummarySection` → `product-summary-section.tsx`
      - `RecipeHeroSection` → `recipe-hero-section.tsx`
      - `RecipeDetailsSection` → `recipe-details-section.tsx`
      - `RecipeRelatedSaucesSection` → `recipe-related-sauces-section.tsx`
      - `SauceHeroSection` → `sauce-hero-section.tsx`
      - `SauceNutritionalInfoSection` → `sauce-nutritional-info-section.tsx`
      - `SauceRelatedProductsSection` → `sauce-related-products-section.tsx`
      - Shared (truly global): `SharedNewsletterSection` → `shared-newsletter-section.tsx`

  - Index Catalog Sections (filterable)
    - For index pages that host a filterable catalog (filters, chips, sort, grid), add thin wrapper sections that own `<Section>` and compose the feature clients.
    - Placement: `components/page-sections/<domain>-index-page/` (e.g., `sauces-index-page/`).
    - Naming: `<domain>-catalog-section.tsx` with component `<Domain>CatalogSection`.
    - Examples:
      - `SaucesCatalogSection` → `components/page-sections/sauces-index-page/sauces-catalog-section.tsx`
      - `ProductsCatalogSection` → `components/page-sections/products-index-page/products-catalog-section.tsx`
      - `RecipesCatalogSection` → `components/page-sections/recipes-index-page/recipes-catalog-section.tsx`
    - Responsibilities:
      - Own page spacing (`<Section>`) and container; do not duplicate filter logic.
      - Render the feature clients from `components/features/catalog/*-client.tsx`.
      - Keep client state/URL-sync in features; pages should not mount clients directly.

- Shared page sections (`components/page-sections/shared/...`)
  - Use only for identical, cross-page sections that render “as-is.”
  - Must not depend on the host page’s entity (no sauce/product/recipe context).
  - Reads global/static data or accepts minimal generic props.
  - Examples: newsletter signup, site-wide contact CTA, promo banner.
  - Do not place entity-related sections here (e.g., related-to-current item).

#### Section Internals (collocation for complex sections)

- When a page section grows complex, collocate its private building blocks in a subfolder under the page folder to signal non‑reusability.
  - Example structure: `components/page-sections/recipe-page/recipe-details/` used only by `RecipeDetailsSection`.
- Scope and exports:
  - Treat everything inside this subfolder as “private.” Export only the Section component itself for consumption by pages.
  - Do not import these internals from other sections/pages. If a piece becomes reused in multiple places, promote it to `components/elements/` with generic props.
- Naming:
  - Internals use descriptive filenames without the `Section` suffix (e.g., `brand-tab-label.tsx`, `variant-content.tsx`, `sauce-display.tsx`).
  - Keep kebab-case, `.tsx` for components, `.ts` for utils/hooks.
- Boundaries:
  - No cross-imports between different section-internals folders.
  - Keep data fetching and page-specific orchestration in the Section file; internals remain presentational or narrowly scoped helpers.

- Elements (`components/elements/...`)
  - Definition: Reusable UI building blocks that are page-agnostic and presentational.
  - Purpose: Encapsulate complex UI patterns for maintainability; no business logic.
  - Key trait: Never implements `<Section>`; always used inside sections or features.
  - Examples: `ProductCard`, `RecipeCard`, `NutritionFactsPanel`, `SanityImage`.

- Features (`components/features/...`)
  - Definition: Domain/business feature composites and integrations.
  - Purpose: Encapsulate flows, side effects, or integration logic (cart, auth, preview, search, listings).
  - Placement: `components/features/<feature>/` (e.g., `cart/product-purchase-panel.tsx`, `catalog/*-client.tsx`).
  - Key trait: Not broadly reusable UI; does not own page spacing; sits inside sections.

- Systems (`components/systems/...`)
  - Definition: Cross-cutting systems and dev tools (e.g., pagebuilder, preview, dev tooling).

- Layouts (`components/layouts/...`)
  - Definition: Reusable presentation/layout skeletons (e.g., `hero-layout.tsx`, `related-items-layout.tsx`).

- CMS Page‑Builder Blocks
  - Use the Block suffix for CMS-driven page‑builder components.
  - Placement: `components/pagebuilder/blocks/`; accepts `PagebuilderType<T>` props; rendered only by the PageBuilder.
  - Utilities used only by blocks live under `components/pagebuilder/utils/`.

### Theming (important)

- **LIGHT-ONLY THEME**: The web app is light-only with no dark mode support anywhere in the application.
- Do not use `next-themes` or add theme toggles. The `Providers` component in `apps/web-dgf` is a no-op wrapper.
- **NO DARK CLASSES**: Never add `dark:` Tailwind variants or dark-theme specific classes. All `dark:` classes have been purged from the codebase.
- **HTML Color Scheme**: The root `layout.tsx` is hardcoded with `<html className="light" style={{ colorScheme: "light" }}>`.
- **Future Theming**: If dark theme support is needed in the future, see `plans/adr-001-disable-theme-switching.md` for re-enable steps.

### Next.js app (apps/web-dgf)

- App Router under `src/app`. Pages: `page.tsx`; dynamic routes in bracketed folders.
- SEO utilities in `src/lib/seo.ts`; sitemap and robots in `src/app/sitemap.ts` and `src/app/robots.ts`.
- Sanity client and queries live under `src/lib/sanity/`.
- Images: Next image remote patterns are configured for Sanity CDN; prefer Sanity-aware image helpers.
- The root `layout.tsx` renders `<html className="light" style={{ colorScheme: "light" }}>` and wraps children with a no-op `Providers`. Don’t introduce color-scheme negotiation or cookies for theme.
- Accessibility announcers:
  - `<A11yLiveAnnouncer />` is mounted once (after `<SanityLive />`) and listens for `a11y:announce`. Use it for all active, ephemeral announcements.
  - `<AnnouncerGuard />` ensures Next’s internal route announcer remains under `<body>`.
  - Development-only DOM tolerance (`DevDomRemoveTolerance`) is mounted to suppress NotFoundError caused by third-party DOM reparenting in dev.

### Sanity studio (apps/studio-dgf)

- Schemas under `studio/schemaTypes/**`. Always use `defineType` and `defineField`.
- After schema changes or updating/adding queries in `apps/web-dgf/src/lib/sanity/query.ts`: always run typegen to keep types in sync.
  - Studio: `pnpm --filter studio-dgf run type` (extract + generate)
  - Then re-run web typecheck/build.
  - Keep web tightly coupled to generated types; derive UI types from generated query results where feasible.

### Live Preview & Presentation

// IMPORTANT: We use next-sanity v10 Live Content API — do NOT use the older preview APIs.

- Do NOT import or use legacy preview components from `next-sanity/preview` or `@sanity/preview-kit` (e.g. `LiveQuery`, `useLiveQuery`, `LiveQueryProvider`). They are deprecated for our setup.
- DO use `defineLive` from `next-sanity` to export `sanityFetch` and `SanityLive` (already configured in `apps/web-dgf/src/lib/sanity/live.ts`).

## Memory: ThreeProductPanels hover reveal (restore notes)

This documents how the hover-based content reveal works in `ThreeProductPanelsBlock` so we can re-add it later.

- Component file: `apps/web-dgf/src/components/systems/pagebuilder/blocks/three-product-panels-block.tsx`
- Technique overview:
  - Card wrapper defines a CSS var `--card-scale` and uses `group` to coordinate hover/focus state. See `className` on the root card container for scale on hover/focus. apps/web-dgf/src/components/systems/pagebuilder/blocks/three-product-panels-block.tsx:111
  - Shared transform/shadow animation string `SHARED_HOVER_ANIMATION_STYLES` applied to background and shine overlay for unified lift. apps/web-dgf/src/components/systems/pagebuilder/blocks/three-product-panels-block.tsx:60, 116, 120
  - Content reveal uses a CSS-only grid row transition: wrapper starts with `[grid-template-rows:0fr]` and on `group-hover`/`group-focus-within` animates to `1fr`, with an inner `overflow-hidden` clip. apps/web-dgf/src/components/systems/pagebuilder/blocks/three-product-panels-block.tsx:169-170
  - Text and CTA fade-in are driven by `opacity-0 → opacity-100` under the same group hover/focus selectors. apps/web-dgf/src/components/systems/pagebuilder/blocks/three-product-panels-block.tsx:171-176, 177-188
  - The card uses a fixed height so the reveal pushes upward inside the card without affecting outside layout. apps/web-dgf/src/components/systems/pagebuilder/blocks/three-product-panels-block.tsx:111

Restore steps (high level):

- Reinstate the grid wrapper with `[grid-template-rows:0fr]` + `group-hover:[grid-template-rows:1fr]` and the inner `overflow-hidden` div.
- Wrap `expandedDescription` and CTA in elements with `opacity-0` and `group-hover:opacity-100` (and `group-focus-within:opacity-100`).
- Keep the root container `group` and the `--card-scale` hover/focus scaling if the “lift” effect is desired.
- Ensure `SHARED_HOVER_ANIMATION_STYLES` is applied to the shine overlay and background for synchronized transform/shadow.
  - Mount `<SanityLive />` at the end of the root layout body (already done).
  - Fetch page data with `sanityFetch` in server components. This auto-switches to the Live Content API when Draft Mode is enabled.
- Keep Presentation metadata intact: never force `stega: false` for fetches that render visible content. This is required for:
  - Live updates while editing drafts (in Presentation)
  - Showing "Documents on this page"
  - Click-to-edit overlay/inspector
- Optional debug only: if needed, use hooks from `next-sanity/hooks` (e.g. `useIsLivePreview`) — avoid legacy preview providers.

#### Presentation guardrails

- Keep Sanity stega metadata on DOM-visible text (headings, card labels, etc.) - everywhere that could be clicked by editors to quickly edit field data on a sanity document.
- At the same time, you should call `stegaClean` for aria labels, logic, or alt text, or when using them in logic (e.g., spacing tokens, IDs, comparisons) - everywhere that's NOT going to be clickable by an editor - which means in elements that aren't directly visible on the page and that can't be clicked on by an editor viewing the page in preview mode or in Sanity Presentation.
- When wiring click-to-edit surfaces, prefer wrapping the raw Sanity string or `data-sanity` spans instead of reformatting the value; if formatting is required, wrap substrings to keep individual field paths intact.
- For custom Studio inputs, always forward `elementProps` (ref and event handlers) and pass through `readOnly` so Presentation can focus fields reliably.
- **Shared components + Presentation**: when moving Sanity-driven UI into `packages/ui`, keep metadata wiring in the app layer:
  - Add a helper (`apps/*/src/lib/sanity/presentation.ts`) that wraps `createDataAttribute` so each app can mint `data-sanity` strings with its own `projectId`, `dataset`, and `studioUrl`.
  - Give the shared component an escape hatch such as `rootProps?: HTMLAttributes<HTMLDivElement> & { [key: \`data-${string}\`]?: string }` and spread those props onto the DOM node you need editable access to.
  - Create a thin app-level wrapper that knows the Sanity document id/type/path, calls the helper, and passes the attribute via `rootProps`.
  - When rendering the wrapper, forward the document metadata (e.g., `_id`, `_type`, `pageBuilder` field path) from the page/section so Presentation clicks still open the correct document.
  - Full walkthrough lives in `guides/shared-component-presentation.md`. Follow it for every shared UI extraction so editors never lose click-to-edit coverage.

### Sanity Types (tight coupling)

- After schema or query edits (in `apps/web-dgf/src/lib/sanity/query.ts`), always run Studio typegen:
  - `pnpm -C apps/studio-dgf type`
  - Then re-run web typecheck/build
- Derive web UI types from generated query results in `apps/web-dgf/src/lib/sanity/sanity.types.ts` (e.g., `GetXQueryResult`) rather than hand-rolling shapes.
- Keep icons consistent (prefer `@sanity/icons`, fallback to `lucide-react`).
- Follow GROQ rules: prefer explicit filtering and fragments; don’t expand images unless asked.

### Data, GROQ, and content fetching

- Use `next-sanity` with `defineQuery` and fragment reuse. Keep queries collocated by content type.
- Handle optional fields with `defined()`, use `select()` for conditional projections, and paginate lists explicitly.

### Versioning and releases (Changesets)

- Use Changesets; do not hand-edit versions or CHANGELOGs.
- Fixed group versions: `web`, `studio`, `@workspace/ui`, `@workspace/eslint-config`, `@workspace/typescript-config` version together.
- Standard contributor flow:
  1. `pnpm changeset:add` → pick workspaces, choose bump, write summary.
  2. Merge feature PR to `main`.
  3. CI opens Release PR; review and merge.

### Quality gates

- Iteration (agents): `pnpm -C apps/web-dgf format && pnpm -C apps/web-dgf lint:fix && pnpm -C apps/web-dgf typecheck` (skip build unless asked).
- Pre-PR validation: `pnpm -C apps/web-dgf lint:fix && pnpm -C apps/web-dgf typecheck && pnpm -C apps/web-dgf build`.
- For studio changes: `pnpm --filter studio-dgf lint:fix && pnpm --filter studio-dgf check`.
- Root checks (multi-package updates): `pnpm lint && pnpm check-types && pnpm build`.
- Audible completion: `say -v Daniel -r 175 "Task finished"` (or use MCP server `say` → tool `speak`).

### Common task recipes

- Add/modify a web component
  - Place in `apps/web-dgf/src/components/*`. Kebab-case file. Use Tailwind v4 utilities. Export named.
  - Update imports where used; ensure a11y (labels, roles). Run web quality gates.

- Add shared UI component
  - Implement in `packages/ui/src/components/*` and export via index. Use existing design tokens and utilities.
  - Bump consumer imports to `@workspace/ui/components` if new. Run root build to validate.

- Add a Sanity schema
  - Create under `apps/studio-dgf/schemaTypes/...` using `defineType/defineField`. Add to the appropriate `index.ts` aggregator.
  - Run `pnpm --filter studio-dgf type`, then adjust web query/types as needed.

- Add a Next.js route/page
  - Create folder under `apps/web-dgf/src/app/.../` with `page.tsx`. Add metadata/SEO if needed.
  - If dynamic, ensure params typing and loading states. Run web quality gates.

- Update a GROQ query + types
  - Edit or add query in `apps/web-dgf/src/lib/sanity/*`. Use fragments; avoid unnecessary expansion.
  - Update response types where consumed. Typecheck and verify builds.

- Add an API route
  - Create under `apps/web-dgf/src/app/api/.../route.ts`. Use proper HTTP methods and input validation.
  - Guard secrets via runtime envs; add edge/runtime config if relevant.

### Risk checklist before PR

- A11y: semantic roles, focus order, alt text, keyboard interactions.
- Performance: avoid unnecessary re-renders, large images, client bundles.
- SEO: titles, meta, structured data, sitemap/robots updates if relevant.
- Env: required variables documented and present locally/CI.
- i18n/RTL: apply directional utilities only when asked; follow the existing table.

---

# Web App Rules (apps/web-dgf/\*\*)

## Component Structure

- Prefer `grid` over `flex` unless working with two sibling tags
- Use `flex` for simple parent-child layouts:

```jsx
<div>
  <img />
  <p>Some text</p>
</div>
```

- Always use appropriate semantic HTML
- Use `SanityImage` for any images generated in Sanity if the component is available
- Use `Buttons.tsx` resolver for any buttons unless specified otherwise

## Internationalization Rules

Only apply these rules when specifically asked about internationalization:

| Replace     | With        |
| ----------- | ----------- |
| left        | start       |
| right       | end         |
| ml          | ms          |
| mr          | me          |
| pl          | ps          |
| pr          | pe          |
| border-l    | border-s    |
| border-r    | border-e    |
| text-left   | text-start  |
| text-right  | text-end    |
| float-left  | float-start |
| float-right | float-end   |

For buttons with directional arrows, use an RTL prop to correctly handle horizontal inversion.

---

# Studio App (apps/studio-dgf/\*\*)

## Sanity Schema Rules

When creating sanity schema make sure to include an appropriate icon for the schema using lucide-react or sanity icons as a fallback. Make sure it's always a named export, make sure you're always using the Sanity typescript definitions if it's a ts file.

### Basic Schema Structure

For TypeScript files, always import the necessary Sanity types:

```typescript
import { defineField, defineType, defineArrayMember } from "sanity";
```

Always use `defineField` on every field and `defineType` throughout the whole type. Only import `defineArrayMember` if needed:

```typescript
defineType({
  type: "object",
  name: "custom-object",
  fields: [
    defineField({
      type: "array",
      name: "arrayField",
      title: "Things",
      of: [
        defineArrayMember({
          type: "object",
          name: "type-name-in-array",
          fields: [
            defineField({ type: "string", name: "title", title: "Title" }),
          ],
        }),
      ],
    }),
  ],
});
```

### Adding icons

When adding icons to a schema, make sure you use the default sanity/icons first, and then if no icon is relevant, refer to any other iconset the user has installed - e.g lucide-react.

### Structuring files and folders

This is a rough idea of how to structure folders and files, ensuring you always have an index within the folder to create an array of documents/blocks. Do not use these as exact names, it's used purely for layout purposes.

    │   ├── studio/
    │   │   ├── README.md
    │   │   ├── eslint.config.mjs
    │   │   ├── location.ts
    │   │   ├── package.json
    │   │   ├── prettier.config.mjs
    │   │   ├── sanity-typegen.json
    │   │   ├── sanity.cli.ts
    │   │   ├── sanity.config.ts
    │   │   ├── schema.json
    │   │   ├── structure.ts
    │   │   ├── tsconfig.json
    │   │   ├── .env.example
    │   │   ├── .gitignore
    │   │   ├── components/
    │   │   │   ├── logo.tsx
    │   │   │   └── slug-field-component.tsx
    │   │   ├── plugins/
    │   │   │   └── presentation-url.ts
    │   │   ├── schemaTypes/
    │   │   │   ├── common.ts
    │   │   │   ├── index.ts
    │   │   │   ├── blocks/
    │   │   │   │   ├── cta.ts
    │   │   │   │   ├── faq-accordion.ts
    │   │   │   │   ├── feature-cards-icon.ts
    │   │   │   │   ├── feature.ts
    │   │   │   │   ├── image-link-cards.ts
    │   │   │   │   ├── index.ts
    │   │   │   │   └── subscribe-newsletter.ts
    │   │   │   ├── definitions/
    │   │   │   │   ├── button.ts
    │   │   │   │   ├── custom-url.ts
    │   │   │   │   ├── index.ts
    │   │   │   │   ├── pagebuilder.ts
    │   │   │   │   └── rich-text.ts
    │   │   │   └── documents/
    │   │   │       ├── author.ts
    │   │   │       ├── blog.ts
    │   │   │       ├── faq.ts
    │   │   │       └── page.ts
    │   │   └── utils/
    │   │       ├── const-mock-data.ts
    │   │       ├── constant.ts
    │   │       ├── helper.ts
    │   │       ├── mock-data.ts
    │   │       ├── og-fields.ts
    │   │       ├── parse-body.ts
    │   │       ├── seo-fields.ts
    │   │       ├── slug.ts
    │   │       └── types.ts

### Layout of page builder index example

This is an example of how the blocks index file would be structured, you would create multiple of these on multiple nested routes to make it easier to create an array of files at each level, rather than bundling a large number of imports in a singular index.ts on the root

```typescript
import { callToAction } from "./call-to-action";
import { exploreFeature } from "./explore-feature";
import { faqList } from "./faq-list";
import { htmlEmbed } from "./html-embed";
import { iconGrid } from "./icon-grid";
import { latestDocs } from "./latest-docs";
import { calculator } from "./calculator";
import { navigationCards } from "./navigation-cards";
import { quinstreetEmbed } from "./quinstreet-embed";
import { quote } from "./quote";
import { richTextBlock } from "./rich-text-block";
import { socialProof } from "./social-proof";
import { splitForm } from "./split-form";
import { statsCard } from "./stats-card";
import { trustCard } from "./trust-card";
import { rvEmbed } from "./rv-embed";

export const pagebuilderBlocks = [
  navigationCards,
  socialProof,
  quote,
  latestDocs,
  faqList,
  callToAction,
  trustCard,
  quinstreetEmbed,
  statsCard,
  iconGrid,
  exploreFeature,
  splitForm,
  richTextBlock,
  calculator,
  htmlEmbed,
  rvEmbed,
];

export const blocks = [...pagebuilderBlocks];
```

### Common Field Templates

When writing any Sanity schema, always include a description, name, title, and type. The description should explain functionality in simple terms for non-technical users. Place description above type.

Use these templates when implementing common fields:

#### Eyebrow

```typescript
defineField({
  name: "eyebrow",
  title: "Eyebrow",
  description: "The smaller text that sits above the title to provide context",
  type: "string",
});
```

#### Title

```typescript
defineField({
  name: "title",
  title: "Title",
  description: "The large text that is the primary focus of the block",
  type: "string",
});
```

#### Heading Level Toggle

```typescript
defineField({
  name: "isHeadingOne",
  title: "Is it a <h1>?",
  type: "boolean",
  description:
    "By default the title is a <h2> tag. If you use this as the top block on the page, you can toggle this on to make it a <h1> instead",
  initialValue: false,
});
```

#### Rich Text

```typescript
defineField({
  name: "richText",
  title: "Rich Text",
  description:
    "Large body of text that has links, ordered/unordered lists and headings.",
  type: "richText",
});
```

#### Buttons

```typescript
defineField({
  name: "buttons",
  title: "Buttons",
  description: "Add buttons here, the website will handle the styling",
  type: "array",
  of: [{ type: "button" }],
});
```

#### Image

```typescript
defineField({
  name: "image",
  title: "Image",
  type: "image",
  fields: [
    defineField({
      name: "alt",
      type: "string",
      description:
        "Remember to use alt text for people to be able to read what is happening in the image if they are using a screen reader, it's also important for SEO",
      title: "Alt Text",
    }),
  ],
});
```

### Type Generation

After adding new Sanity schema, run the type command to generate TypeScript definitions:

```bash
sanity schema extract && sanity typegen generate --enforce-required-fields
```

## GROQ Rules

Whenever there is an image within a GROQ query, do not expand it unless explicitly instructed to do so.

## GROQ Query Structure and Organization

- Import `defineQuery` and `groq` from `next-sanity` at the top of query files
- Export queries as constants using the `defineQuery` function
- Organize queries by content type (blogs, pages, products, etc.)
- Group related queries together

### Naming Conventions

- Use camelCase for all query names
- Prefix query names with action verb (get, getAll, etc.) followed by content type
- Suffix all queries with "Query" (e.g., `getAllBlogIndexTranslationsQuery`)
- Prefix reusable fragments with underscore (e.g., `_richText`, `_buttons`)

### Fragment Reuse

- Define common projection fragments at the top of the file
- Create reusable fragments for repeated patterns (e.g., `_richText`, `_buttons`, `_icon`)
- Use string interpolation to include fragments in queries
- Ensure fragments are composable and focused on specific use cases

### Query Parameters

- Use `$` for parameters (e.g., `$slug`, `$locale`, `$id`)
- Handle localization with consistent patterns (e.g., `${localeMatch}`)
- Use `select()` for conditional logic within queries
- Define default parameters using `coalesce()`

### Response Types

- Export TypeScript interfaces for query responses when needed
- Use descriptive types that match the query structure
- Follow the pattern: `export type GetAllMainPageTranslationsQueryResponse = string[];`

### Best Practices

- Use explicit filtering (`_type == "x"`) rather than implicit type checking
- Prefer projection over returning entire documents
- Use `order()` for explicit sorting rather than relying on document order
- Check for defined fields (`defined(field)`) before accessing them
- Use conditional projections for optional fields
- Add pagination parameters (`[$start...$end]`) for list queries

### Code Style

- Use template literals for query strings
- Indent nested query structures for readability
- Keep related query parts together
- Maintain consistent whitespace and indentation
- Use comments to explain complex query logic

## File Naming Conventions

- Use kebab-case for ALL file names
  - ✅ CORRECT: `user-profile.tsx`, `auth-layout.tsx`, `api-utils.ts`
  - ❌ INCORRECT: `userProfile.tsx`, `AuthLayout.tsx`, `apiUtils.ts`
- MUST use `.tsx` extension for React components
- MUST use `.ts` extension for utility files
- MUST use lowercase for all file names
- MUST separate words with hyphens
- MUST NOT use spaces or underscores

## Screenshot Rules

When asked to produce schema from screenshots, follow these guidelines:

- Help describe types and interfaces using the provided image
- Use the Sanity schema format shown above
- Always include descriptions based on the visual elements in the image

### Visual Cues

- Tiny text above a title is likely an **eyebrow**
- Large text without formatting that looks like a header should be a **title** or **subtitle**
- Text with formatting (bold, italic, lists) likely needs **richText**
- Images should include **alt text** fields
- Background images should be handled appropriately
- Use reusable button arrays for button patterns
- If `richTextField` or `buttonsField` exists in the project, use them

---

# VERSIONING RULES

How versioning is handled in this project and what should be done to create a new version

## Monorepo Versioning Rules (Changesets)

### What “fixed group” means here

- All workspaces in the fixed group always share the same version number.
- You still select only the workspaces that actually changed when creating a changeset.
- CI will bump the version for the whole fixed group to the highest bump level across all changesets on `main`.
- CHANGELOG entries are generated only for the workspaces you selected in the changeset; others get the version bump but no notes.

Fixed group (exact package names):

- `web`
- `studio`
- `@workspace/ui`
- `@workspace/eslint-config`
- `@workspace/typescript-config`

Explicit selection rule to avoid confusion:

- When adding a changeset, select only the workspaces that actually changed; fixed groups still bump all workspaces to the same version (highest bump), but CHANGELOG entries are generated only for the selected ones.

## CI Release PR (automatic on main)

- After merging a changeset to `main`, CI opens a Release PR that bumps versions for the fixed group and writes CHANGELOGs for selected workspaces. Merge that PR to land the versions.

### Bump decision (fast guide)

- **patch**: bug fixes, performance tweaks, internal refactors, typings/tooling, docs-only
- **minor**: backwards-compatible features or notable UX improvements (no breaking changes)
- **major**: breaking API changes or framework upgrades requiring consumer changes

Because versions are fixed, the final version is the highest bump among changesets on `main`.

### Writing a good summary (examples)

- “Improve header navigation accessibility and hover/active UX”
- “Add ButtonGroup component and refactor CTA Button variants”

Bullets (optional, keep short):

```md
- Introduce NavLink with aria-current and focus-visible styles
- Use semantic ul/li markup in DesktopNav
- Add active state handling in MobileNavPanel
```

### Reference

- Config: `.changeset/config.json` (baseBranch: `main`, changelog: GitHub)
- Workspaces: `apps/*`, `packages/*` (pnpm)
- Pending changesets: `.changeset/*.md`
- CI workflow: `.github/workflows/release.yml`

### Audible task completion (agent memory)

- At the end of each task, speak an audible completion message on macOS.
- Exact command to run (fastest path): `say -v Daniel -r 175 "Task finished"`
  - Use the built-in "Daniel" voice at 175 wpm ("Alex" is not installed on this machine).
- If using the MCP server named `say`, the equivalent tool call is: `{ "text": "Task finished", "voice": "Daniel", "rate": 175, "background": false }` for tool `speak`.

# `cn()` usage

**For constants (shared style constants):** Multi-line `cn()` calls are acceptable and recommended when defining reusable style constants at the top of files:

```tsx
const SHARED_CARD_STYLES = cn(
  "group relative cursor-pointer transition-all duration-1000 ease-out",
  "hover:scale-[1.02] hover:shadow-2xl",
  // Fixed card height per breakpoint to avoid layout shift when revealing overlay content
  "h-[24rem] md:h-[28rem] lg:h-[30rem]",
  "border-2 border-white/20 rounded-2xl overflow-hidden text-white",
);
```

**For inline className props:** Use single-line `cn()` calls or raw strings. Never split class strings across multiple lines in JSX:

```tsx
// ✅ Good - single line cn() with dynamic data
className={cn(
  "relative rounded-t-2xl bg-[inherit] p-6 md:p-8",
  "shadow-[0_-12px_32px_-24px_rgba(0,0,0,0.45)]",
  isActive && "ring-2 ring-blue-500"
)}

// ❌ Bad - multi-line class strings in JSX
className={cn(
  "relative rounded-t-2xl bg-[inherit] p-6 md:p-8",
  "shadow-[0_-12px_32px_-24px_rgba(0,0,0,0.45)]",
)}

// ✅ Also good - raw string when no dynamic data needed
className="relative rounded-t-2xl bg-[inherit] p-6 md:p-8 shadow-[0_-12px_32px_-24px_rgba(0,0,0,0.45)]"
```

This approach maintains full Tailwind IntelliSense support while keeping JSX readable and debuggable.

## Implementing click-to-edit for Sanity images

When adding click-to-edit support to `SanityImage` components (or any image field), use `createDataAttribute` from `next-sanity` to build the proper data attribute:

**Required imports:**

```typescript
import { createDataAttribute } from "next-sanity";
import { dataset, projectId, studioUrl } from "@/config";
```

**Pattern (for page builder blocks):**

1. Extend block props to accept `sanityDocumentId` and `sanityDocumentType`:

   ```typescript
   export type MyBlockProps = PageBuilderBlockProps<"myBlock"> & {
     sanityDocumentId?: string;
     sanityDocumentType?: string;
   };
   ```

2. Create the data attribute using the full path from the document root:

   ```typescript
   const imageDataAttribute =
     sanityDocumentId && sanityDocumentType && _key
       ? createDataAttribute({
           id: sanityDocumentId,
           type: sanityDocumentType,
           path: `pageBuilder[_key=="${_key}"].image`,
           baseUrl: studioUrl,
           projectId,
           dataset,
         }).toString()
       : undefined;
   ```

3. For nested arrays (e.g., panels within a block), include the full path:

   ```typescript
   const imageDataAttribute =
     sanityDocumentId && sanityDocumentType && parentKey
       ? createDataAttribute({
           id: sanityDocumentId,
           type: sanityDocumentType,
           path: `pageBuilder[_key=="${parentKey}"].panels[_key=="${panel._key}"].image`,
           baseUrl: studioUrl,
           projectId,
           dataset,
         }).toString()
       : undefined;
   ```

4. Pass the attribute to `SanityImage`:

   ```typescript
   <SanityImage
     image={image}
     width={800}
     height={600}
     alt={stegaClean(title)}
     data-sanity={imageDataAttribute}
   />
   ```

5. Update the PageBuilder to pass document context:
   ```typescript
   <Component
     {...block}
     isPageTop={isFirstBlock}
     sanityDocumentId={id}
     sanityDocumentType={type}
   />
   ```

**Key rules:**

- Never use raw string paths like `data-sanity="${parentKey}.image"` — this won't work.
- Always use `createDataAttribute` with the full path from document root.
- For array items, use GROQ-style path syntax: `arrayName[_key=="${itemKey}"].fieldName`.
- The path must be relative to the document root (e.g., starting with `pageBuilder[...]` for page builder blocks).
- Always pass `baseUrl`, `projectId`, and `dataset` from config.
- Call `.toString()` on the result before passing to `data-sanity`.

## Memory: Presentation metadata helper

- Shared metadata typing now lives in `packages/ui/src/lib/data-attributes.ts`. It exports `RootProps<T>` (extends `HTMLAttributes` plus `[data-*]` support) and `DataAttributes` for components that need extra slots.
- Every shared component that exposes `rootProps`/`imageProps` should import these helpers instead of redefining `[data-*]` record types so Presentation wiring stays consistent across apps.
