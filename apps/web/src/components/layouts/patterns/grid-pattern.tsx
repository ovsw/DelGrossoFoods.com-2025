import { cn } from "@workspace/ui/lib/utils";

interface GridPatternProps {
  patternX: string;
  svgX: string;
  patternStroke: string;
  patternFill: string;
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
}: GridPatternProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "absolute inset-0 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)]",
        patternStroke,
      )}
    >
      <defs>
        <pattern
          x={patternX}
          y={-1}
          id="decorated-split-pattern-grid"
          width={200}
          height={200}
          patternUnits="userSpaceOnUse"
        >
          <path d="M130 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        className="fill-background"
      />
      <svg x={svgX} y={-1} className={cn("overflow-visible", patternFill)}>
        <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
      </svg>
      <rect
        fill="url(#decorated-split-pattern-grid)"
        width="100%"
        height="100%"
        strokeWidth={0}
      />
    </svg>
  );
}
