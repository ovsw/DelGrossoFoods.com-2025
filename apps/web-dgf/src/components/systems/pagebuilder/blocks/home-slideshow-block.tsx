"use client";

import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { SanityButtons } from "@workspace/ui/components/sanity-buttons";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { createDataAttribute, stegaClean } from "next-sanity";
import { useCallback, useEffect, useMemo, useState } from "react";

import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { dataset, projectId, studioUrl } from "@/config";
import type { SanityButtonProps, SanityImageProps } from "@/types";

import type { PageBuilderBlockProps } from "../types";

const SLIDE_DURATION = 6000; // milliseconds
const TRANSITION_DURATION = 350; // milliseconds (matches Framer Motion's 0.35s)
const TRANSITION_DURATION_S = TRANSITION_DURATION / 1000; // seconds

type HomeSlideshowBlockProps = PageBuilderBlockProps<"homeSlideshow">;
type HomeSlideshowSlideInput = NonNullable<
  HomeSlideshowBlockProps["slides"]
>[number];

interface HomeSlideshowSlide {
  readonly id: string;
  readonly sanityKey: string | null;
  readonly title: string | null;
  readonly subtitle: string | null;
  readonly description: unknown;
  readonly button: SanityButtonProps | null;
  readonly image: SanityImageProps;
  readonly imageAlt: string | null;
}

function toSlide(
  slide: HomeSlideshowSlideInput | undefined,
  slideIndex: number,
): HomeSlideshowSlide | null {
  if (!slide) return null;

  const imageData = slide.image;
  if (!imageData?.id) {
    return null;
  }

  const [button] = slide.buttons ?? [];

  return {
    id: slide._key ?? `slide-${slideIndex}`,
    sanityKey: slide._key ?? null,
    title: slide.title ?? null,
    subtitle: slide.subtitle ?? null,
    description: slide.description ?? null,
    button: button ?? null,
    image: imageData,
    imageAlt: imageData.alt ?? null,
  };
}

function normalizeSlides(
  slides: HomeSlideshowBlockProps["slides"] | undefined,
): HomeSlideshowSlide[] {
  if (!slides?.length) return [];

  return slides
    .slice(0, 3)
    .map((slide, index) => toSlide(slide, index))
    .filter((slide): slide is HomeSlideshowSlide => slide !== null);
}

