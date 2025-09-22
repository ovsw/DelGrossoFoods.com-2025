# web

## 1.9.0

### Minor Changes

- [#64](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/64) [`0f34bce`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/0f34bcee608c336aa0148b1c0b42780826a6cf3e) Thanks [@ovsw](https://github.com/ovsw)! - Introduce shared section spacing controls across Studio schemas, UI, and web sections.

### Patch Changes

- Updated dependencies [[`0f34bce`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/0f34bcee608c336aa0148b1c0b42780826a6cf3e)]:
  - @workspace/ui@1.9.0

## 1.8.0

### Minor Changes

- [#61](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/61) [`a201d5c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/a201d5ce0a3e157addb27c43faad3ee70a7d2e68) Thanks [@ovsw](https://github.com/ovsw)! - Add SSR + client-filterable Recipes index at `/recipes` with filters for Product Line, Recipe Tags, Meat, Category, and search; include `/recipes/[slug]` stub. Reuse shared FilterableListLayout and ListCard, and add recipe queries + types.

- [#61](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/61) [`b24cd5f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/b24cd5f03ba6278533a27327b80ef01bcd1bb74b) Thanks [@ovsw](https://github.com/ovsw)! - Add SSR + client-filterable Store index at `/store` and refactor shared UI for filterable lists.
  - Implement `/store` with SSR data fetch and client-side filtering for products
  - Add product queries (`getProductIndexPageQuery`, `getAllProductsForIndexQuery`)
  - Extract `FilterableListLayout` (shared layout for filters/results/sort) and `ListCard` (shared grid card)
  - Update Sauces index to reuse shared layout and card
  - Scaffold `/store/[slug]` placeholder page
  - UI: export `BadgeVariant` type inferred from `badgeVariants` CVA for safer consumers

  Notes:
  - Product filters include Search, Packaging (Case/Gift/Other), Product Line, and Sauce Type (including Mix)
  - Merchandise shows no badges; Mix only matches products with multiple sauce types

### Patch Changes

- Updated dependencies [[`b24cd5f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/b24cd5f03ba6278533a27327b80ef01bcd1bb74b)]:
  - @workspace/ui@1.8.0

## 1.7.0

### Patch Changes

- [#59](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/59) [`6a8fbfa`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/6a8fbfac5c54752792a9e8072bc1cdd037c1e8dd) Thanks [@ovsw](https://github.com/ovsw)! - Include `sauce` documents in the sitemap alongside pages, blogs, products, and recipes.

- [#59](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/59) [`d32e957`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/d32e957965eb1a42d17900cb96ba8c54f71ad2e6) Thanks [@ovsw](https://github.com/ovsw)! - Add slug fields to Product and Recipe schemas and add a slug backfill script for the development dataset.
  - Add `slug` field to `productType` and `recipeType` documents in Studio
  - Implement `apps/studio/scripts/backfill-slugs.ts` to populate slugs for all Product and Recipe documents in the dev dataset
  - Regenerate Sanity types consumed by Web (`sanity.types.ts`)

- [#59](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/59) [`6a8fbfa`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/6a8fbfac5c54752792a9e8072bc1cdd037c1e8dd) Thanks [@ovsw](https://github.com/ovsw)! - Improve OG data for products and recipes and extend sitemap coverage.
  - Add fallbacks in OG projections: use `name` when `ogTitle/seoTitle/title` are missing; prefer `pt::text(description)` for product/recipe, fallback to `name`.
  - Prefer `mainImage` (and its dominant color) before `image` to avoid null OG images.
  - Add `product` and `recipe` pages to the sitemap query and generation.

- Updated dependencies []:
  - @workspace/ui@1.7.0

## 1.6.0

### Minor Changes

- [#57](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/57) [`8c19b08`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/8c19b08bf4d5e7eebfc8c37c582122cb796b5a82) Thanks [@ovsw](https://github.com/ovsw)! - Add Sauces Index page with SSR + client filtering (search via Fuse.js, product line multi-select, sauce type single-select), A→Z/Z→A sorting, URL param syncing, responsive sidebar/sheet filters, and accessibility improvements. Also scaffold a basic sauce detail route at `/sauces/[slug]`.

- [#57](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/57) [`2d327dd`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/2d327ddf4d1dfe1e4ea4bed9cafb0ac788984076) Thanks [@ovsw](https://github.com/ovsw)! - Introduce Eyebrow component and refactor badge usage across sections
  - Add `Eyebrow` UI component (`@workspace/ui/components/eyebrow`) with CVA variants `onLight` (default) and `onDark`. No background fill; uses a 1px left border and 1rem left padding; small text. Skips rendering when text is empty. Supports optional `aria-label` for accessibility.
  - Refactor web sections to use `Eyebrow` instead of `Badge`:
    - `hero.tsx`, `cta.tsx`, `faq-accordion.tsx`, `image-link-cards.tsx`, `feature-cards-with-icon.tsx`.
  - Keep `Badge` only for sauce cards; move color logic into `Badge` CVA variants (`original`, `organic`, `premium`, `pizza`, `pasta`, `salsa`, `sandwich`).
  - Simplify `Badge` API (required `text`, optional `href`) so the component only handles styling while callers supply content/links.

### Patch Changes

- [#57](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/57) [`4b7f020`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/4b7f0202f2664035cc59b3a74edee6972ee92ddc) Thanks [@ovsw](https://github.com/ovsw)! - Use `Badge` variant prop in SauceCard and sauce taxonomy for consistency and accessibility
  - Switch SauceCard to variant-based `Badge` usage
  - Align `src/config/sauce-taxonomy.ts` with `Badge` variants
  - No intended UI or behavior changes

- Updated dependencies [[`4b7f020`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/4b7f0202f2664035cc59b3a74edee6972ee92ddc), [`2d327dd`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/2d327ddf4d1dfe1e4ea4bed9cafb0ac788984076)]:
  - @workspace/ui@1.6.0

## 1.5.0

### Minor Changes

- [#55](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/55) [`e9803fc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/e9803fcba2fb9b3ec25c172e74489f0830522dd4) Thanks [@ovsw](https://github.com/ovsw)! - Make slug input schema-aware and add sauce slugs under `/sauces/`.
  - Slug field component now respects each field’s `options.source` and `options.slugify`, enabling Generate/Clean Up for docs without a `title` (e.g., sauces use `name`).
  - Enforce `/sauces/` prefix for `sauce` documents; add cleaner/validator rules and slug prefix mapping.
  - Update sauce schema to include slug with auto-generation and validation.
  - Update web links to `/sauces/` and fix OG queries to use plain-text sauce descriptions.

### Patch Changes

- [#55](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/55) [`530abd4`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/530abd46de184addc6ee5a1307fbb9d5be471e32) Thanks [@ovsw](https://github.com/ovsw)! - Address PR comment fixes in Studio and Web.
  - Studio (page): use centralized slug validator with `sanityDocumentType: "page"`; remove manual `/blog` guard.
  - Web (OG): coerce OG `title`/`description` to strings to avoid type drift (sauce).

- Updated dependencies []:
  - @workspace/ui@1.5.0

## 1.4.2

### Patch Changes

- [#54](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/54) [`93087f5`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/93087f5776205fed69cd28a3e337577ebcec11c7) Thanks [@ovsw](https://github.com/ovsw)! - chore(theme): disable runtime theme switching and purge dark variants
  - Remove `next-themes` usage and theme toggle; stub `Providers` to no-op
  - Simplify `layout.tsx` to light-only; drop cookie/client-hint logic
  - Purge all `dark:` Tailwind variants across web and shared UI
  - Remove `next-themes` from `web` and `@workspace/ui` dependencies
  - Add ADR-001 with re-enable steps; update Cursor agent handbook to clarify light-only

- [#52](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/52) [`e089acb`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/e089acb4cc3f90aeb1d77ccd29b0c3bf2a362703) Thanks [@ovsw](https://github.com/ovsw)! - fix(a11y): footer links text color and hover colors, border colors.

- Updated dependencies [[`93087f5`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/93087f5776205fed69cd28a3e337577ebcec11c7)]:
  - @workspace/ui@1.4.2

## 1.4.1

### Patch Changes

- [#49](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/49) [`5741fcd`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/5741fcd19d028eee7b7af746cf7f07cba954d625) Thanks [@ovsw](https://github.com/ovsw)! - Make `LogoSvg` accept full SVG props and fix potential id collisions; rename file to `elements/logo.tsx` and update imports.
  - Extend `LogoSvg` props to `ComponentPropsWithoutRef<'svg'>` and spread onto `<svg>` to allow `aria-*`, `role`, `id`, and other SVG attributes
  - Remove hardcoded `id="a"` to avoid potential collisions in composed pages and OG rendering
  - Rename `apps/web/src/components/elements/Logo.tsx` → `apps/web/src/components/elements/Logo.tsx` and update all imports (`navbar`, `navbar-client`, `footer`, `api/logo`, `api/og`, `header`)

- [#49](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/49) [`6a10ecc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/6a10eccc583e7060b55b3b367223caece8872ea9) Thanks [@ovsw](https://github.com/ovsw)! - Make brand logo code-owned and remove CMS logo.
  - Replace header, nav, and footer logos with inline `LogoSvg` (currentColor theming)
  - Remove `logo` from Sanity `settings` schema and from related queries/types
  - Update OG image route and JSON-LD to no longer depend on CMS logo
  - Delete obsolete Sanity-driven `Logo` image component in web
  - Lint/typecheck clean across web and studio

- [#49](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/49) [`b90dfb1`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/b90dfb16f34092cbc9e390f0d57b6d4bca4e2393) Thanks [@ovsw](https://github.com/ovsw)! - Add OG logo rendering and PNG logo endpoint; update JSON-LD
  - Add `/api/logo` endpoint (Edge) to render inline `LogoSvg` to PNG via next/og
  - Render inline logo in OG route layout; fix Satori display style requirements
  - Update JSON-LD Organization/Article to use absolute `/api/logo` URL
  - Allow `/api/og/*` and `/api/logo/*` in robots

- [#51](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/51) [`af09524`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/af09524b424f45dfaa942c77811833959ac2594f) Thanks [@ovsw](https://github.com/ovsw)! - Fix SSR hydration mismatch by making theme selection deterministic.
  - Ensure the server-rendered `html` `class` and inline `color-scheme` match the initial theme used on the client to prevent hydration errors.
  - Consolidate initial theme logic in `RootLayout` and providers to avoid client-only theme flashes.

- Updated dependencies []:
  - @workspace/ui@1.4.1

## 1.4.0

### Minor Changes

- [#47](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/47) [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b) Thanks [@ovsw](https://github.com/ovsw)! - Introduce background color, noise texture, and top gradient via background.css
  - Import `background.css` in `apps/web/src/app/layout.tsx`
  - Add `public/images/bg/noise-red.svg` asset
  - Adjust `packages/ui` global styles to support background layering

- [#47](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/47) [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b) Thanks [@ovsw](https://github.com/ovsw)! - Switch default typography to Libre Baskerville (serif) and retain Geist as `font-sans` for selective use.
  - Add `--font-serif` (Libre Baskerville 400/700 incl. italics) and apply `font-serif` to `<body>`
  - Keep `--font-sans` (Geist) and `--font-mono` available; no API changes
  - Uses `next/font/google` (self-hosted at build) per Tailwind v4 tokens

### Patch Changes

- [#47](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/47) [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b) Thanks [@ovsw](https://github.com/ovsw)! - Switch ESLint tooling to exec (lockfile‑pinned) and refine a11y policy
  - Replace dlx with exec for ESLint/Prettier (root‑pinned toolchain) to eliminate local/CI drift
  - Remove zero‑warning gates; warnings allowed, accessibility rules error and fail hooks
  - Update Husky and lint‑staged to respect partial commits and show concise errors
  - Keep shared config with a11y rules as errors; downgrade non‑a11y to warnings across packages

- Updated dependencies [[`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b), [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b)]:
  - @workspace/ui@1.4.0

## 1.3.1

### Patch Changes

- [#44](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/44) [`6491694`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/64916948ba4cc5e162f781706f13c995986ebe57) Thanks [@ovsw](https://github.com/ovsw)! - Improve header navigation accessibility and hover/active UX.
  - Introduce `NavLink` with `aria-current` and strong focus-visible styles
  - Refactor `DesktopNav` to semantic `ul`/`li` markup using `NavLink`
  - Add active state + `aria-current` in `MobileNavPanel` for consistency
  - Keep UI styling consistent without adding new dependencies

- [#41](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/41) [`23a8d24`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/23a8d24544a571a793d219d47844798a6a393e19) Thanks [@ovsw](https://github.com/ovsw)! - Enable project-wide a11y lint via eslint-plugin-jsx-a11y and enforce a11y rules as errors.

- Updated dependencies []:
  - @workspace/ui@1.3.1

## 1.3.0

### Minor Changes

- [#40](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/40) [`145ac73`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/145ac7305070c90f960c135bd15e01990954d551) Thanks [@ovsw](https://github.com/ovsw)! - Replace navbar with new header, Improve mobile menu styling and animation, Add Recipes button (desktop + mobile), Fix cart button hover cursor,Smooth hide-on-scroll behavior

### Patch Changes

- [#37](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/37) [`987c036`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/987c03628123a7f58e012c75bdbc811c5e873e9b) Thanks [@ovsw](https://github.com/ovsw)! - fix mobile nav not showing up after SSR refactor. Fix theme hydration issues after removing hydration warning suppression.

- Updated dependencies [[`145ac73`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/145ac7305070c90f960c135bd15e01990954d551)]:
  - @workspace/ui@1.3.0

## 1.2.3

### Patch Changes

- [#34](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/34) [`91d6d51`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/91d6d51fccb5b73bf230c28950c0b306936a8bf8) Thanks [@ovsw](https://github.com/ovsw)! - chore(devx): introduce Husky + lint-staged to enforce format/lint/types at commit and push; add CI format check

- Updated dependencies [[`91d6d51`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/91d6d51fccb5b73bf230c28950c0b306936a8bf8)]:
  - @workspace/ui@1.2.3

## 1.2.2

### Patch Changes

- [#28](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/28) [`50e130d`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/50e130d41ded6d8ba859978e492935d2a91da7cd) Thanks [@ovsw](https://github.com/ovsw)! - refactor: implement color scheme client hint support without needing to suppress hydration warnings and persist theme preference in cookies

- Updated dependencies []:
  - @workspace/ui@1.2.2

## 1.2.1

### Patch Changes

- [#25](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/25) [`841e2c1`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/841e2c10ac33a573e462b1e6d5d12c5138cc8f0b) Thanks [@ovsw](https://github.com/ovsw)! - SSR the primary navigation and improve accessibility and UX.
  - Render both mobile and desktop variants on the server; remove client-only gating
  - Add `<nav aria-label="Primary">` with responsive-only visibility
  - Unmount mobile drawer content when closed to keep it inert
  - Add active link states and `aria-current` for links and column triggers
  - Add global skip-to-main link and wrap content in `main#main`

- Updated dependencies []:
  - @workspace/ui@1.2.1

## 1.2.0

### Minor Changes

- [#23](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/23) [`cece48c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/cece48cadaa5670776737bcdbb623098453dd76e) Thanks [@ovsw](https://github.com/ovsw)! - upgraded to sanity 4.6.0, added types for sauces, products, recipies and corresponding structures in the sanity back-end.

### Patch Changes

- Updated dependencies [[`cece48c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/cece48cadaa5670776737bcdbb623098453dd76e)]:
  - @workspace/ui@1.2.0

## 1.1.0

### Patch Changes

- [#21](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/21) [`d3794ca`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/d3794ca601bc0de6ad67fcbb9ea152e07279e184) Thanks [@ovsw](https://github.com/ovsw)! - Ported over the DelGrosso Foods color tokens and set up the To process CSS from the UI package via the TypeScript config to trigger hot module reloads for CSS imports into globals.css

- Updated dependencies [[`d3794ca`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/d3794ca601bc0de6ad67fcbb9ea152e07279e184)]:
  - @workspace/ui@1.1.0

## 1.0.2

### Patch Changes

- [#18](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/18) [`5aa40f6`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/5aa40f6961a96b402f4e1fbaad61227f51badf7e) Thanks [@ovsw](https://github.com/ovsw)! - Raise minimum Node to 22.12.0 to fix Sanity typegen (ESM/CJS interop).

- Updated dependencies [[`5aa40f6`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/5aa40f6961a96b402f4e1fbaad61227f51badf7e)]:
  - @workspace/ui@1.0.2

## 1.0.1

### Patch Changes

- [`129710f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/129710f84ebd83603923a1b225eaf1165aab477f) Thanks [@ovsw](https://github.com/ovsw)! - Initialize Changesets and unify versions across fixed workspaces.
  - Add Changesets tooling and config
  - Synchronize versions via fixed group
  - Generate initial CHANGELOGs via Release PR

- Updated dependencies [[`129710f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/129710f84ebd83603923a1b225eaf1165aab477f)]:
  - @workspace/ui@1.0.1
