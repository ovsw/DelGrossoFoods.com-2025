---
"web": minor
"@workspace/ui": patch
---

Introduce background color, noise texture, and top gradient via background.css

- Import `background.css` in `apps/web/src/app/layout.tsx`
- Add `public/images/bg/noise-red.svg` asset
- Adjust `packages/ui` global styles to support background layering
