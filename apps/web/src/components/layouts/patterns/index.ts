import { type ComponentType } from "react";

import type { AutumnPatternProps } from "./autumn-pattern";
// Import components for registry (these will be lazy loaded by PatternFactory)
import { AutumnPattern } from "./autumn-pattern";
import type { GridPatternProps } from "./grid-pattern";
import { GridPattern } from "./grid-pattern";
import type { ItalianIngredientsPatternProps } from "./italian-ingredients-pattern";
import { ItalianIngredientsPattern } from "./italian-ingredients-pattern";

/**
 * SVG Pattern Library for DecoratedSplitLayout
 *
 * Patterns are lazy-loaded for optimal bundle splitting:
 * - Only the used pattern is loaded at runtime
 * - Reduces initial bundle size
 * - Patterns are code-split into separate chunks
 *
 * Pattern Types:
 * 1. Repeating Patterns - Use SVG <pattern> element to tile
 * 2. Illustration Patterns - Single large background images
 */

// Lazy load pattern components with proper default export handling
// Note: These are loaded dynamically by PatternFactory component
// Direct exports are available for non-lazy usage if needed
export { AutumnPattern } from "./autumn-pattern";
export { GridPattern } from "./grid-pattern";
export { ItalianIngredientsPattern } from "./italian-ingredients-pattern";

// Pattern component type mapping
type PatternComponents = {
  autumn: ComponentType<AutumnPatternProps>;
  grid: ComponentType<GridPatternProps>;
  "italian-ingredients": ComponentType<ItalianIngredientsPatternProps>;
};

// Pattern registry for type-safe access - direct component references
// Note: Lazy loading is handled by PatternFactory component to avoid SSR issues
export const PATTERN_COMPONENTS: PatternComponents = {
  autumn: AutumnPattern,
  grid: GridPattern,
  "italian-ingredients": ItalianIngredientsPattern,
} as const;

// Pattern variant type for type safety
export type PatternVariant = keyof PatternComponents;

// Props type that works with all pattern variants
export type PatternProps<T extends PatternVariant> = T extends "autumn"
  ? AutumnPatternProps
  : T extends "grid"
    ? GridPatternProps
    : T extends "italian-ingredients"
      ? ItalianIngredientsPatternProps
      : never;

// Note: PatternFactory component is available in './pattern-factory' for lazy loading patterns

// Add more patterns here as they're created:
// const DotsPattern = lazy(() =>
//   import("./dots-pattern").then(module => ({ default: module.DotsPattern }))
// );
// const DiagonalPattern = lazy(() =>
//   import("./diagonal-pattern").then(module => ({ default: module.DiagonalPattern }))
// );
// const WavesPattern = lazy(() =>
//   import("./waves-pattern").then(module => ({ default: module.WavesPattern }))
// );
