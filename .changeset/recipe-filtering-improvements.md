---
"web": minor
"studio": minor
"@workspace/ui": minor
---

Improve recipe filtering UX with human-readable category URLs and enhanced badge interactions

- Replace categoryId with categorySlug for human-readable URLs (e.g., /recipes?categorySlug=appetizers)
- Add slug field to recipe categories in Sanity schema
- Update all recipe filtering logic to use slugs instead of IDs
- Add cursor pointer and improved hover states to clickable recipe badges
- Enhance badge outline variant with subtle background and border changes on hover
