# Project Architecture Migration Plan

## Overview

This document outlines the migration from the current confusing component structure to a clear, maintainable architecture organized by page context and separated by concerns.

## Current Issues

1. **Ambiguous naming**: Files like `sauce-related-products-section.tsx` contain components for multiple different pages
2. **Single Responsibility Principle violation**: One file handles both sauce-page and recipe-page logic
3. **Poor discoverability**: Unclear where to find components for specific pages
4. **Maintenance challenges**: Changes to one page's logic can affect other pages unintentionally

## Target Architecture

```
apps/web/src/components/
├── page-sections/           # Page-specific orchestration components
│   ├── sauce-page/
│   │   ├── hero-section.tsx              # SauceHeroSection - data fetching + hero-layout
│   │   ├── nutritional-info-section.tsx  # SauceNutritionalInfoSection - data fetching + info-layout
│   │   └── related-products-section.tsx  # SauceRelatedProductsSection - data fetching + related-items-layout
│   ├── recipe-page/
│   │   ├── hero-section.tsx              # RecipeHeroSection - data fetching + hero-layout
│   │   ├── details-section.tsx           # RecipeDetailsSection - data fetching + details-layout
│   │   └── related-sauces-section.tsx    # RecipeRelatedSaucesSection - data fetching + related-items-layout
│   ├── product-page/        # Future: if individual product pages are added
│   │   └── ...
│   └── shared/              # Complete sections used identically across pages
│       └── ...
├── layouts/                 # Reusable presentation components
│   ├── hero-layout.tsx                   # Generic hero presentation
│   ├── details-layout.tsx                # Generic details presentation
│   ├── related-items-layout.tsx          # Generic related items presentation
│   └── ...
└── elements/                # Page-agnostic UI components (formerly scattered)
    ├── sanity-buttons.tsx
    ├── sanity-image.tsx
    └── ...

# Sanity Integration (unchanged)
apps/web/src/lib/sanity/
├── query.ts                 # All GROQ queries using defineQuery from next-sanity
├── sanity.types.ts          # Generated TypeScript types from Sanity TypeGen
└── live.ts                  # Live preview configuration
```

## Migration Strategy

### Phase 1: Preparation (Non-breaking)

1. **Create new directory structure** alongside existing one
2. **Extract shared layouts** from existing components
3. **Create page-specific section directories**

### Phase 2: Component Migration (Incremental)

1. **Migrate recipe-page components first** (most problematic currently)
2. **Migrate sauce-page components**
3. **Update import statements** across the codebase
4. **Test each page** after migration

### Phase 3: Cleanup

1. **Remove old component files**
2. **Update any remaining imports**
3. **Final testing and verification**

## Detailed Migration Steps

### Step 1: Create New Structure

```bash
# Create directories
mkdir -p apps/web/src/components/page-sections/sauce-page
mkdir -p apps/web/src/components/page-sections/recipe-page
mkdir -p apps/web/src/components/layouts
mkdir -p apps/web/src/components/elements

# Move existing UI components to elements/
mv apps/web/src/components/sanity-* apps/web/src/components/elements/
```

### Step 2: Extract Shared Layouts

**Create `related-items-layout.tsx`:**

```typescript
// Handles both grid and single-item layout
export function RelatedItemsLayout({
  items,
  type,
  variant = "default"
}: RelatedItemsLayoutProps) {
  if (items.length === 1 && variant === "single-item-prominent") {
    return <SingleItemProminentView item={items[0]} type={type} />;
  }
  return <GridView items={items} type={type} />;
}
```

**Create `hero-layout.tsx`:**

```typescript
// Generic hero presentation used by both sauce and recipe pages
export function HeroLayout({ title, eyebrow, image, children }: HeroLayoutProps) {
  return (
    <Section>
      <div className="hero-content">
        {/* Shared hero presentation logic */}
      </div>
    </Section>
  );
}
```

### Step 3: Create Page-Specific Sections

**Recipe Page - Related Sauces Section:**

```typescript
// apps/web/src/components/page-sections/recipe-page/related-sauces-section.tsx
import { sanityFetch } from "@/lib/sanity/live";
import { getSaucesByIdsQuery } from "@/lib/sanity/query";
import type { GetSaucesByIdsQueryResult } from "@/lib/sanity/sanity.types";
import { handleErrors } from "@/utils";

export async function RecipeRelatedSaucesSection({ recipeId }: { recipeId: string }) {
  // Use existing Sanity query and types
  const [result] = await handleErrors(
    sanityFetch({
      query: getSaucesByIdsQuery,
      params: { sauceIds: [recipeId] }, // Query expects array of IDs
    }),
  );
  const sauces = (result?.data ?? []) as GetSaucesByIdsQueryResult;

  return (
    <RelatedItemsLayout
      items={sauces}
      type="sauce"
      variant="single-item-prominent" // Recipe-page specific variant
    />
  );
}
```

**Sauce Page - Related Products Section:**

