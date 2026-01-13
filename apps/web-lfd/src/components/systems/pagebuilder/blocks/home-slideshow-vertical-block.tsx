"use client";

import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { SanityButtons } from "@workspace/ui/components/sanity-buttons";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import {
  createDataAttribute,
  PortableText,
  type PortableTextBlock,
  type PortableTextReactComponents,
  stegaClean,
} from "next-sanity";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { buildSrc } from "sanity-image";

import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { dataset, projectId, studioUrl } from "@/config";
import type {
  SanityButtonProps,
  SanityImageProps,
  SanityRichTextProps,
} from "@/types";

import type { PageBuilderBlockProps } from "../types";

const SCROLL_DURATION_SECONDS = 45;
const IMAGE_WIDTH = 540;
const IMAGE_HEIGHT = 960;
const SANITY_BASE_URL =
  `https://cdn.sanity.io/images/${projectId}/${dataset}/` as const;

const renderHeadingBlock = ({ children }: { children?: ReactNode }) => (
  <span>{children}</span>
);

const UnderlineBoldMark = ({ children }: { children?: ReactNode }) => (
  <span className="relative inline-flex pb-1">
    <span className="relative z-10">{children}</span>
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[0.6rem] w-full"
      viewBox="0 0 35 3"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
      style={{
        transform: "scaleY(1.3)",
        transformOrigin: "bottom",
        bottom: "-0.25rem",
      }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.1766 0.0143388C18.8596 0.0455316 16.8659 0.12294 14.0298 0.291818C13.5191 0.322234 12.8286 0.362973 12.4955 0.382399C11.63 0.432833 9.42754 0.601489 8.35682 0.699322C6.24759 0.892066 3.23968 1.21502 2.1589 1.36481C1.93683 1.39559 1.60977 1.43759 1.43211 1.45816C0.807634 1.53046 0.248206 1.63411 0.14371 1.69686C-0.0587016 1.81841 -0.0485671 2.0408 0.182189 2.54121C0.351572 2.9085 0.488007 3.0269 0.705318 2.99505C0.77194 2.98528 1.18985 2.91749 1.634 2.84441C2.92926 2.63128 4.80022 2.40516 6.0755 2.30762C12.3685 1.82637 15.7104 1.66215 20.0864 1.6192C21.3967 1.60636 22.4814 1.58867 22.497 1.57994C22.5562 1.54667 30.4958 1.56343 31.9977 1.59999C32.8638 1.62105 33.7881 1.64217 34.0516 1.64687L34.5308 1.65542L34.6621 1.52414C34.8499 1.33635 34.9705 1.01591 34.9953 0.639157C35.0185 0.287082 34.9566 0.108583 34.7919 0.0527841C34.6706 0.0116377 23.6827 -0.0193701 21.1766 0.0143388Z"
        fill="#DB2128"
      />
    </svg>
  </span>
);

const HEADING_PORTABLE_TEXT_COMPONENTS: Partial<PortableTextReactComponents> = {
  block: {
    h2: renderHeadingBlock,
    h3: renderHeadingBlock,
    h4: renderHeadingBlock,
    h5: renderHeadingBlock,
    h6: renderHeadingBlock,
    inline: renderHeadingBlock,
    normal: renderHeadingBlock,
  },
  marks: {
    strong: UnderlineBoldMark,
  },
};

type HomeSlideshowVerticalBlockProps =
  PageBuilderBlockProps<"homeSlideshowVertical">;

type ColumnImage = SanityImageProps & {
  readonly _key?: string;
};

function useColumnScrollMetrics(images: ColumnImage[]) {
  const firstCycleRef = useRef<HTMLDivElement | null>(null);
  const [cycleHeight, setCycleHeight] = useState<number>(0);

  useEffect(() => {
    const element = firstCycleRef.current;
    if (!element) {
      setCycleHeight(0);
      return;
    }

    const updateHeight = () => setCycleHeight(element.offsetHeight);

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [images]);

  return { firstCycleRef, cycleHeight };
}

interface NormalizedContent {
  readonly title: string | null;
  readonly headingRichText: SanityRichTextProps;
  readonly description: unknown;
  readonly buttons: SanityButtonProps[];
  readonly leftImages: ColumnImage[];
  readonly rightImages: ColumnImage[];
}

function normalizeImages(images: ColumnImage[] | undefined): ColumnImage[] {
  if (!images?.length) return [];
  return images
    .slice(0, 4)
    .filter((image): image is ColumnImage & { id: string } => Boolean(image.id))
    .map((image) => ({
      ...image,
    }));
}

function normalizeContent(
  block: HomeSlideshowVerticalBlockProps,
): NormalizedContent {
  return {
    title: block.title ?? null,
    headingRichText: block.headingRichText ?? null,
    description: block.description ?? null,
    buttons: block.buttons?.slice(0, 2) ?? [],
    leftImages: normalizeImages(block.leftColumnImages),
    rightImages: normalizeImages(block.rightColumnImages),
  };
}

function buildDataAttribute(
  path: string | undefined,
  sanityDocumentId?: string,
  sanityDocumentType?: string,
) {
  if (!path || !sanityDocumentId || !sanityDocumentType) {
    return undefined;
  }

  return createDataAttribute({
    id: sanityDocumentId,
    type: sanityDocumentType,
    path,
    baseUrl: studioUrl,
    projectId,
    dataset,
  }).toString();
}

function getImageDataAttribute(
  blockPath: string | undefined,
  column: "leftColumnImages" | "rightColumnImages",
  image: ColumnImage,
  index: number,
  sanityDocumentId?: string,
  sanityDocumentType?: string,
) {
  if (!blockPath) return undefined;

  const selector = image._key
    ? `${column}[_key==${JSON.stringify(image._key)}]`
    : `${column}[${index}]`;

  return buildDataAttribute(
    `${blockPath}.${selector}`,
    sanityDocumentId,
    sanityDocumentType,
  );
}

function useNearViewport() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    if (isNearViewport) return;
    const element = targetRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50% 0px 50% 0px", threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isNearViewport]);

  return {
    ref: targetRef,
    isNearViewport,
  } as const;
}

function prewarmImages(images: ColumnImage[]) {
  if (typeof window === "undefined") return;

  const seen = new Set<string>();

  images.forEach((image) => {
    if (!image.id || seen.has(image.id)) return;
    seen.add(image.id);

    const { src } =
      buildSrc({
        id: image.id,
        baseUrl: SANITY_BASE_URL,
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        hotspot: image.hotspot ?? undefined,
        crop: image.crop ?? undefined,
      }) ?? {};

    if (!src) return;

    const preloadImage = new Image();
    preloadImage.decoding = "async";
    preloadImage.src = src;
  });
}

export function HomeSlideshowVerticalBlock(
  props: HomeSlideshowVerticalBlockProps,
) {
  const { _key, sanityDocumentId, sanityDocumentType, isPageTop } = props;

  const {
    title,
    headingRichText,
    description,
    buttons,
    leftImages,
    rightImages,
  } = useMemo(() => normalizeContent(props), [props]);

  const { ref: blockRef, isNearViewport } = useNearViewport();

  const hasPrefetchedImagesRef = useRef(false);
  const leftMetrics = useColumnScrollMetrics(leftImages);
  const rightMetrics = useColumnScrollMetrics(rightImages);

  const duplicatedLeftImages = useMemo(() => [...leftImages], [leftImages]);
  const duplicatedRightImages = useMemo(() => [...rightImages], [rightImages]);

  const shouldReduceMotion = useReducedMotion();

  const blockPath =
    _key !== undefined && _key !== null
      ? `pageBuilder[_key==${JSON.stringify(_key)}]`
      : undefined;

  const columnPaths = useMemo(
    () => ({
      left: blockPath ? `${blockPath}.leftColumnImages` : undefined,
      right: blockPath ? `${blockPath}.rightColumnImages` : undefined,
    }),
    [blockPath],
  );

  const {
    headingRichText: headingRichTextDataAttribute,
    title: titleDataAttribute,
    description: descriptionDataAttribute,
  } = useMemo(() => {
    const createAttribute = (field: string) =>
      buildDataAttribute(
        blockPath ? `${blockPath}.${field}` : undefined,
        sanityDocumentId,
        sanityDocumentType,
      );

    return {
      headingRichText: createAttribute("headingRichText"),
      title: createAttribute("title"),
      description: createAttribute("description"),
    };
  }, [blockPath, sanityDocumentId, sanityDocumentType]);

  const imageDataAttributes = useMemo(() => {
    const buildCycles = (
      column: "leftColumnImages" | "rightColumnImages",
      path: string | undefined,
      images: ColumnImage[],
    ) => {
      const firstCycle = images.map((image, index) =>
        getImageDataAttribute(
          path,
          column,
          image,
          index,
          sanityDocumentId,
          sanityDocumentType,
        ),
      );

      const duplicateCycle = images.map((image, index) =>
        getImageDataAttribute(
          path,
          column,
          image,
          index + images.length,
          sanityDocumentId,
          sanityDocumentType,
        ),
      );

      return { firstCycle, duplicateCycle };
    };

    return {
      left: buildCycles("leftColumnImages", columnPaths.left, leftImages),
      right: buildCycles("rightColumnImages", columnPaths.right, rightImages),
    };
  }, [
    columnPaths.left,
    columnPaths.right,
    leftImages,
    rightImages,
    sanityDocumentId,
    sanityDocumentType,
  ]);

  const hasImages = leftImages.length > 0 && rightImages.length > 0;
  const shouldPriorityLoadImages = isPageTop || isNearViewport;

  useEffect(() => {
    if (hasPrefetchedImagesRef.current) return;
    if (!leftImages.length && !rightImages.length) return;

    prewarmImages([...leftImages, ...rightImages]);
    hasPrefetchedImagesRef.current = true;
  }, [leftImages, rightImages, shouldPriorityLoadImages]);

  const headingContent =
    Array.isArray(headingRichText) && headingRichText.length
      ? headingRichText
      : null;

  if (!headingContent || !description || !hasImages) {
    return null;
  }

  const sharedColumnMask = {
    WebkitMaskImage:
      "linear-gradient(180deg, transparent 0%, black 10%, black 90%, transparent 100%)",
    maskImage:
      "linear-gradient(180deg, transparent 0%, black 10%, black 90%, transparent 100%)",
  } as const;

  const renderColumn = (
    images: ColumnImage[],
    duplicatedImages: ColumnImage[],
    columnKey: "left" | "right",
    metrics: ReturnType<typeof useColumnScrollMetrics>,
  ) => {
    const { firstCycleRef, cycleHeight } = metrics;

    const startOffsetPx =
      columnKey === "left" ? 0 : cycleHeight > 0 ? -(cycleHeight * 0.4) : -120;
    const endOffsetPx =
      cycleHeight > 0 ? startOffsetPx - cycleHeight : startOffsetPx - 240;
    const columnAttributes =
      columnKey === "left"
        ? imageDataAttributes.left
        : imageDataAttributes.right;

    return (
      <div
        className="relative h-[26rem] w-full sm:h-[32rem] lg:h-full"
        style={sharedColumnMask}
        aria-hidden={!shouldReduceMotion ? true : undefined}
      >
        <motion.div
          className="absolute inset-0 flex flex-col gap-4"
          animate={
            shouldReduceMotion
              ? undefined
              : cycleHeight > 0
                ? { y: [startOffsetPx, endOffsetPx] }
                : { y: ["0%", "-50%"] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: SCROLL_DURATION_SECONDS,
                  ease: "linear",
                  repeat: Infinity,
                }
          }
          aria-hidden={!shouldReduceMotion ? true : undefined}
          style={
            shouldReduceMotion
              ? { transform: `translateY(${startOffsetPx}px)` }
              : undefined
          }
        >
          <div ref={firstCycleRef} className="flex flex-col gap-4">
            {images.map((image, index) => {
              const dataAttribute = columnAttributes.firstCycle[index];
              const isFirstImage = index === 0;
              const shouldEagerLoad = isFirstImage || shouldPriorityLoadImages;

              return (
                <div
                  key={`${columnKey}-${image._key ?? index}-${index}-cycle1`}
                  className="w-full"
                >
                  <SanityImage
                    image={image}
                    alt={stegaClean(
                      image.alt ?? title ?? "Home slideshow vertical image",
                    )}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    className={cn(
                      "block h-auto w-full rounded-lg bg-muted shadow-sm",
                    )}
                    data-sanity={dataAttribute}
                    loading={shouldEagerLoad ? "eager" : "lazy"}
                    fetchPriority={shouldEagerLoad ? "high" : "auto"}
                  />
                </div>
              );
            })}
          </div>

          {duplicatedImages.map((image, index) => {
            const dataAttribute = columnAttributes.duplicateCycle[index];

            return (
              <div
                key={`${columnKey}-${image._key ?? index}-${index}-cycle2`}
                className="w-full"
              >
                <SanityImage
                  image={image}
                  alt={stegaClean(
                    image.alt ?? title ?? "Home slideshow vertical image",
                  )}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  className={cn(
                    "block h-auto w-full rounded-lg bg-muted shadow-sm",
                  )}
                  data-sanity={dataAttribute}
                  loading={shouldPriorityLoadImages ? "eager" : "lazy"}
                  fetchPriority={shouldPriorityLoadImages ? "high" : "auto"}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    );
  };

  return (
    <Section
      spacingTop="none"
      spacingBottom="none"
      isPageTop={isPageTop}
      className="w-full"
    >
      <div
        aria-label="Home slideshow vertical hero"
        role="region"
        ref={blockRef}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-8 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:min-h-[70vh]">
          <div className="flex w-full flex-col gap-6 py-10 text-start sm:py-12 lg:max-w-xl lg:py-16">
            {title ? (
              <Eyebrow text={title} data-sanity={titleDataAttribute} />
            ) : null}
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              <span
                data-sanity={headingRichTextDataAttribute}
                className="block break-words"
              >
                <PortableText
                  value={headingContent as PortableTextBlock[]}
                  components={HEADING_PORTABLE_TEXT_COMPONENTS}
                />
              </span>
            </h1>
            <div
              data-sanity={descriptionDataAttribute}
              className="text-base text-muted-foreground sm:text-lg"
            >
              <RichText richText={description} />
            </div>
            {buttons.length ? (
              <SanityButtons
                buttons={buttons}
                size="lg"
                className="flex flex-wrap gap-3"
              />
            ) : null}
          </div>

          <div className="grid w-full grid-cols-2 gap-4  lg:-mt-32 lg:pt-0">
            {renderColumn(
              leftImages,
              duplicatedLeftImages,
              "left",
              leftMetrics,
            )}
            {renderColumn(
              rightImages,
              duplicatedRightImages,
              "right",
              rightMetrics,
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
