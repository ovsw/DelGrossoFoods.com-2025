---
"web": patch
---

Hero components simplification (Stage 3): add a minimal shared image-backed hero section `SharedImageHeroSection` for non-entity pages. Uses `Section` with `spacingTop="page-top"`, `spacingBottom="default"`, and `fullBleed`, applies a background via `backgroundSrc`, supports optional `overlayTone` (default "dark") for a dark gradient overlay, and renders only a title and optional subtitle (no eyebrow). Light-only tokens, no CSS-var utilities.
