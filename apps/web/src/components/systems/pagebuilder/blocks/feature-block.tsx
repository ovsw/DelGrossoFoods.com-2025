import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { stegaClean } from "next-sanity";

import { RichText } from "@/components/elements/rich-text";
import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

export type FeatureBlockProps = PageBuilderBlockProps<"feature">;

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function FeatureBlock({
  badge,
  title,
  richText,
  image,
  imageFit,
  buttons,
  spacing,
  isPageTop = false,
}: FeatureBlockProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const cleanedImageFit = stegaClean(imageFit ?? "cover") as "cover" | "fit";
  const isImageFit = cleanedImageFit === "fit";
  const imageObjectFitClass = isImageFit ? "object-contain" : "object-cover";
  const imageFrameClass = cn(
    "relative aspect-[4/3] overflow-hidden",
    isImageFit
      ? null
      : "rounded-2xl shadow-2xl ring-1 ring-brand-green-text/20",
  );

  return (
    <Section
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
      className="bg-brand-green relative overflow-hidden rounded-none min-[1440px]:rounded-2xl lg:max-[1439px]:mx-[calc(50%-50vw)] min-[1440px]:-mx-8 min-[1536px]:-mx-12"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-green-text/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
        <svg
          className="absolute inset-0 h-full w-full stroke-gray-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="feature-pattern"
              width="200"
              height="200"
              x="50%"
              y="50%"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#feature-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:max-w-7xl 2xl:max-w-8xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left side content */}
          <div className="space-y-8 lg:pr-8">
            {badge && (
              <Eyebrow text={badge} className="text-brand-green-text" />
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-brand-green-text md:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {richText && (
              <div className="prose prose-invert max-w-none text-brand-green-text/90">
                <RichText richText={richText} />
              </div>
            )}

            {buttons && (
              <div className="flex flex-wrap gap-4 pt-4">
                <SanityButtons
                  buttons={buttons}
                  buttonClassName="bg-white text-brand-green hover:bg-white/90"
                />
              </div>
            )}
          </div>

          {/* Right side image */}
          {image && (
            <div className="relative lg:pl-8">
              <div className={imageFrameClass}>
                <SanityImage
                  image={image}
                  className={cn("h-full w-full", imageObjectFitClass)}
                />
                {/* Decorative gradient overlay */}
                {!isImageFit ? (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-green-text/10 to-transparent"></div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
