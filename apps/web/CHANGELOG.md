# web

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
