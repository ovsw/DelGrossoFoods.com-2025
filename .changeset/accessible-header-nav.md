---
"web": patch
---

Improve header navigation accessibility and hover/active UX.

- Introduce `NavLink` with `aria-current` and strong focus-visible styles
- Refactor `DesktopNav` to semantic `ul`/`li` markup using `NavLink`
- Add active state + `aria-current` in `MobileNavPanel` for consistency
- Keep UI styling consistent without adding new dependencies
