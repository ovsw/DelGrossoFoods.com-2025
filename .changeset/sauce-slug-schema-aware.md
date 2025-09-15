---
"web": minor
"studio": minor
---

Make slug input schema-aware and add sauce slugs under `/sauces/`.

- Slug field component now respects each field’s `options.source` and `options.slugify`, enabling Generate/Clean Up for docs without a `title` (e.g., sauces use `name`).
- Enforce `/sauces/` prefix for `sauce` documents; add cleaner/validator rules and slug prefix mapping.
- Update sauce schema to include slug with auto-generation and validation.
- Update web links to `/sauces/` and fix OG queries to use plain-text sauce descriptions.
