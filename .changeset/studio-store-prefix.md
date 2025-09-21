---
"studio": minor
---

Switch product canonical slugs from `/products` to `/store` in Studio.

- Enforce `/store` prefix for `product` documents (was `/products`)
- Enforce exact `/store` slug for `productIndex` (was `/products`)
- Update field descriptions and slug helper mapping
- Improve Alt Text automation input to respect read-only rules and nested source fields

Migration notes:

- Existing product slugs under `/products/...` will need updating to `/store/...` to align with the new frontend route.
