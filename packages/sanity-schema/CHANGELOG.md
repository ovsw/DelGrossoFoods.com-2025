# @workspace/sanity-schema

## 1.22.0

### Minor Changes

- [#135](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/135) [`9c025e5`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/9c025e582b6ed6b3e466a49a3b04f7a86e69c004) Thanks [@ovsw](https://github.com/ovsw)! - Introduce a dedicated leadership content model with reusable `leader` references, wire it into both Sanity studios, and add /leadership pages for DGF and LFD that pull the richer data via the updated queries so the new section can be managed and rendered consistently.

## 1.21.0

### Minor Changes

- [#113](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/113) [`96b47fc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/96b47fcf0ef2960427f59294a349334442182307) Thanks [@ovsw](https://github.com/ovsw)! - Sanity studios were upgraded to v5, gained the reusable tags input plus deployment and presentation URL helpers, and now scope their collections/fields per site with the new image/link schema pieces so each studio only edits its own documents while staying in sync with the multi-site web apps.

### Patch Changes

- [#118](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/118) [`ff7c115`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/ff7c115d9024756510e6663ae55b7ba557992d7e) Thanks [@ovsw](https://github.com/ovsw)! - Ship a broad accessibility and UX refresh across both web apps, including improved navigation and card semantics, Where To Buy experience updates, slideshow and footer/header improvements, and SEO page-heading adjustments.

  Update shared UI building blocks to support the accessibility work and refine Sanity site-structure/schema support plus project documentation for the new workflows.

- [#113](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/113) [`cd7d1d9`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/cd7d1d9d7125b157e55d0f91daa249c210366823) Thanks [@ovsw](https://github.com/ovsw)! - Add per-site slug uniqueness plus shared desk structure factory so each Studio only surfaces its own singletons.
