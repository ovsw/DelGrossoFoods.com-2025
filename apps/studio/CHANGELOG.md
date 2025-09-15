# studio

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

- [#55](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/55) [`7e9396f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7e9396f38878afd735d409e877e2ccf4d54ad503) Thanks [@ovsw](https://github.com/ovsw)! - Improve slug validation UX and sauce index rules in Studio.
  - Show descriptive uniqueness errors for slugs (includes conflicting doc name)
  - Enforce prefixes for `sauce` (`/sauces/`) and `sauceIndex` (`/sauces`)
  - Normalize `sauceIndex` cleaning to exact `/sauces` (symmetry with blog index)

## 1.4.2

## 1.4.1

### Patch Changes

- [#49](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/49) [`6a10ecc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/6a10eccc583e7060b55b3b367223caece8872ea9) Thanks [@ovsw](https://github.com/ovsw)! - Make brand logo code-owned and remove CMS logo.
  - Replace header, nav, and footer logos with inline `LogoSvg` (currentColor theming)
  - Remove `logo` from Sanity `settings` schema and from related queries/types
  - Update OG image route and JSON-LD to no longer depend on CMS logo
  - Delete obsolete Sanity-driven `Logo` image component in web
  - Lint/typecheck clean across web and studio

## 1.4.0

### Patch Changes

- [#47](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/47) [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b) Thanks [@ovsw](https://github.com/ovsw)! - Switch ESLint tooling to exec (lockfile‑pinned) and refine a11y policy
  - Replace dlx with exec for ESLint/Prettier (root‑pinned toolchain) to eliminate local/CI drift
  - Remove zero‑warning gates; warnings allowed, accessibility rules error and fail hooks
  - Update Husky and lint‑staged to respect partial commits and show concise errors
  - Keep shared config with a11y rules as errors; downgrade non‑a11y to warnings across packages

## 1.3.1

## 1.3.0

## 1.2.3

### Patch Changes

- [#34](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/34) [`91d6d51`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/91d6d51fccb5b73bf230c28950c0b306936a8bf8) Thanks [@ovsw](https://github.com/ovsw)! - chore(devx): introduce Husky + lint-staged to enforce format/lint/types at commit and push; add CI format check

## 1.2.2

## 1.2.1

## 1.2.0

### Minor Changes

- [#23](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/23) [`cece48c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/cece48cadaa5670776737bcdbb623098453dd76e) Thanks [@ovsw](https://github.com/ovsw)! - upgraded to sanity 4.6.0, added types for sauces, products, recipies and corresponding structures in the sanity back-end.

## 1.1.0

## 1.0.2

### Patch Changes

- [#18](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/18) [`5aa40f6`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/5aa40f6961a96b402f4e1fbaad61227f51badf7e) Thanks [@ovsw](https://github.com/ovsw)! - Raise minimum Node to 22.12.0 to fix Sanity typegen (ESM/CJS interop).

- [#20](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/20) [`4696ffe`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/4696ffee18a9809728911edb903b8b743ee57722) Thanks [@ovsw](https://github.com/ovsw)! - Add Sanity schemas: sauces, recipes, products, and product index. Register schemas in studio, desk structure updates. Add custom inputs for USD price and Alt Text From Field. Imported sanity content from prototype version of project into sanity development dataset.

## 1.0.1

### Patch Changes

- [`129710f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/129710f84ebd83603923a1b225eaf1165aab477f) Thanks [@ovsw](https://github.com/ovsw)! - Initialize Changesets and unify versions across fixed workspaces.
  - Add Changesets tooling and config
  - Synchronize versions via fixed group
  - Generate initial CHANGELOGs via Release PR
