---
"web": patch
"studio": patch
"@workspace/ui": patch
---

Refactor product panels and cards with improved styling and animations

- Simplify ThreeProductPanelsBlock by removing framer motion and making it a RSC
- Extract ProductPanelCard component with improved layout and animation
- Introduce dynamic gradient overlay with CSS variable support
- Consolidate className definitions for better readability
- Update Sanity schema for three-product-panels block
- Add SurfaceShineOverlay component with enhanced styling
