# Three-Panel Section Implementation

## Overview

We've successfully implemented a three-panel section component to showcase the three sauce product lines: Original, Organic, and La Famiglia DelGrosso. The component matches the design from the video with hover interactions and animations.

## Implementation Details

### 1. Sanity Schema

- Created `apps/studio/schemaTypes/blocks/three-product-panels.ts`
- Added configuration for three product panels with:
  - Title, short description, and expanded description
  - Product image
  - Accent color (red, green, or brown)
  - CTA button
- Added to the blocks index in `apps/studio/schemaTypes/blocks/index.ts`

### 2. React Component

- Created `apps/web/src/components/systems/pagebuilder/blocks/three-product-panels-block.tsx`
- Implemented hover interactions that reveal:
  - Expanded descriptions
  - CTA buttons
  - Visual feedback with scaling and shadow effects
- Used Framer Motion for smooth animations
- Applied design system colors for consistency
- Images use object-contain to show full product images without cropping
- Removed zoom effect on hover for better user experience

### 3. Data Integration

- Added GROQ query fragment in `apps/web/src/lib/sanity/query.ts`
- Updated page builder query to include the new block
- Generated TypeScript types for proper type safety

### 4. Page Builder Integration

- Added the component to the page builder mapping in `apps/web/src/components/systems/pagebuilder/pagebuilder.tsx`
- Created render case for the new block type

## How to Add to Home Page

To add the three-panel section to the home page:

1. **Via Sanity Studio** (Recommended):
   - Go to Sanity Studio
   - Edit the home page
   - Add a new "Three Product Panels" block to the page builder
   - Configure the three panels with appropriate content, images, and CTAs

2. **Direct Code Addition** (If needed):
   - The component is already integrated into the page builder system
   - No additional code changes needed for rendering

## Content Configuration

For each of the three product lines, you'll need to configure:

1. **Original Sauces**:
   - Accent color: Red
   - Image: Original sauce collage
   - Description: Authentic sauces made since 1914
   - CTA: Link to sauces page

2. **Organic Sauces**:
   - Accent color: Green
   - Image: Organic sauce collage
   - Description: Simple, delicious organic pasta sauces
   - CTA: Link to sauces page

3. **La Famiglia DelGrosso**:
   - Accent color: Brown
   - Image: Premium sauce collage
   - Description: Special line of premium sauces with family seal
   - CTA: Link to sauces page

## Styling

The component uses the design system colors:

- Deep red for Original Sauces
- Olive green for Organic Sauces
- Dark brown for La Famiglia DelGrosso

Background is a light beige/cream color to match the video design.

## Testing

The implementation has been tested with:

- TypeScript type checking
- ESLint code quality checks
- Prettier formatting

The component is ready for use and will appear on the home page once added through the Sanity Studio page builder.
