import { cn } from "@workspace/ui/lib/utils";
import { useId } from "react";

interface AutumnPatternProps {
  patternX: string;
  svgX: string;
  patternStroke: string;
  patternFill: string;
  maskClass: string;
  opacity: string;
}

/**
 * Autumn pattern with leaf and branch motifs
 * Creates an organic, nature-inspired background with autumnal elements
 */
export function AutumnPattern({
  patternX,
  svgX,
  patternStroke,
  patternFill,
  maskClass,
  opacity,
}: AutumnPatternProps) {
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
          width={88}
          height={24}
          patternUnits="userSpaceOnUse"
        >
          <g fillRule="evenodd">
            <g fill="currentColor">
              <path d="M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z" />
            </g>
          </g>
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