```typescript
// apps/web/src/components/page-sections/sauce-page/related-products-section.tsx
import { sanityFetch } from "@/lib/sanity/live";
import { getProductsBySauceIdQuery } from "@/lib/sanity/query";
import type { GetProductsBySauceIdQueryResult } from "@/lib/sanity/sanity.types";
import { handleErrors } from "@/utils";

export async function SauceRelatedProductsSection({ sauceId }: { sauceId: string }) {
  // Use existing Sanity query and types
  const [result] = await handleErrors(
    sanityFetch({
      query: getProductsBySauceIdQuery,
      params: { sauceId },
    }),
  );
  const products = (result?.data ?? []) as GetProductsBySauceIdQueryResult;

  return (
    <RelatedItemsLayout
      items={products}
      type="product"
      variant="default" // Sauce-page variant
    />
  );
}
```

### Step 4: Update Import Statements

**Update recipe pages:**

```typescript
// Before
import { RecipeRelatedSaucesSection } from "@/components/sauces/sauce-related-products-section";

// After
import { RecipeRelatedSaucesSection } from "@/components/page-sections/recipe-page/related-sauces-section";
```

**Update sauce pages:**

```typescript
// Before
import { SauceRelatedProductsSection } from "@/components/sauces/sauce-related-products-section";

// After
import { SauceRelatedProductsSection } from "@/components/page-sections/sauce-page/related-products-section";
```

**Update layout imports in page sections:**

```typescript
// In page section files, import layouts
import { RelatedItemsLayout } from "@/components/layouts/related-items-layout";

// Import Sanity queries and types
import { getSaucesByIdsQuery } from "@/lib/sanity/query";
import type { GetSaucesByIdsQueryResult } from "@/lib/sanity/sanity.types";
```

### Step 5: Migrate Existing Components

**Migrate hero sections:**

- Move `RecipeHeroSection` to `page-sections/recipe-page/hero-section.tsx`
- Move `SauceHeroSection` to `page-sections/sauce-page/hero-section.tsx`
- Extract shared logic to `layouts/hero-layout.tsx`
- Update hero sections to use appropriate Sanity queries (e.g., `getRecipeBySlugQuery`, `getSauceBySlugQuery`)
- Import types from `@/lib/sanity/sanity.types`

**Migrate detail sections:**

- Move `RecipeDetailsSection` to `page-sections/recipe-page/details-section.tsx`
- Extract shared logic to `layouts/details-layout.tsx`
- Update to use `getRecipeBySlugQuery` for full recipe data
- Import `GetRecipeBySlugQueryResult` type

**Migrate existing related sections:**

- Move `RecipeRelatedSaucesSection` from `sauce-related-products-section.tsx` to `page-sections/recipe-page/related-sauces-section.tsx`
- Move `SauceRelatedProductsSection` to `page-sections/sauce-page/related-products-section.tsx`
- Update to use existing Sanity queries (`getSaucesByIdsQuery`, `getProductsBySauceIdQuery`)
- Import appropriate result types from `@/lib/sanity/sanity.types`

## Sanity Integration Requirements

All page sections must follow these patterns:

### **Query Usage**

```typescript
// Import from existing query file
import { getSaucesByIdsQuery } from "@/lib/sanity/query";

// Use with sanityFetch pattern
const [result] = await handleErrors(
  sanityFetch({
    query: getSaucesByIdsQuery,
    params: { sauceIds: [recipeId] },
  }),
);
```

### **Type Usage**

```typescript
// Import generated types
import type { GetSaucesByIdsQueryResult } from "@/lib/sanity/sanity.types";

// Use existing result types
const sauces = (result?.data ?? []) as GetSaucesByIdsQueryResult;
```

### **Error Handling**

- Use existing `handleErrors` utility from `@/utils`
- Follow existing `sanityFetch` pattern with `[result] = await handleErrors(...)`
- Maintain existing error handling behavior

## Migration Verification Checklist

### For Each Migrated Component:

- [ ] Component renders correctly on target page
- [ ] All props are properly typed using Sanity-generated types
- [ ] Import statements updated across codebase
- [ ] No breaking changes to public API
- [ ] Layout behavior matches original implementation
- [ ] Uses correct Sanity queries from `@/lib/sanity/query`
- [ ] Imports types from `@/lib/sanity/sanity.types`

### For Shared Layouts:

- [ ] Used correctly by all consuming page sections
- [ ] Handles different data types appropriately
- [ ] Responsive behavior works as expected
- [ ] Accessibility features preserved

### For Overall Migration:

- [ ] All pages load without errors
- [ ] No console warnings or errors
- [ ] Build completes successfully
- [ ] Type checking passes
- [ ] All existing functionality preserved
- [ ] Sanity queries and types are used correctly throughout

## Rollback Plan

If issues are discovered:

1. **Keep old components** as backup during migration
2. **Gradual rollout**: Migrate one page at a time
3. **Feature flags**: Use conditional imports during transition
4. **Quick revert**: Can restore old structure if needed

## Benefits After Migration

1. **Clear organization**: Immediately obvious where to find page-specific logic
2. **Better reusability**: Shared layouts reduce code duplication
3. **Easier maintenance**: Changes to presentation logic centralized
4. **Improved developer experience**: Faster onboarding and development
5. **Scalability**: Easy to add new pages following established patterns

## Timeline Estimate

- **Phase 1 (Preparation)**: 1-2 hours
- **Phase 2 (Migration)**: 2-3 hours per page section
- **Phase 3 (Verification)**: 1 hour
- **Total**: 4-8 hours for complete migration

This migration will significantly improve code organization and maintainability while preserving all existing functionality.
