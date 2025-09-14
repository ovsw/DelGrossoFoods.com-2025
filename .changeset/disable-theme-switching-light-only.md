---
"web": patch
"@workspace/ui": patch
---

chore(theme): disable runtime theme switching and purge dark variants

- Remove `next-themes` usage and theme toggle; stub `Providers` to no-op
- Simplify `layout.tsx` to light-only; drop cookie/client-hint logic
- Purge all `dark:` Tailwind variants across web and shared UI
- Remove `next-themes` from `web` and `@workspace/ui` dependencies
- Add ADR-001 with re-enable steps; update Cursor agent handbook to clarify light-only
