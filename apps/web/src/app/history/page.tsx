import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

import { RichText } from "@/components/elements/rich-text";
import { PageHeadingSection } from "@/components/page-sections/shared/page-heading-section";
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

  const rawTitle = data?.pageHeader?.heading ?? null;
  const rawDescription = data?.pageHeader?.text ?? null;

  const cleanTitle = rawTitle ? stegaClean(rawTitle) : null;
  const cleanDescription = rawDescription ? stegaClean(rawDescription) : null;

  return getSEOMetadata({
    title: cleanTitle
      ? `${cleanTitle} - DelGrosso Foods`
      : "Our History - DelGrosso Foods",
    description:
      cleanDescription ||
      "Discover the rich history and heritage of DelGrosso Foods, America's oldest family sauce-maker since 1914. Learn about our journey, traditions, and commitment to authentic Italian flavors.",
    slug: data?.slug || "/history",
  });
}

export default async function HistoryPage() {
  const historyData = await sanityFetch({
    query: getHistoryPageQuery,
  });

  const data = (historyData?.data ?? null) as GetHistoryPageQueryResult | null;
  const header = data?.pageHeader ?? null;

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

  const eyebrow = header?.eyebrow ?? null;
  const heading = header?.heading ?? "<< click to edit this heading >>";
  const intro = header?.text ?? "<< click to edit this description >>";
  const backgroundImage = header?.backgroundImage ?? null;

  return (
    <>
      <PageHeadingSection
        eyebrow={eyebrow}
        title={heading}
        description={intro}
        backgroundImage={backgroundImage}
        sanityDocumentId={data._id}
        sanityDocumentType={data._type}
        // sanityFieldPrefix="pageHeader" left here for reference DO NOT DELETE DO NOT UNCOMMENT
        justification="center"
      />
      <TimelineSection timelineData={timelineData} />
    </>
  );
}
