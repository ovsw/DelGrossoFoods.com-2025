import { cn } from "@workspace/ui/lib/utils";
import {
  Children,
  type ComponentType,
  isValidElement,
  type ReactNode,
} from "react";

import { PatternFactory } from "./patterns/pattern-factory";

type BackgroundVariant = "grid" | "italian-ingredients" | "autumn";

interface VariantConfig {
  baseColor: string;
  patternStroke: string;
  patternFill: string;
  gradientFrom: string;
  gradientTo: string;
  opacity: string;
}

const BACKGROUND_VARIANTS: Record<BackgroundVariant, VariantConfig> = {
  grid: {
    baseColor: "bg-th-red-500/30",
    patternStroke: "stroke-th-red-500/90",
    patternFill: "fill-muted/20",
    gradientFrom: "from-brand-green/10",
    gradientTo: "to-brand-green/5",
    opacity: "opacity-90",
  },
  "italian-ingredients": {
    baseColor: "bg-th-brown-400/40",
    patternStroke: "stroke-brand-red/20",
    patternFill: "fill-brand-red/90",
    gradientFrom: "from-th-light-100/40",
    gradientTo: "to-th-light-200/40",
    opacity: "opacity-10",
  },
  autumn: {
    baseColor: "bg-[#525b45]/25",
    patternStroke: "stroke-[#525b45]/80",
    patternFill: "fill-[#525b45]/60",
    gradientFrom: "from-[#525b45]/15",
    gradientTo: "to-[#525b45]/8",
    opacity: "opacity-10",
  },
} as const;

interface DecoratedSplitLayoutProps {
  decoratedColumn: "main" | "secondary";
  mainPosition: "left" | "right";
  variant?: BackgroundVariant;
  showDecoration?: boolean;
  children: ReactNode;
}

interface SlotProps {
  children: ReactNode;
}

// Helper to find slot children by component type
function findSlot(
  children: ReactNode,
  component: ComponentType<SlotProps>,
): ReactNode {
  const child = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === component,
  );
  return isValidElement<SlotProps>(child) ? child.props.children : null;
}

// Slot marker components
const Main = ({ children }: SlotProps) => <>{children}</>;
Main.displayName = "DecoratedSplitLayout.Main";

const Secondary = ({ children }: SlotProps) => <>{children}</>;
Secondary.displayName = "DecoratedSplitLayout.Secondary";

function DecoratedSplitLayoutRoot({
  decoratedColumn,
  mainPosition,
  variant = "grid",
  showDecoration = true,
  children,
}: DecoratedSplitLayoutProps) {
  // Extract slot content from children
  const mainContent = findSlot(children, Main);
  const secondaryContent = findSlot(children, Secondary);

  // Validate that both slots are present
  if (!mainContent) {
    throw new Error(
      "DecoratedSplitLayout requires a <DecoratedSplitLayout.Main> child",
    );
  }
  if (!secondaryContent) {
    throw new Error(
      "DecoratedSplitLayout requires a <DecoratedSplitLayout.Secondary> child",
    );
  }

  // Get variant configuration
  const {
    baseColor,
    patternStroke,
    patternFill,
    gradientFrom,
    gradientTo,
    opacity,
  } = BACKGROUND_VARIANTS[variant];

  // Determine which physical side (left/right) is decorated
  const isMainDecorated = decoratedColumn === "main";
  const isMainLeft = mainPosition === "left";
  const isLeftDecorated = isMainDecorated ? isMainLeft : !isMainLeft;

  // Calculate mask class based on decoration position
  // Logic: (main decorated + main left) OR (secondary decorated + main right) → top_right
  // Otherwise → top_left
  const maskClass = isLeftDecorated
    ? "mask-[radial-gradient(100%_100%_at_top_right,white,transparent)]"
    : "mask-[radial-gradient(100%_100%_at_top_left,white,transparent)]";

  // Background positioning and rounding (rounds towards center)
  const backgroundClasses = cn(
    "absolute inset-y-0 -z-10 w-full overflow-hidden lg:w-1/2",
    baseColor,
    isLeftDecorated
      ? "left-0 lg:rounded-tr-2xl lg:rounded-br-2xl" // Left decorated → round right (towards center)
      : "right-0 lg:rounded-tl-2xl lg:rounded-bl-2xl", // Right decorated → round left (towards center)
  );

  // SVG pattern positioning
  const patternX = isLeftDecorated ? "100%" : "0%";
  const svgX = isLeftDecorated ? "100%" : "0%";

  // Gradient positioning
  const gradientClasses = cn(
    "blob_overlay absolute top-[calc(100%-13rem)] transform-gpu blur-3xl lg:top-[calc(50%-7rem)]",
    isLeftDecorated
      ? "-left-56 lg:left-[max(-14rem,calc(100%-59rem))]"
      : "-right-56 lg:right-[max(-14rem,calc(100%-59rem))]",
  );

  // Decorative background element (rendered inside decorated column)
  const decorativeBackgroundElement = showDecoration ? (
    <div className={backgroundClasses}>
      <PatternFactory
        variant={variant}
        patternX={patternX}
        patternStroke={patternStroke}
        maskClass={maskClass}
        opacity={opacity}
        {...(variant === "autumn" || variant === "grid"
          ? {
              svgX,
              patternFill,
            }
          : {})}
      />
      <div aria-hidden="true" className={gradientClasses}>
        <div
          style={{
            clipPath:
              "polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)",
          }}
          className={cn(
            "aspect-[1155/678] w-[288.75px] bg-gradient-to-br opacity-20",
            gradientFrom,
            gradientTo,
          )}
        />
      </div>
    </div>
  ) : null;

  return (
    <div className="relative isolate">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Main Column - always first in DOM for mobile stacking */}
        <div
          className={cn(
            "px-6 pt-24 pb-20 sm:pt-32 lg:px-8 lg:py-48",
            // Only apply relative positioning if this column is decorated (for mobile containment)
            isMainDecorated ? "relative lg:static" : "",
            // Desktop order based on mainPosition
            isMainLeft ? "lg:order-1" : "lg:order-2",
          )}
        >
          <div
            className={cn(
              "mx-auto max-w-xl lg:mx-0 lg:max-w-lg",
              // Desktop alignment based on mainPosition
              isMainLeft ? "lg:ml-0" : "lg:mr-0 lg:ml-auto",
            )}
          >
            {/* Render decoration if main is decorated */}
            {isMainDecorated && decorativeBackgroundElement}
            {mainContent}
          </div>
        </div>

        {/* Secondary Column */}
        <div
          className={cn(
            "px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48",
            // Only apply relative positioning if this column is decorated (for mobile containment)
            !isMainDecorated ? "relative lg:static" : "",
            // Desktop order opposite of main
            isMainLeft ? "lg:order-2" : "lg:order-1",
          )}
        >
          <div
            className={cn(
              "mx-auto max-w-xl lg:max-w-lg",
              // Desktop alignment opposite of main
              isMainLeft ? "lg:mr-0 lg:ml-auto" : "lg:ml-0",
            )}
          >
            {/* Render decoration if secondary is decorated */}
            {!isMainDecorated && decorativeBackgroundElement}
            {secondaryContent}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compose and export as compound component
export const DecoratedSplitLayout = Object.assign(DecoratedSplitLayoutRoot, {
  Main,
  Secondary,
});
