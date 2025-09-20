---
"web": minor
"@workspace/ui": patch
---

Add SSR + client-filterable Store index at `/store` and refactor shared UI for filterable lists.

- Implement `/store` with SSR data fetch and client-side filtering for products
- Add product queries (`getProductIndexPageQuery`, `getAllProductsForIndexQuery`)
- Extract `FilterableListLayout` (shared layout for filters/results/sort) and `ListCard` (shared grid card)
- Update Sauces index to reuse shared layout and card
- Scaffold `/store/[slug]` placeholder page
- UI: export `BadgeVariant` type inferred from `badgeVariants` CVA for safer consumers

Notes:

- Product filters include Search, Packaging (Case/Gift/Other), Product Line, and Sauce Type (including Mix)
- Merchandise shows no badges; Mix only matches products with multiple sauce types
