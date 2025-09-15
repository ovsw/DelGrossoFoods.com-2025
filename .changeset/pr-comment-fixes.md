---
"web": patch
"studio": patch
---

Address PR comment fixes in Studio and Web.

- Studio (page): use centralized slug validator with `sanityDocumentType: "page"`; remove manual `/blog` guard.
- Web (OG): coerce OG `title`/`description` to strings to avoid type drift (sauce).
