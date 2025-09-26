---
"web": minor
---

Add product detail page and minimal product hero.

- Introduce `ProductHero` to mirror sauce hero background but render only the centered product image (no text/buttons).
- Add `/store/[slug]` product detail page using new GROQ `getProductBySlugQuery` and display structured product facts (SKU, pack size, price, weight, shipping).
- aligne section components naming conventions, eg: renamed `SaucesRelatedRecipes` section to `RelatedRecipesSection`.
- Show associated sauces on product pages using existing `RelatedSaucesSection`.
- Show associated recipes on product pages using existing section `RelatedRecipesSection`.
- Update SEO for product detail pages to use a supported OpenGraph type ("article") to avoid runtime error.
