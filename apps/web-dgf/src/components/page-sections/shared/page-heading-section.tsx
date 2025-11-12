import { SectionShell } from "@workspace/ui/components/section-shell";
import { cn } from "@workspace/ui/lib/utils";
import { createDataAttribute, stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import { dataset, projectId, studioUrl } from "@/config";
import type { SanityImageProps as SanityImageData } from "@/types";

interface PageHeadingSectionProps {
  readonly eyebrow?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly backgroundImage?: SanityImageData | null;
  readonly sanityDocumentId?: string | null;
  readonly sanityDocumentType?: string | null;
  readonly sanityFieldPrefix?: string | null;
  readonly justification?: "start" | "center";
}

export function PageHeadingSection({
  eyebrow,
  title,
  description,
  backgroundImage,
  sanityDocumentId,
  sanityDocumentType,
  sanityFieldPrefix,
  justification = "start",
}: PageHeadingSectionProps) {
  const heroTitle = title ?? "";
  const heroDescription = description ?? "";
  const heroEyebrow = eyebrow ?? null;
  const heroBackgroundImage = backgroundImage ?? null;
  const backgroundAlt =
    heroBackgroundImage && "alt" in heroBackgroundImage
      ? heroBackgroundImage.alt
      : null;
  const cleanedBackgroundAlt =
    typeof backgroundAlt === "string" && backgroundAlt.length > 0
      ? stegaClean(backgroundAlt)
      : "";

  const createFieldAttribute = (fieldPath: string) =>
    sanityDocumentId && sanityDocumentType
      ? createDataAttribute({
          id: sanityDocumentId,
          type: sanityDocumentType,
          path:
            typeof sanityFieldPrefix === "string" &&
            sanityFieldPrefix.length > 0
              ? `${sanityFieldPrefix}.${fieldPath}`
              : fieldPath,
          baseUrl: studioUrl,
          projectId,
          dataset,
        }).toString()
      : null;

  const eyebrowAttribute = createFieldAttribute("eyebrow");
  const titleAttribute = createFieldAttribute("title");
  const descriptionAttribute = createFieldAttribute("description");
  const backgroundImageField =
    typeof sanityFieldPrefix === "string" && sanityFieldPrefix.length > 0
      ? "backgroundImage"
      : "pageHeaderImage";
  const backgroundImageAttribute = createFieldAttribute(backgroundImageField);

  if (!heroTitle && !heroDescription && !heroEyebrow) {
    return null;
  }

  return (
    <SectionShell
      spacingTop="page-top"
      spacingBottom="default"
      background="brand"
      className="overflow-hidden isolate"
      innerClassName="max-w-7xl pb-14 pt-6 lg:px-8"
      allowOverflow={false}
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {heroBackgroundImage ? (
          <>
            <SanityImage
              image={heroBackgroundImage}
              alt={cleanedBackgroundAlt}
              loading="eager"
              width={600}
              className="size-full object-cover opacity-50"
              decoding="async"
              fetchPriority="high"
              sizes="100vw"
              data-sanity={backgroundImageAttribute ?? undefined}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/80 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-brand-green" />
        )}
      </div>
      {/*
      <div
        aria-hidden="true"
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:block sm:mr-10 sm:transform-gpu sm:blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-th-light-200 to-white opacity-25"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-[28rem] sm:ml-16 sm:translate-x-0"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-th-light-200 to-white opacity-25"
        />
      </div> */}

      <div
        className={cn(
          "relative z-10 mx-auto max-w-2xl",
          justification === "center"
            ? "text-center lg:mx-auto"
            : "text-start lg:mx-0",
        )}
      >
        {heroEyebrow ? (
          <p
            className="text-sm font-semibold uppercase tracking-[0.2em] text-th-light-100/80"
            data-sanity={eyebrowAttribute ?? undefined}
          >
            {heroEyebrow}
          </p>
        ) : null}
        {heroTitle ? (
          <h1
            className="mt-4 text-5xl font-semibold tracking-tight text-th-light-100 sm:text-7xl"
            data-sanity={titleAttribute ?? undefined}
          >
            {heroTitle}
          </h1>
        ) : null}
        {heroDescription ? (
          <p
            className="mt-8 text-lg font-medium text-pretty text-th-light-100/80 sm:text-xl sm:leading-8"
            data-sanity={descriptionAttribute ?? undefined}
          >
            {heroDescription}
          </p>
        ) : null}
      </div>
    </SectionShell>
  );
}
