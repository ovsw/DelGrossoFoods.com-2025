# @workspace/ui

## 1.16.1

### Patch Changes

- [#96](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/96) [`7d96140`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7d961400e4073f25617c434c0b2e7e1c38d92285) Thanks [@ovsw](https://github.com/ovsw)! - Refactor product panels and cards with improved styling and animations
  - Simplify ThreeProductPanelsBlock by removing framer motion and making it a RSC
  - Extract ProductPanelCard component with improved layout and animation
  - Introduce dynamic gradient overlay with CSS variable support
  - Consolidate className definitions for better readability
  - Update Sanity schema for three-product-panels block
  - Add SurfaceShineOverlay component with enhanced styling

## 1.16.0

## 1.15.0

## 1.14.0

## 1.13.0

## 1.12.1

## 1.12.0

### Minor Changes

- [#76](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/76) [`343f2cc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/343f2cc682b0840da123b8a133fc33a4e0d1f3ca) Thanks [@ovsw](https://github.com/ovsw)! - Added individual recipe page.
  Some fixes to the way filtering works via category as well.

## 1.11.2

## 1.11.1

## 1.11.0

## 1.10.0

### Patch Changes

- [#68](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/68) [`c8b14cb`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/c8b14cb36269521e6535d7b1356d00ba31d5e68a) Thanks [@ovsw](https://github.com/ovsw)! - Add Sauce page components and UI tweaks
  - Add Sauce Hero, Nutrition, Related Products, and Related Recipes components
  - Wire new components into Sauce pages and refine rich text rendering
  - Tweak shared UI (Button, Eyebrow) and global styles for consistency

## 1.9.1

## 1.9.0

### Minor Changes

- [#64](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/64) [`0f34bce`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/0f34bcee608c336aa0148b1c0b42780826a6cf3e) Thanks [@ovsw](https://github.com/ovsw)! - Introduce shared section spacing controls across Studio schemas, UI, and web sections.

## 1.8.0

### Patch Changes

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

## 1.7.0

## 1.6.0

### Minor Changes

- [#57](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/57) [`2d327dd`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/2d327ddf4d1dfe1e4ea4bed9cafb0ac788984076) Thanks [@ovsw](https://github.com/ovsw)! - Introduce Eyebrow component and refactor badge usage across sections
  - Add `Eyebrow` UI component (`@workspace/ui/components/eyebrow`) with CVA variants `onLight` (default) and `onDark`. No background fill; uses a 1px left border and 1rem left padding; small text. Skips rendering when text is empty. Supports optional `aria-label` for accessibility.
  - Refactor web sections to use `Eyebrow` instead of `Badge`:
    - `hero.tsx`, `cta.tsx`, `faq-accordion.tsx`, `image-link-cards.tsx`, `feature-cards-with-icon.tsx`.
  - Keep `Badge` only for sauce cards; move color logic into `Badge` CVA variants (`original`, `organic`, `premium`, `pizza`, `pasta`, `salsa`, `sandwich`).
  - Simplify `Badge` API (required `text`, optional `href`) so the component only handles styling while callers supply content/links.

### Patch Changes

- [#57](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/57) [`4b7f020`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/4b7f0202f2664035cc59b3a74edee6972ee92ddc) Thanks [@ovsw](https://github.com/ovsw)! - Harden Badge typing and remove `any` cast
  - Use a discriminated union for anchor vs. span props
  - Conditionally pass `href` only when rendering an `<a>`
  - Keep `text`, `className`, and `variant` API unchanged

## 1.5.0

## 1.4.2

### Patch Changes

- [#54](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/54) [`93087f5`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/93087f5776205fed69cd28a3e337577ebcec11c7) Thanks [@ovsw](https://github.com/ovsw)! - chore(theme): disable runtime theme switching and purge dark variants
  - Remove `next-themes` usage and theme toggle; stub `Providers` to no-op
  - Simplify `layout.tsx` to light-only; drop cookie/client-hint logic
  - Purge all `dark:` Tailwind variants across web and shared UI
  - Remove `next-themes` from `web` and `@workspace/ui` dependencies
  - Add ADR-001 with re-enable steps; update Cursor agent handbook to clarify light-only

## 1.4.1

## 1.4.0

### Patch Changes

- [#47](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/47) [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b) Thanks [@ovsw](https://github.com/ovsw)! - Introduce background color, noise texture, and top gradient via background.css
  - Import `background.css` in `apps/web/src/app/layout.tsx`
  - Add `public/images/bg/noise-red.svg` asset
  - Adjust `packages/ui` global styles to support background layering

- [#47](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/47) [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b) Thanks [@ovsw](https://github.com/ovsw)! - Switch ESLint tooling to exec (lockfile‑pinned) and refine a11y policy
  - Replace dlx with exec for ESLint/Prettier (root‑pinned toolchain) to eliminate local/CI drift
  - Remove zero‑warning gates; warnings allowed, accessibility rules error and fail hooks
  - Update Husky and lint‑staged to respect partial commits and show concise errors
  - Keep shared config with a11y rules as errors; downgrade non‑a11y to warnings across packages

## 1.3.1

## 1.3.0

### Minor Changes

- [#40](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/40) [`145ac73`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/145ac7305070c90f960c135bd15e01990954d551) Thanks [@ovsw](https://github.com/ovsw)! - Replace navbar with new header, Improve mobile menu styling and animation, Add Recipes button (desktop + mobile), Fix cart button hover cursor,Smooth hide-on-scroll behavior

## 1.2.3

### Patch Changes

- [#34](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/34) [`91d6d51`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/91d6d51fccb5b73bf230c28950c0b306936a8bf8) Thanks [@ovsw](https://github.com/ovsw)! - chore(devx): introduce Husky + lint-staged to enforce format/lint/types at commit and push; add CI format check

## 1.2.2

## 1.2.1

## 1.2.0

### Minor Changes

- [#23](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/23) [`cece48c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/cece48cadaa5670776737bcdbb623098453dd76e) Thanks [@ovsw](https://github.com/ovsw)! - upgraded to sanity 4.6.0, added types for sauces, products, recipies and corresponding structures in the sanity back-end.

## 1.1.0

### Minor Changes

- [#21](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/21) [`d3794ca`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/d3794ca601bc0de6ad67fcbb9ea152e07279e184) Thanks [@ovsw](https://github.com/ovsw)! - Ported over the DelGrosso Foods color tokens and set up the To process CSS from the UI package via the TypeScript config to trigger hot module reloads for CSS imports into globals.css

## 1.0.2

### Patch Changes

- [#18](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/18) [`5aa40f6`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/5aa40f6961a96b402f4e1fbaad61227f51badf7e) Thanks [@ovsw](https://github.com/ovsw)! - Raise minimum Node to 22.12.0 to fix Sanity typegen (ESM/CJS interop).

## 1.0.1

### Patch Changes

- [`129710f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/129710f84ebd83603923a1b225eaf1165aab477f) Thanks [@ovsw](https://github.com/ovsw)! - Initialize Changesets and unify versions across fixed workspaces.
  - Add Changesets tooling and config
  - Synchronize versions via fixed group
  - Generate initial CHANGELOGs via Release PR
