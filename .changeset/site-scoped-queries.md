---
"@workspace/sanity-config": patch
"web-dgf": patch
"web-lfd": patch
---

Scope GROQ queries by site by moving shared fragments into `@workspace/sanity-config`, adding a reusable site-param helper, and relocating app-specific queries into each web app so DGF/LFD pages fetch only their own documents.
