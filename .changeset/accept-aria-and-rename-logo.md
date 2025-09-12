---
"web": patch
---

Make `LogoSvg` accept full SVG props and fix potential id collisions; rename file to `elements/logo.tsx` and update imports.

- Extend `LogoSvg` props to `ComponentPropsWithoutRef<'svg'>` and spread onto `<svg>` to allow `aria-*`, `role`, `id`, and other SVG attributes
- Remove hardcoded `id="a"` to avoid potential collisions in composed pages and OG rendering
- Rename `apps/web/src/components/elements/Logo.tsx` → `apps/web/src/components/elements/Logo.tsx` and update all imports (`navbar`, `navbar-client`, `footer`, `api/logo`, `api/og`, `header`)
