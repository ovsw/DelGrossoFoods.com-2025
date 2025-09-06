---
"@workspace/eslint-config": patch
"studio": patch
"@workspace/ui": patch
"web": patch
---

Unify formatting and pre-commit tooling across the monorepo:

- Add a single Prettier config at the repo root (double quotes, semi, bracket spacing, 80 cols)
- Remove per-package Prettier drift so all packages inherit root rules
- Adopt hybrid lint-staged setup (shared base + per-package configs); keep web commits tolerant of warnings while enforcing a11y errors
- Add pre-push type checks via Turbo `check-types`

This is a tooling/DevEx change only; no runtime behavior affected.
