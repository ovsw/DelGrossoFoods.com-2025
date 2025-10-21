"use client";

import { Section } from "@workspace/ui/components/section";

import { TimelineLayout } from "@/components/layouts/timeline-layout";

interface TimelineSectionProps {
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
  timelineData = [],
  className,
}: TimelineSectionProps) {
  // Don't render if no data is provided
  if (!timelineData || timelineData.length === 0) {
    return null;
  }

  return (
    <Section spacingTop="small" spacingBottom="large" className={className}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:mt-16">
        <TimelineLayout data={timelineData} />
      </div>
    </Section>
  );
}
