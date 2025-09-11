---
"web": patch
"studio": patch
---

Make brand logo code-owned and remove CMS logo.

- Replace header, nav, and footer logos with inline `LogoSvg` (currentColor theming)
- Remove `logo` from Sanity `settings` schema and from related queries/types
- Update OG image route and JSON-LD to no longer depend on CMS logo
- Delete obsolete Sanity-driven `Logo` image component in web
- Lint/typecheck clean across web and studio
