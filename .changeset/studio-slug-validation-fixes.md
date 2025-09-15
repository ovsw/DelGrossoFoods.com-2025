---
"studio": patch
---

Improve slug validation UX and sauce index rules in Studio.

- Show descriptive uniqueness errors for slugs (includes conflicting doc name)
- Enforce prefixes for `sauce` (`/sauces/`) and `sauceIndex` (`/sauces`)
- Normalize `sauceIndex` cleaning to exact `/sauces` (symmetry with blog index)
