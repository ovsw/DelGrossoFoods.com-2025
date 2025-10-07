import { type ReactElement, type ReactNode, Suspense } from "react";

import { PATTERN_COMPONENTS, type PatternVariant } from "./index";

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
interface PatternFactoryProps {
  variant: PatternVariant;
  fallback?: ReactNode;
  patternX: string;
  patternStroke: string;
  maskClass: string;
  opacity: string;
  svgX?: string;
  patternFill?: string;
  [key: string]: any; // Allow additional props for extensibility
}

export function PatternFactory({
  variant,
  fallback = null,
  ...patternProps
}: PatternFactoryProps): ReactElement {
  const PatternComponent = PATTERN_COMPONENTS[variant];

  return (
    <Suspense fallback={fallback}>
      <PatternComponent {...(patternProps as any)} />
    </Suspense>
  );
}
