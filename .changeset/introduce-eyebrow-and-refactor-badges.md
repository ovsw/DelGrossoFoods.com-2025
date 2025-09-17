---
"web": minor
"@workspace/ui": minor
---

Introduce Eyebrow component and refactor badge usage across sections

- Add `Eyebrow` UI component (`@workspace/ui/components/eyebrow`) with CVA variants `onLight` (default) and `onDark`. No background fill; uses a 1px left border and 1rem left padding; small text. Skips rendering when text is empty. Supports optional `aria-label` for accessibility.
- Refactor web sections to use `Eyebrow` instead of `Badge`:
  - `hero.tsx`, `cta.tsx`, `faq-accordion.tsx`, `image-link-cards.tsx`, `feature-cards-with-icon.tsx`.
- Keep `Badge` only for sauce cards; move color logic into `Badge` CVA variants (`original`, `organic`, `premium`, `pizza`, `pasta`, `salsa`, `sandwich`).
- Simplify `Badge` API (required `text`, optional `href`) so the component only handles styling while callers supply content/links.
