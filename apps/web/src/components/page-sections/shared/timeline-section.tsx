"use client";

import { Timeline } from "@workspace/ui/components";
import { Section } from "@workspace/ui/components/section";

// Historical timeline data for DelGrosso Foods
const historyTimelineData = [
  {
    title: "1914 - The Beginning",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-700 dark:text-neutral-300">
          It all started when Ferdinand and Agnes DelGrosso opened a small
          produce stand in Altoona, Pennsylvania. What began as a simple family
          business selling fresh vegetables quickly evolved into something much
          more special.
        </p>
        <p className="text-neutral-700 dark:text-neutral-300">
          Ferdinand, an Italian immigrant with a passion for authentic flavors,
          began experimenting with homemade sauces using traditional family
          recipes passed down through generations. The sauces were an instant
          hit with local customers who craved the authentic taste of Italy.
        </p>
      </div>
    ),
    image: {
      src: "/images/delgrosso-family-photo.jpg",
      alt: "Ferdinand and Agnes DelGrosso with their early produce stand",
    },
  },
  {
    title: "1930s - Family Tradition",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-700 dark:text-neutral-300">
          As the Great Depression challenged many businesses, the DelGrosso
          family doubled down on quality and tradition. Ferdinand&apos;s sons
          joined the business, learning the art of sauce-making and helping
          expand the product line.
        </p>
        <p className="text-neutral-700 dark:text-neutral-300">
          The family developed their signature marinara sauce, which became a
          staple in local Italian-American households. Word spread about the
          exceptional quality and authentic flavors that couldn&apos;t be found
          elsewhere.
        </p>
      </div>
    ),
    image: {
      src: "/images/delgrosso-family-photo.jpg",
      alt: "The DelGrosso family working together in the 1930s",
    },
  },
  {
    title: "1950s - Post-War Expansion",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-700 dark:text-neutral-300">
          The post-World War II economic boom brought new opportunities. The
          DelGrosso family invested in modern equipment and expanded their
          facility while maintaining their commitment to traditional recipes and
          quality ingredients.
        </p>
        <p className="text-neutral-700 dark:text-neutral-300">
          New sauce varieties were introduced, including meat sauces and
          specialty blends that catered to the growing demand for convenient,
          high-quality Italian foods. The company began distributing beyond
          Pennsylvania, reaching neighboring states.
        </p>
      </div>
    ),
    image: {
      src: "/images/delgrosso-family-photo.jpg",
      alt: "Post-war expansion and modernization of the DelGrosso facility",
    },
  },
  {
    title: "1980s - Third Generation",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-700 dark:text-neutral-300">
          The third generation of DelGrossos took the helm, bringing fresh
          perspectives while honoring family traditions. Quality control became
          paramount, with each batch of sauce personally tasted and approved by
          family members.
        </p>
        <p className="text-neutral-700 dark:text-neutral-300">
          The company embraced new packaging technology and expanded their
          product line to include organic and low-sodium options, meeting the
          changing needs of health-conscious consumers while never compromising
          on the authentic flavors that made them famous.
        </p>
      </div>
    ),
    image: {
      src: "/images/delgrosso-family-photo.jpg",
      alt: "Third generation DelGrosso family overseeing quality control",
    },
  },
  {
    title: "2000s - National Recognition",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-700 dark:text-neutral-300">
          As the 21st century dawned, DelGrosso Foods gained national
          recognition as America&apos;s oldest family-owned sauce company. The
          company maintained its Pennsylvania roots while expanding distribution
          across the United States.
        </p>
        <p className="text-neutral-700 dark:text-neutral-300">
          Innovation continued with new flavor profiles and convenient packaging
          options, but the core commitment remained the same: using only the
          finest ingredients and traditional cooking methods to create sauces
          that taste like they were made in an Italian kitchen.
        </p>
      </div>
    ),
    image: {
      src: "/images/delgrosso-family-photo.jpg",
      alt: "National expansion and recognition of DelGrosso Foods",
    },
  },
  {
    title: "Today - Continuing the Legacy",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-700 dark:text-neutral-300">
          Now in its fourth generation of family ownership, DelGrosso Foods
          continues to honor Ferdinand&apos;s original vision. Every jar of
          sauce carries forward the tradition of quality, authenticity, and
          family pride that has defined the company for over a century.
        </p>
        <p className="text-neutral-700 dark:text-neutral-300">
          From humble beginnings in a Pennsylvania produce stand to becoming a
          nationally recognized brand, DelGrosso Foods remains committed to
          bringing the taste of Italy to American tables, one jar at a time.
        </p>
      </div>
    ),
    image: {
      src: "/images/delgrosso-family-photo.jpg",
      alt: "Fourth generation DelGrosso family continuing the legacy",
    },
  },
];

interface TimelineSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function TimelineSection({
  title = "Our Rich Heritage",
  subtitle = "Discover the story behind America's oldest family sauce-maker and our commitment to authentic Italian flavors since 1914",
  className,
}: TimelineSectionProps) {
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
        <Timeline data={historyTimelineData} />
      </div>
    </Section>
  );
}
