---
"web": patch
---

Fix SSR hydration mismatch by making theme selection deterministic.

- Ensure the server-rendered `html` `class` and inline `color-scheme` match the initial theme used on the client to prevent hydration errors.
- Consolidate initial theme logic in `RootLayout` and providers to avoid client-only theme flashes.
