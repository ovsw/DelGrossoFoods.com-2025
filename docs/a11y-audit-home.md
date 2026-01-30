## Accessibility Audit - Home Page (web-dgf)

Scope: `/` (home page)
Standard: WCAG 2.1 AA
Environment: local dev (`http://localhost:3000`)
Date: 2026-01-30

### Method

- UI audit: keyboard navigation, focus order, and accessibility tree.
- Code audit: reviewed page builder blocks and shared components used on home.

### Findings

#### Failures / High Priority

1. Auto-rotating carousel has no pause/stop control (WCAG 2.2.2).
   - Impact: users cannot pause moving content.
   - Evidence: `HomeSlideshowBlock` auto-advances every 6s with no UI to pause.

2. Mobile nav content remains focusable when closed (WCAG 2.1.1, 2.4.3).
   - Impact: keyboard users can tab into hidden links.
   - Evidence: menu is visually hidden via max-height/opacity only.

3. Header logo link has no accessible name (WCAG 2.4.4).
   - Impact: screen readers announce a link with no label.
   - Evidence: logo link wraps only SVG with no `aria-label`.

4. Rich text images render without alt text (WCAG 1.1.1).
   - Impact: images in rich text are silent to screen readers.
   - Evidence: `RichText` image renderer passes no `alt` to `SanityImage`.

#### Medium / Potential Issues

5. Rich text links set `aria-label` to the URL, overriding visible text (WCAG 2.4.4).
   - Impact: accessible name becomes a URL, not the link’s label.

6. Carousel dot indicators rely on color only for current state (WCAG 1.4.1).
   - Impact: users who can’t perceive color may miss the active slide.

7. Likely missing a page-level `<h1>` on home (Advisory, 2.4.6).
   - Impact: heading hierarchy may be unclear for screen reader users.

### Notes

- Skip link exists and targets `#main`.
- Most controls in hero, newsletter, and FAQ sections have accessible labels.

---

## Accessibility Audit - Sauces Index Page (web-dgf)

Scope: `/sauces`
Standard: WCAG 2.1 AA
Environment: local dev (`http://localhost:3000/sauces`)
Date: 2026-01-30

### Method

- UI audit: keyboard navigation and accessibility tree.
- Code audit: sauces page, catalog layout, filter components, and cards.

### Findings

#### Failures / High Priority

1. Header logo link has no accessible name (WCAG 2.4.4).
   - Impact: screen readers announce an unlabeled link.
   - Evidence: header logo link wraps only SVG with no `aria-label`.

2. Mobile nav content remains focusable when closed (WCAG 2.1.1, 2.4.3).
   - Impact: keyboard users can tab into hidden links.
   - Evidence: menu is visually hidden via max-height/opacity only.

#### Advisory

3. Results grid is not marked up as a list (best practice, not a strict failure).
   - Impact: screen reader users don’t get list semantics for the catalog items.

### Notes

- Sauce page hero uses an `<h1>`.
- Filter controls are labeled and grouped with fieldsets.
- Results summary uses `aria-live="polite"` to announce changes.

---

## Accessibility Audit - Sauce Detail Page (web-dgf)

Scope: `/sauces/garden-style-pasta-sauce`
Standard: WCAG 2.1 AA
Environment: local dev (`http://localhost:3000/sauces/garden-style-pasta-sauce`)
Date: 2026-01-30

### Method

- UI audit: keyboard navigation and accessibility tree.
- Code audit: sauce detail page and sections.

### Findings

#### Failures / High Priority

1. Nested `<main>` landmarks (WCAG 1.3.1).
   - Impact: screen readers get multiple main landmarks for the same page.
   - Evidence: app layout renders `<main id="main">`, and the sauce page also returns `<main>...</main>`.

2. Header logo link has no accessible name (WCAG 2.4.4).
   - Impact: screen readers announce an unlabeled link.
   - Evidence: logo link wraps only SVG with no `aria-label`.

3. Mobile nav content remains focusable when closed (WCAG 2.1.1, 2.4.3).
   - Impact: keyboard users can tab into hidden links.
   - Evidence: menu is visually hidden via max-height/opacity only.

### Notes

- Sauce hero includes an `<h1>` and CTA links.
