import type { Metadata } from "next";

import { RichText } from "@/components/elements/rich-text";
import { TimelineSection } from "@/components/page-sections/shared/timeline-section";
import { sanityFetch } from "@/lib/sanity/live";
import { getHistoryPageQuery } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const historyData = await sanityFetch({
    query: getHistoryPageQuery,
  });

  return getSEOMetadata({
    title: historyData?.data?.title
      ? `${historyData.data.title} - DelGrosso Foods`
      : "Our History - DelGrosso Foods",
    description:
      historyData?.data?.description ||
      "Discover the rich history and heritage of DelGrosso Foods, America's oldest family sauce-maker since 1914. Learn about our journey, traditions, and commitment to authentic Italian flavors.",
    slug: "/history",
  });
}

export default async function HistoryPage() {
  const historyData = await sanityFetch({
    query: getHistoryPageQuery,
  });

  // Transform Sanity data to match TimelineSection expected format
  const timelineData =
    historyData?.data?.timeline?.markers?.map(
      (marker: {
        heading: string | null;
        subtitle?: string | null;
        content: unknown;
        image?: {
          id: string | null;
          alt?: string | null;
          hotspot?: { x: number; y: number } | null;
          crop?: {
            top: number;
            bottom: number;
            left: number;
            right: number;
          } | null;
          preview?: string | null;
        } | null;
      }) => ({
        title: marker.heading || "",
        subtitle: marker.subtitle || undefined,
        content: marker.content ? (
          <RichText richText={marker.content as any} />
        ) : null,
        image: marker.image?.id
          ? {
              id: marker.image.id,
              alt: marker.image.alt ?? "",
              hotspot: marker.image.hotspot ?? null,
              crop: marker.image.crop ?? null,
              preview: marker.image.preview ?? null,
            }
          : undefined,
      }),
    ) || [];

  return (
    <TimelineSection
      title={historyData?.data?.title || "Our Rich Heritage"}
      subtitle={
        historyData?.data?.description ||
        "Discover the story behind America's oldest family sauce-maker and our commitment to authentic Italian flavors since 1914"
      }
      timelineData={timelineData}
    />
  );
}
