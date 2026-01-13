"use client";

import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { SanityButtons } from "@workspace/ui/components/sanity-buttons";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { createDataAttribute, stegaClean } from "next-sanity";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildSrc } from "sanity-image";

import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { dataset, projectId, studioUrl } from "@/config";
import type { SanityButtonProps, SanityImageProps } from "@/types";

import type { PageBuilderBlockProps } from "../types";

const SCROLL_DURATION_SECONDS = 45;
const IMAGE_WIDTH = 540;
const IMAGE_HEIGHT = 960;
const SANITY_BASE_URL =
  `https://cdn.sanity.io/images/${projectId}/${dataset}/` as const;

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
  readonly subtitle: string | null;
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
    subtitle: block.subtitle ?? null,
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

  const { title, subtitle, description, buttons, leftImages, rightImages } =
    useMemo(() => normalizeContent(props), [props]);

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
    subtitle: subtitleDataAttribute,
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
      subtitle: createAttribute("subtitle"),
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

  if (!subtitle || !description || !hasImages) {
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
                      image.alt ??
                        subtitle ??
                        title ??
                        "Home slideshow vertical image",
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
                    image.alt ??
                      subtitle ??
                      title ??
                      "Home slideshow vertical image",
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
              <span data-sanity={subtitleDataAttribute}>{subtitle}</span>
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
