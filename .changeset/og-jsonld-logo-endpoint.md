---
"web": patch
---

Add OG logo rendering and PNG logo endpoint; update JSON-LD

- Add `/api/logo` endpoint (Edge) to render inline `LogoSvg` to PNG via next/og
- Render inline logo in OG route layout; fix Satori display style requirements
- Update JSON-LD Organization/Article to use absolute `/api/logo` URL
- Allow `/api/og/*` and `/api/logo/*` in robots
