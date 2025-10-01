---
"web": patch
---

Refactor component architecture to align with Page Sections, Elements, and Features.

- Move non-Section composites to `features/*` and presentational UI to `elements/*`
- Rename and relocate page sections to `<page>-<section>-section.tsx` under `page-sections/*`
- Replace mixed `RelatedItemsLayout` with domain layouts:
  - `related-products-layout`, `single-related-product-layout`
  - `related-sauces-layout`, `single-related-sauce-layout`
  - keep `related-recipes-layout`
- Add thin index wrappers that own `<Section>` and compose catalog clients:
  - `sauces-index-page/sauces-catalog-section`
  - `products-index-page/products-catalog-section`
  - `recipes-index-page/recipes-catalog-section`
- Move `product-purchase-panel` to `features/cart/`
- Promote `nutrition-facts-panel` and cards to `elements/`
- Update imports across app pages and sections

Docs: clarify organization + naming and shared/section-internals guidance in `AGENTS.md`.
