# @workspace/sanity-config

## 1.21.0

### Minor Changes

- [#113](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/113) [`96b47fc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/96b47fcf0ef2960427f59294a349334442182307) Thanks [@ovsw](https://github.com/ovsw)! - Sanity studios were upgraded to v5, gained the reusable tags input plus deployment and presentation URL helpers, and now scope their collections/fields per site with the new image/link schema pieces so each studio only edits its own documents while staying in sync with the multi-site web apps.

### Patch Changes

- [#113](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/113) [`876216f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/876216f69f54f5a619e31fbc78971a1296d27e35) Thanks [@ovsw](https://github.com/ovsw)! - Scope GROQ queries by site by moving shared fragments into `@workspace/sanity-config`, adding a reusable site-param helper, and relocating app-specific queries into each web app so DGF/LFD pages fetch only their own documents.

- Updated dependencies [[`ff7c115`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/ff7c115d9024756510e6663ae55b7ba557992d7e), [`cd7d1d9`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/cd7d1d9d7125b157e55d0f91daa249c210366823), [`96b47fc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/96b47fcf0ef2960427f59294a349334442182307)]:
  - @workspace/sanity-schema@1.21.0
