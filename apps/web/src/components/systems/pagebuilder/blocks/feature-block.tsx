import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { createDataAttribute, stegaClean } from "next-sanity";

import { RichText } from "@/components/elements/rich-text";
import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";
import { SurfaceShineOverlay } from "@/components/elements/surface-shine-overlay";
import { dataset, projectId, studioUrl } from "@/config";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

export type FeatureBlockProps = PageBuilderBlockProps<"feature"> & {
  sanityDocumentId?: string;
  sanityDocumentType?: string;
};

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function FeatureBlock({
  _key,
  badge,
  title,
  richText,
  image,
  imageFit,
  buttons,
  spacing,
  isPageTop = false,
  sanityDocumentId,
  sanityDocumentType,
}: FeatureBlockProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const cleanedImageFit = stegaClean(imageFit ?? "cover") as "cover" | "fit";
  const isImageFit = cleanedImageFit === "fit";
  const imageObjectFitClass = isImageFit ? "object-contain" : "object-cover";

  // Create data attribute for click-to-edit functionality
  // The path needs to include the block key since this is within a page builder
  const imageDataAttribute =
    sanityDocumentId && sanityDocumentType && _key
      ? createDataAttribute({
          id: sanityDocumentId,
          type: sanityDocumentType,
          path: `pageBuilder[_key=="${_key}"].image`,
          baseUrl: studioUrl,
          projectId,
          dataset,
        }).toString()
      : undefined;

  const imageFrameClass = cn(
    "relative aspect-[4/3] ",
    isImageFit
      ? null
      : "rounded-2xl shadow-2xl ring-1 ring-brand-green-text/20",
  );

  return (
    <Section
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      {/* Decorative background elements */}
      {/* <div className="absolute inset-0 -z-10 overflow-hidden">
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
      </div> */}

      <div className="relative isolate overflow-hidden  rounded-none bg-brand-green px-6 py-20 min-[1440px]:-mx-8 min-[1440px]:rounded-2xl min-[1536px]:-mx-12 sm:px-10 sm:py-24 lg:py-24 lg:max-[1439px]:mx-[calc(50%-50vw)] xl:rounded-3xl xl:px-24">
        <SurfaceShineOverlay className="rounded-b-2xl xl:rounded-3xl" />

        <div className="2xl:max-w-8xl container mx-auto px-4 md:px-8 lg:max-w-7xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
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
                  <SanityButtons buttons={buttons} surface="onDark" />
                </div>
              )}
            </div>
            {/* Right side image */}
            <div className="lg:pl-8 max-h-120 lg:aspect-[4/3]">
              <div className={imageFrameClass}>
                {image && (
                  <>
                    <SanityImage
                      image={image}
                      width={400}
                      height={400}
                      alt={stegaClean(typeof title === "string" ? title : "")}
                      className={cn(
                        "w-full rounded-3xl h-full max-h-120 lg:max-h-120 z-10 lg:-translate-y-[50%] lg:relative lg:top-[50%] ",
                        // "size-[180%] max-w-none rounded-3xl z-10 lg:-translate-y-[50%] lg:relative lg:top-[50%] lg:left-[50%] lg:transform lg:-translate-x-[50%]",
                        imageObjectFitClass,
                      )}
                      data-sanity={imageDataAttribute}
                    />
                    {!isImageFit ? (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-green-text/10 to-transparent z-[-1]"></div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
