import type { Metadata } from "next";

import { RichText } from "@/components/elements/rich-text";
import { TimelineSection } from "@/components/page-sections/shared/timeline-section";
import { sanityFetch } from "@/lib/sanity/live";
import { getHistoryPageQuery } from "@/lib/sanity/query";
import type { GetHistoryPageQueryResult } from "@/lib/sanity/sanity.types";
import { getSEOMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const historyData = await sanityFetch({
    query: getHistoryPageQuery,
  });

  const data = (historyData?.data ?? null) as GetHistoryPageQueryResult | null;

  return getSEOMetadata({
    title: data?.title
      ? `${data.title} - DelGrosso Foods`
      : "Our History - DelGrosso Foods",
    description:
      data?.description ||
      "Discover the rich history and heritage of DelGrosso Foods, America's oldest family sauce-maker since 1914. Learn about our journey, traditions, and commitment to authentic Italian flavors.",
    slug: "/history",
  });
}

export default async function HistoryPage() {
  const historyData = await sanityFetch({
    query: getHistoryPageQuery,
  });

  const data = (historyData?.data ?? null) as GetHistoryPageQueryResult | null;

  // Transform Sanity data to match TimelineSection expected format
  const timelineData =
    data?.timeline?.markers?.map((marker) => ({
      title: marker.heading || "",
      subtitle: marker.subtitle || undefined,
      content: marker.content ? <RichText richText={marker.content} /> : null,
      image: marker.image?.id
        ? {
            id: marker.image.id,
            alt: "",
            hotspot: marker.image.hotspot ?? null,
            crop: marker.image.crop ?? null,
            preview: marker.image.preview ?? null,
          }
        : undefined,
    })) || [];

  // Don't render if no data is available
  if (!data) {
    return null;
  }

  return (
    <TimelineSection
      title={data.title}
      subtitle={data.description || undefined}
      timelineData={timelineData}
    />
  );
}
