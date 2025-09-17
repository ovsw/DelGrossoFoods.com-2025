---
"@workspace/ui": patch
---

Harden Badge typing and remove `any` cast

- Use a discriminated union for anchor vs. span props
- Conditionally pass `href` only when rendering an `<a>`
- Keep `text`, `className`, and `variant` API unchanged
