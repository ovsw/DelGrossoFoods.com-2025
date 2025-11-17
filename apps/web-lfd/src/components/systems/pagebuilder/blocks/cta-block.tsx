import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { SanityButtons } from "@workspace/ui/components/sanity-buttons";
import { Section } from "@workspace/ui/components/section";
import { SurfaceShineOverlay } from "@workspace/ui/components/surface-shine-overlay";
import { cn } from "@workspace/ui/lib/utils";
import { stegaClean } from "next-sanity";

import { RichText } from "@/components/elements/rich-text";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

export type CTABlockProps = PageBuilderBlockProps<"cta">;

const BRAND_YELLOW_SURFACE = {
  background: "bg-brand-yellow",
  isDark: false,
  contentColor: "text-brand-yellow-text",
  headingColor: "text-brand-yellow-text",
} as const;

const CTA_SURFACE_CONFIG = {
  default: BRAND_YELLOW_SURFACE,
  red: BRAND_YELLOW_SURFACE,
  green: BRAND_YELLOW_SURFACE,
  black: BRAND_YELLOW_SURFACE,
  none: {
    background: undefined,
    isDark: false,
    contentColor: undefined,
    headingColor: "text-brand-green",
  },
} satisfies Record<
  string,
  {
    background?: string;
    isDark: boolean;
    contentColor?: string;
    headingColor?: string;
  }
>;

type CTASurfaceColor = keyof typeof CTA_SURFACE_CONFIG;

const isCTASurfaceColor = (value: string): value is CTASurfaceColor =>
  Object.prototype.hasOwnProperty.call(CTA_SURFACE_CONFIG, value);

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function CTABlock({
  richText,
  title,
  eyebrow,
  buttons,
  spacing,
  isPageTop = false,
  surfaceColor = "default",
  applySurfaceShine = false,
}: CTABlockProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const rawSurfaceColor = stegaClean(surfaceColor) ?? "default";
  const colorKey: CTASurfaceColor = isCTASurfaceColor(rawSurfaceColor)
    ? rawSurfaceColor
    : "default";
  const surfaceStyle = CTA_SURFACE_CONFIG[colorKey];
  const hasSurfaceFrame = colorKey !== "none";
  const showOverlay = hasSurfaceFrame && Boolean(stegaClean(applySurfaceShine));
  const eyebrowVariant = surfaceStyle.isDark ? "onDark" : "onLight";
  const headingColor = surfaceStyle.isDark
    ? "text-th-light-100"
    : surfaceStyle.headingColor;
  const contentTextColor = surfaceStyle.contentColor;
  // Rich text renders via Typography plugin. On dark surfaces, use inverted colors
  // directly via the RichText component; on light surfaces default colors apply.
  const buttonSurface = surfaceStyle.isDark ? "onDark" : undefined;

  return (
    <Section
      id="cta"
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div
          className={cn(
            "relative",
            surfaceStyle.background,
            hasSurfaceFrame ? "rounded-3xl px-4 py-16" : undefined,
          )}
        >
          {showOverlay ? <SurfaceShineOverlay /> : null}
          <div
            className={cn(
              "text-center max-w-3xl mx-auto space-y-8",
              contentTextColor,
            )}
          >
            {eyebrow && <Eyebrow text={eyebrow} variant={eyebrowVariant} />}
            <h2
              className={cn(
                "text-3xl font-semibold md:text-5xl text-balance",
                headingColor,
              )}
            >
              {title}
            </h2>
            <RichText
              richText={richText}
              invert={surfaceStyle.isDark}
              className={cn("prose-lg text-balance", contentTextColor)}
            />
            <div className="flex justify-center">
              <SanityButtons
                buttons={buttons}
                surface={buttonSurface}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-2 sm:grid-flow-col lg:justify-start"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
