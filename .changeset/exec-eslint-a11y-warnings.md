---
"web": patch
"studio": patch
"@workspace/ui": patch
"@workspace/eslint-config": patch
---

Switch ESLint tooling to exec (lockfile‑pinned) and refine a11y policy

- Replace dlx with exec for ESLint/Prettier (root‑pinned toolchain) to eliminate local/CI drift
- Remove zero‑warning gates; warnings allowed, accessibility rules error and fail hooks
- Update Husky and lint‑staged to respect partial commits and show concise errors
- Keep shared config with a11y rules as errors; downgrade non‑a11y to warnings across packages
