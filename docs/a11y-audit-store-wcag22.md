# Accessibility Audit: `/store` (DGF + LFD) - WCAG 2.2

Date: 2026-02-14  
Audited routes:

- `http://localhost:3000/store` (DGF)
- `http://localhost:3001/store` (LFD)

## Scope and method

- Standard: WCAG 2.2 (focus on A/AA criteria surfaced by tooling).
- Runs performed with Lighthouse accessibility audits (mobile + desktop emulation).
- Findings validated against rendered DOM and mapped to source components.

## Results summary

### Mobile emulation

- DGF accessibility score: **94**
- LFD accessibility score: **94**
- Failing rule groups:
  - `label-content-name-mismatch`
  - `target-size`
  - `heading-order`

### Desktop emulation

- DGF accessibility score: **96**
- LFD accessibility score: **96**
- Failing rule groups:
  - `label-content-name-mismatch`
  - `target-size`

## Findings

### 1) High: Label in Name mismatch on product cards

- Severity: High
- WCAG 2.2 mapping: **2.5.3 Label in Name (A)**
- Impact:
  - DGF: 40 instances
  - LFD: 17 instances
- What happens:
  - Product card links use an accessible name prefixed with `"View ..."` while visible text begins with the product name.
  - This can break speech-input expectations where users say visible labels.
- Root cause (code):
  - `apps/web-dgf/src/components/elements/product-card.tsx`
  - `apps/web-lfd/src/components/elements/product-card.tsx`
  - `packages/ui/src/components/list-card.tsx`

### 2) Medium: Footer contact links below minimum target size

- Severity: Medium
- WCAG 2.2 mapping: **2.5.8 Target Size (Minimum) (AA)**
- Impact:
  - DGF: 3 instances
  - LFD: 3 instances
- What happens:
  - Contact links in the footer are short in height and tightly stacked, reducing usable touch area.
  - Audit data reports targets below 24x24 effective area.
- Root cause (code):
  - `apps/web-dgf/src/components/features/footer/footer.tsx`
  - `apps/web-lfd/src/components/features/footer/footer.tsx`

### 3) Medium: Heading order issue (mobile run)

- Severity: Medium
- WCAG 2.2 mapping: **1.3.1 Info and Relationships (A)**
- Impact:
  - DGF: 1 rule failure
  - LFD: 1 rule failure
- What happens:
  - Product card headings (`h3`) are detected as out-of-sequence in mobile context.
- Root cause (code):
  - `packages/ui/src/components/list-card.tsx`
  - `packages/ui/src/components/catalog-filterable-list-layout.tsx`

## Recommended remediations

1. **Fix label/name mismatch**
   - Remove the `"View "` prefix from card link accessible names, or rely on computed link name from visible content.
   - Ensure accessible name starts with the same words users see on screen.

2. **Increase footer link target area**
   - Add minimum hit area (`min-height`, vertical padding, line-height) and spacing between stacked contact links.
   - Keep visual style while making each link independently touch-friendly.

3. **Normalize heading hierarchy**
   - Avoid hard-coding `h3` in generic list cards where surrounding heading context is not guaranteed.
   - Use a configurable heading level or non-heading text for repeated cards when appropriate.

## Notes

- This report reflects local environment testing against running dev servers.
- This is not a full assistive-technology certification pass (for example, full VoiceOver/NVDA scripted journeys were not included).
