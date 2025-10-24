---
"web": patch
---

Hero components simplification (Stage 5): remove the shared `HeroLayout` and sweep all usages. Recipe, Sauce, and Product heroes now use explicit, local section markup (overlay, split/grid, and image-only respectively) with backgrounds owned by the sections. No functional/UI changes intended; this eliminates an unnecessary abstraction and clarifies ownership.
