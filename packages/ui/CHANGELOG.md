# @workspace/ui

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
