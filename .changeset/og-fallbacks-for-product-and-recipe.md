---
"web": patch
---

Improve OG data for products and recipes and extend sitemap coverage.

- Add fallbacks in OG projections: use `name` when `ogTitle/seoTitle/title` are missing; prefer `pt::text(description)` for product/recipe, fallback to `name`.
- Prefer `mainImage` (and its dominant color) before `image` to avoid null OG images.
- Add `product` and `recipe` pages to the sitemap query and generation.
