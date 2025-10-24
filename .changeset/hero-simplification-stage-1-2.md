---
"web": patch
---

Hero components simplification (Stage 1–2): migrate Recipe Hero (overlay) and Sauce Hero (split/grid) off the shared HeroLayout. Inline explicit markup per page section to keep behavior and visuals identical: Recipe uses a full-bleed image with gradient overlay and bottom-left content stack (Eyebrow, H1, badges) and maintains alt fallback to `${stegaClean(recipeName)} recipe`. Sauce uses Section + grid with the previous background image and subtle overlay, preserves BackLink prelude, Eyebrow, title color override when a valid colorHex is provided, description (RichText), buttons, and product jar image with alt fallback. No user-visible changes expected; removes unnecessary abstraction from these sections.
