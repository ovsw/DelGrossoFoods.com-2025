---
"web": patch
---

SSR the primary navigation and improve accessibility and UX.

- Render both mobile and desktop variants on the server; remove client-only gating
- Add `<nav aria-label="Primary">` with responsive-only visibility
- Unmount mobile drawer content when closed to keep it inert
- Add active link states and `aria-current` for links and column triggers
- Add global skip-to-main link and wrap content in `main#main`


