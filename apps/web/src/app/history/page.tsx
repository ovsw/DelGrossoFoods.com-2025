import type { Metadata } from "next";

import { TimelineSection } from "@/components/page-sections/shared/timeline-section";
import { getSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = getSEOMetadata({
  title: "Our History - DelGrosso Foods",
  description:
    "Discover the rich history and heritage of DelGrosso Foods, America's oldest family sauce-maker since 1914. Learn about our journey, traditions, and commitment to authentic Italian flavors.",
  slug: "/history",
});

export default function HistoryPage() {
  return (
    <main>
      <TimelineSection
        title="Our Rich Heritage"
        subtitle="Discover the story behind America's oldest family sauce-maker and our commitment to authentic Italian flavors since 1914"
      />
    </main>
  );
}
