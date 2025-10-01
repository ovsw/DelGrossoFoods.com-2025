# Project Architecture Migration Plan

## Overview

This document outlines the comprehensive migration from the current component structure to a clear, maintainable architecture organized by scope, function, and responsibility. This updated plan extends the original architecture to handle all components in the codebase while maintaining the core principles of separation of concerns.

## Current Issues

1. **Ambiguous naming**: Files like `sauce-related-products-section.tsx` contain components for multiple different pages
2. **Single Responsibility Principle violation**: Components handle multiple concerns across different scopes
3. **Poor discoverability**: Unclear where to find components for specific pages or features
4. **Maintenance challenges**: Changes to one component can affect multiple unrelated areas
5. **Inconsistent organization**: Mix of page-specific, feature-specific, and utility components in same directories
6. **Missing categorization**: No clear distinction between UI elements, business features, and system components

## Extended Target Architecture

```
apps/web/src/components/
├── page-sections/           # Page-specific orchestration components
│   ├── shared/              # Cross-page sections used identically across pages
│   │   └── related-recipes-section.tsx
│   ├── sauce-page/
│   │   ├── hero-section.tsx              # ✅ SauceHeroSection (migrated)
│   │   ├── nutritional-info-section.tsx  # 📦 SauceNutritionalInfoSection (to migrate)
│   │   └── related-products-section.tsx  # ✅ SauceRelatedProductsSection (migrated)
│   ├── recipe-page/
│   │   ├── hero-section.tsx              # ✅ RecipeHeroSection (migrated)
│   │   ├── details-section.tsx           # ✅ RecipeDetailsSection (migrated)
│   │   ├── recipe-details/               # ✅ Utilities (migrated)
│   │   └── related-sauces-section.tsx    # ✅ RecipeRelatedSaucesSection (migrated)
│   └── product-page/        # Future: if individual product pages are added
│       └── ...
├── elements/                # Page-agnostic UI components
│   ├── a11y/                # Accessibility utilities (to migrate)
│   ├── filterable/          # Filter/search components (to migrate)
│   ├── sanity-buttons.tsx   # ✅ (migrated)
│   ├── sanity-image.tsx     # ✅ (migrated)
│   └── ...
├── features/                # Feature-specific component groups (NEW)
│   ├── cart/                # Shopping cart functionality (to migrate)
│   ├── header/              # Site header components (to migrate)
│   ├── footer/              # Site footer (to migrate)
│   └── navigation/          # Navigation components (to migrate)
├── systems/                 # Complex systems and tools (NEW)
│   ├── pagebuilder/         # CMS page builder system (to migrate)
│   ├── preview/             # Preview/debug tools (to migrate)
│   └── dev/                 # Development utilities (to migrate)
├── layouts/                 # Reusable presentation components
│   ├── hero-layout.tsx      # ✅ Generic hero presentation (migrated)
│   ├── details-layout.tsx   # 📦 Generic details presentation (to add)
│   ├── related-items-layout.tsx # ✅ Generic related items (migrated)
│   └── ...
└── [standalone files]       # Simple standalone components
    ├── blog-card.tsx        # Reusable card component
    ├── image-link-card.tsx  # Reusable card component
    └── [other simple components]

# Sanity Integration (unchanged)
apps/web/src/lib/sanity/
├── query.ts                 # All GROQ queries using defineQuery from next-sanity
├── sanity.types.ts          # Generated TypeScript types from Sanity TypeGen
└── live.ts                  # Live preview configuration
```

## Migration Strategy

### Phase 1: Core Infrastructure (✅ COMPLETED)

1. ✅ **Create foundational directory structure**
2. ✅ **Extract shared layouts** from existing components
3. ✅ **Migrate core page sections** (hero, details, related items)
4. ✅ **Establish patterns** for page-specific vs shared components

### Phase 2: Complete Page Sections (In Progress)

1. 📦 **Migrate remaining page-specific components**
2. 📦 **Create shared sections** for cross-page functionality
3. 📦 **Add missing layout components** (details-layout.tsx)

### Phase 3: Organize Feature Components (To Start)

1. 📦 **Migrate accessibility components** to `elements/a11y/`
2. 📦 **Migrate filter components** to `elements/filterable/`
3. 📦 **Migrate feature groups** to `features/` (cart, header, footer, navigation)
4. 📦 **Migrate system components** to `systems/` (pagebuilder, preview, dev)

### Phase 4: Cleanup and Verification (To Complete)

1. 📦 **Remove old component files** and directories
2. 📦 **Update all import statements** across the codebase
3. 📦 **Final testing and verification**

## Detailed Migration Steps

### Phase 2: Complete Page Sections

**Step 1: Create Shared Sections Directory**

```bash
mkdir -p apps/web/src/components/page-sections/shared
```

**Step 2: Migrate Cross-Page Components**

- Move `recipes/related-recipes-section.tsx` → `page-sections/shared/related-recipes-section.tsx`
- Move `sauces/sauce-nutritional-info-section.tsx` → `page-sections/sauce-page/nutritional-info-section.tsx`

**Step 3: Add Missing Layout**