export function HomeSlideshowBlock({
  slides,
  _key,
  sanityDocumentId,
  sanityDocumentType,
}: HomeSlideshowBlockProps) {
  const normalizedSlides = useMemo(() => normalizeSlides(slides), [slides]);

  const totalSlides = normalizedSlides.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setCurrentSlide(0);
  }, [totalSlides]);

  const queueSlideChange = useCallback(
    (computeNext: (current: number, total: number) => number) => {
      if (isTransitioning || totalSlides <= 0) return;

      setIsTransitioning(true);

      window.setTimeout(() => {
        setCurrentSlide((prev) => {
          const next = computeNext(prev, totalSlides);
          if (Number.isNaN(next)) return prev;

          const normalizedIndex =
            ((next % totalSlides) + totalSlides) % totalSlides;
          return normalizedIndex;
        });
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    },
    [isTransitioning, totalSlides],
  );

  const handleNextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    queueSlideChange((current, total) => (current + 1) % total);
  }, [queueSlideChange, totalSlides]);

  const handlePrevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    queueSlideChange((current, total) => (current - 1 + total) % total);
  }, [queueSlideChange, totalSlides]);

  const handleSlideChange = useCallback(
    (index: number) => {
      if (totalSlides <= 1 || index === currentSlide) return;
      if (index < 0 || index >= totalSlides) return;
      queueSlideChange(() => index);
    },
    [currentSlide, queueSlideChange, totalSlides],
  );

  useEffect(() => {
    if (totalSlides <= 1) return;

    const intervalId = window.setInterval(() => {
      queueSlideChange((current, total) => (current + 1) % total);
    }, SLIDE_DURATION);

    return () => window.clearInterval(intervalId);
  }, [queueSlideChange, totalSlides]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!totalSlides) {
    return null;
  }

  const current = normalizedSlides[currentSlide] ?? normalizedSlides[0]!;
  const slidesPathBase =
    _key !== undefined && _key !== null
      ? `pageBuilder[_key==${JSON.stringify(_key)}].slides`
      : undefined;
  const slideSelector =
    current.sanityKey !== null
      ? `[_key==${JSON.stringify(current.sanityKey)}]`
      : `[${currentSlide}]`;

  const createFieldDataAttribute = (field: string) => {
    if (
      !sanityDocumentId ||
      !sanityDocumentType ||
      slidesPathBase === undefined
    ) {
      return undefined;
    }

    const fieldPath = `${slidesPathBase}${slideSelector}.${field}`;

    return createDataAttribute({
      id: sanityDocumentId,
      type: sanityDocumentType,
      path: fieldPath,
      baseUrl: studioUrl,
      projectId,
      dataset,
    }).toString();
  };

  const currentSlideImageDataAttribute = createFieldDataAttribute("image");
  const currentSlideTitleDataAttribute = createFieldDataAttribute("title");
  const currentSlideSubtitleDataAttribute =
    createFieldDataAttribute("subtitle");

  return (
    <div
      className="relative w-full justify-center overflow-hidden bg-[url('/images/bg/counter-wall-5-no-bottom-border-ultrawide-p-2600-taller.jpg')] bg-cover bg-bottom pt-36 pb-16"
      role="region"
      aria-label="DelGrosso Sauce Lines Slideshow"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-7xl transform flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch lg:justify-start ">
        <div className="container mx-auto flex w-full flex-col items-center justify-end  px-6 text-center md:text-left lg:grid lg:grid-cols-[minmax(24rem,44%)_minmax(0,1fr)] lg:items-end lg:max-w-5xl">
          <div className="flex w-full max-w-[20rem] flex-col items-center justify-end  py-6 md:grid md:max-w-none md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:gap-10 md:py-8 lg:order-1 lg:max-w-[26rem] lg:grid-cols-1 lg:justify-items-center lg:gap-10 lg:py-10">
            <div className="mb-4 w-full max-w-[18rem] -rotate-2 transform bg-white p-2 shadow-lg hover:rotate-0 md:mb-0 md:max-w-[20rem] md:justify-self-start md:me-8 md:p-4 lg:me-0 lg:justify-self-center">
              <Image
                priority={true}
                width={500}
                height={300}
                src="/images/delgrosso-family-photo.jpg"
                alt="DelGrosso family photo of gathering with traditional cooking"
                className="w-full object-cover"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: TRANSITION_DURATION_S }}
                className="flex w-full flex-col items-center text-center md:items-start md:text-left lg:items-center lg:text-center"
              >
                {current.title ? (
                  <Eyebrow
                    text={current.title}
                    data-sanity={currentSlideTitleDataAttribute}
                  />
                ) : null}
                {current.subtitle ? (
                  <h2 className="mb-6 text-2xl font-semibold md:text-4xl lg:text-4xl">
                    <span data-sanity={currentSlideSubtitleDataAttribute}>
                      {current.subtitle}
                    </span>
                  </h2>
                ) : null}
                {current.description ? (
                  <div className="mb-8 w-full text-base md:text-lg">
                    <RichText
                      richText={current.description}
                      className="prose-p:italic prose-p:text-base"
                    />
                  </div>
                ) : null}
                {current.button ? (
                  <div className="w-full md:self-start lg:self-center">
                    <SanityButtons
                      buttons={[current.button]}
                      size="lg"
                      className="items-center sm:justify-center md:justify-start lg:justify-center"
                    />
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative bottom-10 mt-14 lg:bottom-0 order-2 flex w-full flex-col items-center justify-end pl-2 md:pl-6 lg:order-2 lg:items-end lg:justify-center lg:self-stretch lg:pl-16">
            <div className="relative w-full overflow-visible lg:h-full lg:self-stretch">
              <div className="relative flex w-full items-end justify-center min-h-[35svh] [aspect-ratio:4/3] lg:absolute lg:-bottom-4 lg:left-0 lg:h-[calc(100%-1.25rem)] lg:w-[125%] lg:max-w-[720px] lg:-translate-x-4 lg:[aspect-ratio:4/3] lg:items-end lg:justify-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: "10%" }}
                    animate={{ opacity: 1, x: "0%" }}
                    exit={{ opacity: 0, x: "0%" }}
                    transition={{ duration: TRANSITION_DURATION_S }}
                    className="flex h-full w-full items-end justify-center lg:justify-start"
                  >
                    <SanityImage
                      image={current.image}
                      alt={stegaClean(
                        current.imageAlt ??
                          current.subtitle ??
                          current.title ??
                          "DelGrosso sauce selection",
                      )}
                      width={500}
                      height={300}
                      className="block h-full max-h-[28rem] w-auto object-contain lg:h-full lg:max-h-none"
                      data-sanity={currentSlideImageDataAttribute}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform items-center space-x-4">
        <button
          onClick={handlePrevSlide}
          disabled={isTransitioning || totalSlides <= 1}
          className="rounded-full bg-white/80 p-2 transition-colors hover:bg-white disabled:opacity-50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex space-x-2">
          {normalizedSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleSlideChange(index)}
              disabled={isTransitioning}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNextSlide}
          disabled={isTransitioning || totalSlides <= 1}
          className="rounded-full bg-white/80 p-2 transition-colors hover:bg-white disabled:opacity-50"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 h-2 w-full bg-white/30">
        <div
          key={`${current.id}-${currentSlide}-${hasMounted}`}
          className={
            totalSlides > 1
              ? `bg-brand-green h-full animate-[progress-animation_${SLIDE_DURATION}ms_linear]`
              : "bg-brand-green h-full"
          }
        />
      </div>

      <style>{`
        @keyframes progress-animation {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
