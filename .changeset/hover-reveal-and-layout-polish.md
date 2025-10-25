---
"web": patch
"@workspace/ui": patch
---

Restore hover reveal and polish layouts across web UI:

- Reinstate hover-based content reveal in `ThreeProductPanelsBlock` with coordinated lift and CSS-only grid expand + opacity fade.
- Refine `FeatureCardGridLayout` columns and card spacing; adjust `ThreeProductPanelsBlock` padding and text sizes for responsiveness.
- Update Sauce hero and home slideshow to use the taller background image variant for visual consistency.
- Improve footer spacing, alignment, and social links responsiveness.
- Tweak `Button` styles in `@workspace/ui` for clearer hierarchy and consistency.

Commits: 0e1fb51, cbed15f, d1d6da6, 846bf73.
