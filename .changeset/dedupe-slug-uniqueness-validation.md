---
"studio": patch
---

Deduplicate slug uniqueness validation by removing `options.isUnique` wherever a custom uniqueness rule already exists.

- Use `Rule.custom(createUniqueSlugRule())` as the single source of truth
- Drop redundant `isUnique` from slug field options in content docs (blog, page, product, recipe, sauce)
- Keep index docs as-is since they only use `isUnique` and have no duplication
