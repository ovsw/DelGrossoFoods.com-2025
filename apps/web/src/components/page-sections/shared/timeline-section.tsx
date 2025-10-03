"use client";

import { Section } from "@workspace/ui/components/section";

import { TimelineLayout } from "@/components/layouts/timeline-layout";

interface TimelineSectionProps {
  title?: string;
  subtitle?: string;
  timelineData?: Array<{
    title: string;
    subtitle?: string;
    content: React.ReactElement | null;
    image?: {
      id: string;
      alt?: string;
      hotspot?: { x: number; y: number } | null;
      crop?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
      } | null;
      preview?: string | null;
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

  return (
    <Section
      isPageTop
      spacingTop="large"
      spacingBottom="large"
      className={className}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:mt-16">
        {/* Header */}
        <div className="mb-16 text-center lg:mb-24">
          <h2 className="mb-4 text-3xl font-bold text-brand-green lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl lg:text-lg text-dark-700">
            {subtitle}
          </p>
        </div>

        {/* Timeline */}
        <TimelineLayout data={timelineData} />
      </div>
    </Section>
  );
}
