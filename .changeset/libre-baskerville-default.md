---
"web": minor
---

Switch default typography to Libre Baskerville (serif) and retain Geist as `font-sans` for selective use.

- Add `--font-serif` (Libre Baskerville 400/700 incl. italics) and apply `font-serif` to `<body>`
- Keep `--font-sans` (Geist) and `--font-mono` available; no API changes
- Uses `next/font/google` (self-hosted at build) per Tailwind v4 tokens
