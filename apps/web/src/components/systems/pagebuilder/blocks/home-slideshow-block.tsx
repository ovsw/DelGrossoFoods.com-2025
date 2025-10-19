import {
  HomeSlideshowSection,
  type HomeSlideshowSlide,
} from "@/components/page-sections/home/home-slideshow-section";

import type { PageBuilderBlockProps } from "../types";

type HomeSlideshowBlockProps = PageBuilderBlockProps<"homeSlideshow">;
type HomeSlideshowSlideInput = NonNullable<
  HomeSlideshowBlockProps["slides"]
>[number];

function toSlide(
  slide: HomeSlideshowSlideInput | undefined,
  slideIndex: number,
): HomeSlideshowSlide | null {
  if (!slide) return null;

  const imageData = slide.image?.image;

  if (!imageData?.id) {
    return null;
  }

  const [button] = slide.buttons ?? [];

  const normalizedSlide: HomeSlideshowSlide = {
    id: slide._key ?? `slide-${slideIndex}`,
    sanityKey: slide._key ?? null,
    title: slide.title,
    subtitle: slide.subtitle,
    description: slide.description,
    button: button ?? null,
    image: imageData,
    imageAlt: slide.image?.alt ?? null,
  };

  return normalizedSlide;
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
  const normalizedSlides = normalizeSlides(slides);

  if (!normalizedSlides.length) {
    return null;
  }

  return (
    <HomeSlideshowSection
      slides={normalizedSlides}
      sanityBlockKey={_key}
      sanityDocumentId={sanityDocumentId}
      sanityDocumentType={sanityDocumentType}
    />
  );
}
