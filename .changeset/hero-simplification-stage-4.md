---
"web": patch
---

Hero components simplification (Stage 4): update Product Hero to match the image‑only design. Center a single product jar image over the shared “counter‑wall” background with a subtle overlay; remove split/grid expectations and avoid in‑hero text/CTAs. Improve alt fallback to `image.alt || stegaClean(product.name) || "Product image"`. Visual behavior remains the same; this removes unnecessary abstraction and aligns the hero with the provided design.
