---
"web": minor
"studio": minor
"@workspace/ui": minor
---

- add redesigned home slideshow block wired to the updated homePageBuilder schema
- extend shared Section layout with a fullBleed option and align hero sections around it
- improve homepage slideshow client with click-to-edit support and consistent transitions
  Commits:
- feat(studio): rename pageBuilder to homePageBuilder and update schema
- feat(ui): add click-to-edit support for home slideshow
- refactor(ui): make transition durations consistent in home slideshow
- feat(ui): add fullBleed prop to Section for full-width layouts
- refactor(ui): move max-width and centering from PageBuilder to Section component
- feat(web): add homeSlideshow block for dynamic homepage slides
- feat(web): reverted homepage slidesow to a version of the old layout, with improved design.
- refactor(web): Restructured the HomeSlideshowSection component to use a two-row layout on desktop for better visual separation of text and images.
