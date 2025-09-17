---
"studio": minor
"web": patch
---

Add slug fields to Product and Recipe schemas and add a slug backfill script for the development dataset.

- Add `slug` field to `productType` and `recipeType` documents in Studio
- Implement `apps/studio/scripts/backfill-slugs.ts` to populate slugs for all Product and Recipe documents in the dev dataset
- Regenerate Sanity types consumed by Web (`sanity.types.ts`)
