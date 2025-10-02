"use client";

import { Button } from "@workspace/ui/components/button";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";

// Mock data for timeline items
interface TimelineItemData {
  id: string;
  date: string;
  title: string;
  description: string;
  image: {
    id: string;
    preview?: string;
    alt?: string;
  };
  buttons: Array<{
    text: string;
    href: string;
  }>;
}

const mockTimelineData: TimelineItemData[] = [
  {
    id: "1",
    date: "2024",
    title: "Company Founded",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    image: {
      id: "image-1",
      alt: "Company founding moment",
    },
    buttons: [{ text: "Learn More", href: "/about" }],
  },
  {
    id: "2",
    date: "2023",
    title: "Product Launch",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    image: {
      id: "image-2",
      alt: "Product launch celebration",
    },
    buttons: [{ text: "View Products", href: "/products" }],
  },
  {
    id: "3",
    date: "2022",
    title: "Expansion",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    image: {
      id: "image-3",
      alt: "Business expansion",
    },
    buttons: [{ text: "Our Story", href: "/about" }],
  },
  {
    id: "4",
    date: "2021",
    title: "Innovation",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    image: {
      id: "image-4",
      alt: "Innovation breakthrough",
    },
    buttons: [{ text: "Research", href: "/research" }],
  },
];

interface TimelineItemProps {
  item: TimelineItemData;
  index: number;
}

function TimelineItem({ item, index }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        "relative flex w-full items-start gap-6 lg:gap-16",
        // Mobile: single column content to the right of the left-side timeline
        "flex-row",
        // Desktop: alternate sides left/right
        isEven ? "lg:flex-row" : "lg:flex-row-reverse",
        "mb-16 lg:mb-24 pl-12 lg:pl-0",
      )}
    >
      {/* Timeline Marker */}
      <div className="absolute left-6 top-0 z-20 -translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2">
        <div
          className={cn(
            // Dot size: 1rem (16px)
            "h-4 w-4 rounded-full",
            // Simple contrast; we can revisit styling later
            "bg-neutral-900 shadow-sm",
          )}
        />
      </div>

      {/* Content Side */}
      <div
        className={cn(
          "flex w-full flex-col gap-6 lg:w-1/2",
          isEven ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left",
        )}
      >
        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {item.date}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            {item.title}
          </h3>
          <p className="text-base text-gray-700 leading-relaxed max-w-lg">
            {item.description}
          </p>
          <div className="flex gap-4">
            {item.buttons.map((button, buttonIndex) => (
              <Button key={buttonIndex} variant="outline" asChild>
                <a href={button.href}>{button.text}</a>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Side */}
      <div className="w-full lg:w-1/2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
          {/* Placeholder for image - using mock data */}
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm">{item.image.alt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* No per-item connector; the global track handles the line */}
    </div>
  );
}

interface TimelineSectionProps {
  title?: string;
  subtitle?: string;
  items?: TimelineItemData[];
  className?: string;
}

export function TimelineSection({
  title = "Our Journey",
  subtitle = "Discover the milestones that shaped our story",
  items = mockTimelineData,
  className,
}: TimelineSectionProps) {
  return (
    // Remove white background so the page background shows through
    <Section spacingTop="large" spacingBottom="large" className={className}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center lg:mb-24">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Centered Timeline Track - Desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-[5px] -translate-x-1/2 bg-neutral-300 lg:block" />

          {/* Mobile Timeline Track - Left Aligned */}
          <div className="absolute left-6 top-0 h-full w-[5px] bg-neutral-300 lg:hidden" />

          {/*
            Desktop Sticky Progress Effect (centered)
            Creates the illusion of a progress line that fills from center
          */}
          <div className="absolute left-1/2 top-0 hidden h-full w-[5px] -translate-x-1/2 flex-col items-center lg:flex">
            {/* Sticky progress segment - fills as you scroll */}
            <div
              className="sticky top-0 z-[3] h-[50vh] w-full bg-neutral-900"
              style={{ marginTop: "-50vh" }}
            />

            {/* Top fade overlay */}
            <div className="absolute top-0 z-[1] h-16 w-full bg-gradient-to-b from-white to-transparent" />

            {/* Bottom fade overlay */}
            <div className="absolute bottom-0 z-[1] h-16 w-full bg-gradient-to-t from-white to-transparent" />

            {/* Cover that hides top half */}
            <div className="absolute top-[-50vh] z-[2] h-[50vh] w-full bg-white" />
          </div>

          {/* Mobile Sticky Progress Effect (left aligned) */}
          <div className="absolute left-6 top-0 h-full w-[5px] flex-col items-center lg:hidden">
            {/* Sticky progress segment for mobile */}
            <div
              className="sticky top-0 z-[3] h-[50vh] w-full bg-neutral-900"
              style={{ marginTop: "-50vh" }}
            />

            {/* Top fade overlay for mobile */}
            <div className="absolute top-0 z-[1] h-16 w-full bg-gradient-to-b from-white to-transparent" />

            {/* Bottom fade overlay for mobile */}
            <div className="absolute bottom-0 z-[1] h-16 w-full bg-gradient-to-t from-white to-transparent" />

            {/* Cover that hides top half for mobile */}
            <div className="absolute top-[-50vh] z-[2] h-[50vh] w-full bg-white" />
          </div>

          {/* Timeline Items */}
          <div className="space-y-0">
            {items.map((item, index) => (
              <TimelineItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
