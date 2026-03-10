---
"web-dgf": patch
"web-lfd": patch
---

Add hard 301 redirects for legacy product, recipe, and shop pages so historical DelGrosso Foods URLs continue resolving after the Next.js migration.

Move the redirect lists into dedicated modules with shared helpers, and wire them into each app's `next.config.ts` alongside the existing redirects and headers configuration.
