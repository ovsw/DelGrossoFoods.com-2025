import { cn } from "@workspace/ui/lib/utils";
import { useId } from "react";

interface GridPatternProps {
  patternX: string;
  svgX: string;
  patternStroke: string;
  patternFill: string;
  maskClass: string;
  opacity: string;
}

/**
 * Grid pattern with intersecting lines
 * Creates a technical, structured background
 */
export function GridPattern({
  patternX,
  svgX,
  patternStroke,
  patternFill,
  maskClass,
  opacity,
}: GridPatternProps) {
  const idBase = useId();
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "absolute inset-0 size-full",
        maskClass,
        patternStroke,
        opacity,
      )}
    >
      <defs>
        <pattern
          x={patternX}
          y={-1}
          id={`${idBase}-pattern`}
          width={200}
          height={200}
          patternUnits="userSpaceOnUse"
        >
          <path d="M130 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <svg x={svgX} y={-1} className={cn("overflow-visible", patternFill)}>
        <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
      </svg>
      <rect
        fill={`url(#${idBase}-pattern)`}
        width="100%"
        height="100%"
        strokeWidth={0}
      />
    </svg>
  );
}