- Create `layouts/details-layout.tsx` for generic details presentation

### Phase 3: Organize Feature Components

**Step 4: Create Feature Structure**

```bash
mkdir -p apps/web/src/components/features/cart
mkdir -p apps/web/src/components/features/header
mkdir -p apps/web/src/components/features/footer
mkdir -p apps/web/src/components/features/navigation
```

**Step 5: Migrate Feature Components**

- Move `cart/` → `features/cart/`
- Move `header/` → `features/header/`
- Move `footer.tsx` → `features/footer/footer.tsx`
- Move `navbar.tsx`, `navbar-client.tsx` → `features/navigation/`

**Step 6: Create Systems Structure**

```bash
mkdir -p apps/web/src/components/systems/pagebuilder
mkdir -p apps/web/src/components/systems/preview
mkdir -p apps/web/src/components/systems/dev
```

**Step 7: Migrate System Components**

- Move `pagebuilder/` → `systems/pagebuilder/`
- Move `preview-bar.tsx` → `systems/preview/preview-bar.tsx`
- Move `dev/` → `systems/dev/`

**Step 8: Enhance Elements Structure**

```bash
mkdir -p apps/web/src/components/elements/a11y
mkdir -p apps/web/src/components/elements/filterable
```

**Step 9: Migrate UI Components**

- Move `a11y/` → `elements/a11y/`
- Move `filterable/` → `elements/filterable/`

### Phase 4: Cleanup and Verification

**Step 10: Update Import Statements**

- Update all files that reference moved components
- Ensure all import paths are correct
- Verify no broken imports remain

**Step 11: Remove Old Directories**

- Remove `recipes/` and `sauces/` directories (after confirming empty)
- Remove other old directories that are now empty

**Step 12: Final Verification**

- Run linting, type checking, and kluster verification
- Test build process
- Verify all pages still work correctly

## Component Organization Guidelines

### **Page Sections** (`page-sections/`)

- **Scope**: Components that orchestrate data fetching and layout for specific pages
- **Examples**: Hero sections, detail sections, related content sections
- **Pattern**: `PageNameSection` (e.g., `RecipeHeroSection`, `SauceDetailsSection`)

### **Elements** (`elements/`)

- **Scope**: Reusable UI components that work across any page
- **Examples**: Buttons, images, form inputs, accessibility utilities
- **Pattern**: `ComponentName` (e.g., `SanityImage`, `FilterDropdown`)

### **Features** (`features/`)

- **Scope**: Complete features that group related functionality
- **Examples**: Shopping cart, site header, navigation, footer
- **Pattern**: Feature-based grouping (e.g., `cart/`, `header/`)

### **Systems** (`systems/`)

- **Scope**: Complex systems and tools that operate across the application
- **Examples**: CMS page builder, preview tools, development utilities
- **Pattern**: System-based grouping (e.g., `pagebuilder/`, `preview/`)

### **Layouts** (`layouts/`)

- **Scope**: Reusable presentation patterns and structural components
- **Examples**: Hero layouts, grid layouts, section layouts
- **Pattern**: `LayoutName` (e.g., `HeroLayout`, `GridLayout`)

### **Standalone Files**

- **Scope**: Simple, self-contained components that don't fit other categories
- **Examples**: Individual cards, utilities, simple UI components

## Migration Verification Checklist

### For Each Migrated Component:

- [ ] Component renders correctly on target page
- [ ] All props are properly typed using appropriate types
- [ ] Import statements updated across codebase
- [ ] No breaking changes to public API
- [ ] Layout behavior matches original implementation
- [ ] Uses correct patterns for its category (page-section, element, feature, etc.)

### For Each New Directory Structure:

- [ ] Follows established naming conventions
- [ ] Components are logically grouped by function
- [ ] No circular dependencies created
- [ ] Clear separation of concerns maintained

### For Overall Migration:

- [ ] All pages load without errors
- [ ] No console warnings or errors
- [ ] Build completes successfully
- [ ] Type checking passes
- [ ] All existing functionality preserved
- [ ] New structure is scalable for future development

## Benefits After Migration

1. **Complete Organization**: Every component has a logical, discoverable home
2. **Clear Separation of Concerns**: Page logic, UI elements, features, and systems are clearly separated
3. **Better Reusability**: Shared components are easily identifiable and accessible
4. **Easier Maintenance**: Changes to specific functionality are contained within appropriate boundaries
5. **Improved Developer Experience**: New developers can quickly understand component organization
6. **Enhanced Scalability**: New features and pages can be added following established patterns
7. **Reduced Coupling**: Components are organized to minimize unintended dependencies

## Timeline Estimate

- **Phase 1 (Core Infrastructure)**: ✅ 2-3 hours (completed)
- **Phase 2 (Complete Page Sections)**: 📦 1-2 hours
- **Phase 3 (Organize Feature Components)**: 📦 2-3 hours
- **Phase 4 (Cleanup and Verification)**: 📦 1-2 hours
- **Total**: 6-10 hours for complete migration

This comprehensive migration will establish a robust, scalable architecture that handles the full scope of the application while maintaining all existing functionality and improving long-term maintainability.
