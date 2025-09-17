---
"studio": patch
---

Harden `createSlug` to safely support string and function mappers.

- Accept mapper values that are strings (fixed paths) or functions (computed)
- Treat strings ending with `/` as prefixes to compose with slugified input
- Normalize output (leading slash, collapse `//`, trim trailing slash)
- Preserve existing behavior for index docs (`/`, `/blog`, `/products`, etc.)
