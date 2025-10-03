"use client";

import { Timeline } from "@workspace/ui/components";
import { Section } from "@workspace/ui/components/section";

import { SanityImage } from "@/components/elements/sanity-image";

interface TimelineSectionProps {
  title?: string;
  subtitle?: string;
  timelineData?: Array<{
    title: string;
    subtitle?: string;
    content: React.ReactElement | null;
    image?: {
      id?: string;
      alt?: string;
      hotspot?: { x: number; y: number } | null;
      crop?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
      } | null;
      preview?: string | null;
      src?: string;
    } | null;
  }>;
  className?: string;
}

export function TimelineSection({
  title,
  subtitle,
  timelineData = [],
  className,
}: TimelineSectionProps) {
  // Don't render if no data is provided
  if (!title && !subtitle && (!timelineData || timelineData.length === 0)) {
    return null;
  }

  const renderImage = (
    image: NonNullable<TimelineSectionProps["timelineData"]>[0]["image"],
    className?: string,
  ) => {
    // Handle Sanity images (with id)
    if (image?.id && typeof image.id === "string") {
      return (
        <SanityImage
          image={{
            id: image.id,
            hotspot: image.hotspot || null,
            crop: image.crop || null,
            preview: image.preview || null,
          }}
          alt={image.alt || ""}
          className={className}
        />
      );
    }

    // Handle regular images (with src) - fallback
    if (image?.src && typeof image.src === "string") {
      return (
        <img src={image.src} alt={image.alt || ""} className={className} />
      );
    }

    return null;
  };

  return (
    <Section
      isPageTop
      spacingTop="large"
      spacingBottom="large"
      className={className}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center lg:mb-24">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>
        </div>

        {/* Timeline */}
        <Timeline data={timelineData} renderImage={renderImage} />
      </div>
    </Section>
  );
}
