---
"web-dgf": patch
"web-lfd": patch
"studio-dgf": patch
"studio-lfd": patch
"@workspace/ui": patch
"@workspace/eslint-config": patch
---

Fix the formatting pipeline by separating ESLint from Prettier formatting responsibilities, apply the resulting Prettier updates in both web apps and shared UI, and update Studio deploy workflow path triggers to run only when Studio-related files change.
