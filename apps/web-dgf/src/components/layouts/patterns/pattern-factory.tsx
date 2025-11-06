import { type ReactElement, type ReactNode, Suspense } from "react";

import type { AutumnPatternProps } from "./autumn-pattern";
import type { GridPatternProps } from "./grid-pattern";
import {
  PATTERN_COMPONENTS,
  type PatternProps,
  type PatternVariant,
} from "./index";
import type { ItalianIngredientsPatternProps } from "./italian-ingredients-pattern";

/**
 * Pattern factory component for conditional rendering with lazy loading
 *
 * This component handles the dynamic loading and rendering of SVG patterns
 * based on the variant prop, providing proper TypeScript support and Suspense boundaries.
 *
 * @example
 * ```tsx
 * import { PatternFactory } from './patterns/pattern-factory';
 *
 * function MyComponent() {
 *   return (
 *     <PatternFactory
 *       variant="grid"
 *       patternX="0%"
 *       svgX="0%"
 *       patternStroke="stroke-gray-500"
 *       patternFill="fill-gray-200"
 *       maskClass="mask-class"
 *       opacity="opacity-50"
 *     />
 *   );
 * }
 * ```
 */
// Accept any variant that extends the pattern variant union
export function PatternFactory<Variant extends PatternVariant>(
  props: {
    variant: Variant;
    fallback?: ReactNode;
  } & PatternProps<Variant>,
): ReactElement {
  const { variant, fallback = null } = props;

  // Use explicit type checking and casting based on the variant
  if (variant === "autumn") {
    const autumnProps = props as AutumnPatternProps & { fallback?: ReactNode };
    return (
      <Suspense fallback={fallback}>
        <PATTERN_COMPONENTS.autumn {...autumnProps} />
      </Suspense>
    );
  }

  if (variant === "grid") {
    const gridProps = props as GridPatternProps & { fallback?: ReactNode };
    return (
      <Suspense fallback={fallback}>
        <PATTERN_COMPONENTS.grid {...gridProps} />
      </Suspense>
    );
  }

  // italian-ingredients
  const italianProps = props as ItalianIngredientsPatternProps & {
    fallback?: ReactNode;
  };
  const ItalianIngredientsComponent = PATTERN_COMPONENTS["italian-ingredients"];
  return (
    <Suspense fallback={fallback}>
      <ItalianIngredientsComponent {...italianProps} />
    </Suspense>
  );
}
