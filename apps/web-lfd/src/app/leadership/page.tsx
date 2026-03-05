import { sanityFetch } from "@workspace/sanity-config/live";
import { getAllLeadersForIndexQuery } from "@workspace/sanity-config/query";
import { getSiteParams } from "@workspace/sanity-config/site";
import type {
  GetAllLeadersForIndexQueryResult,
  LfdLeadershipIndexPageQueryResult,
} from "@workspace/sanity-config/types";
import { SanityButtons } from "@workspace/ui/components/sanity-buttons";
import { Section } from "@workspace/ui/components/section";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SanityImage } from "@/components/elements/sanity-image";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import { lfdLeadershipIndexPageQuery } from "@/lib/sanity/queries";
import { getSEOMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const indexData = await sanityFetch({
    query: lfdLeadershipIndexPageQuery,
  });
  const data = (indexData?.data ?? null) as LfdLeadershipIndexPageQueryResult;

  return getSEOMetadata(
    data
      ? {
          title: data.title ?? "Leadership",
          description: data.description ?? "",
          slug: "/leadership",
          contentId: data._id,
          contentType: data._type,
        }
      : {
          title: "Leadership",
          description: "Meet the leadership team.",
          slug: "/leadership",
        },
  );
}

export default async function LeadershipPage() {
  const [indexRes, leadersRes] = await Promise.all([
    sanityFetch({
      query: lfdLeadershipIndexPageQuery,
    }),
    sanityFetch({
      query: getAllLeadersForIndexQuery,
      params: getSiteParams(),
    }),
  ]);

  const indexData = (indexRes?.data ??
    null) as LfdLeadershipIndexPageQueryResult;
  const leaders = (leadersRes?.data ?? []) as GetAllLeadersForIndexQueryResult;

  if (!indexData) {
    return notFound();
  }

  const titleAttribute = createPresentationDataAttribute({
    documentId: indexData._id,
    documentType: indexData._type,
    path: "title",
  });
  const descriptionAttribute = createPresentationDataAttribute({
    documentId: indexData._id,
    documentType: indexData._type,
    path: "description",
  });
  const eyebrowAttribute = createPresentationDataAttribute({
    documentId: indexData._id,
    documentType: indexData._type,
    path: "eyebrow",
  });
  const buttonsAttribute = createPresentationDataAttribute({
    documentId: indexData._id,
    documentType: indexData._type,
    path: "buttons",
  });

  return (
    <Section spacingTop="page-top" spacingBottom="default">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-12">
          <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            {indexData.eyebrow ? (
              <p
                className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green"
                data-sanity={eyebrowAttribute ?? undefined}
              >
                {indexData.eyebrow}
              </p>
            ) : null}
            <h1
              className="text-4xl font-semibold text-balance md:text-5xl"
              data-sanity={titleAttribute ?? undefined}
            >
              {indexData.title}
            </h1>
            {indexData.description ? (
              <p
                className="text-lg text-muted-foreground"
                data-sanity={descriptionAttribute ?? undefined}
              >
                {indexData.description}
              </p>
            ) : null}
            {indexData.buttons?.length ? (
              <div data-sanity={buttonsAttribute ?? undefined}>
                <SanityButtons
                  buttons={indexData.buttons}
                  className="w-full sm:w-fit grid gap-2 sm:grid-flow-col"
                  buttonClassName="w-full sm:w-auto"
                />
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
            {leaders.map((leader) => (
              <article key={leader._id} className="space-y-4">
                <div className="overflow-hidden rounded-lg bg-muted aspect-[4/5]">
                  {leader.image ? (
                    <SanityImage
                      image={leader.image}
                      width={640}
                      height={800}
                      alt={leader.image.alt ?? leader.name ?? ""}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold leading-tight">
                    {leader.name}
                  </h2>
                  <p className="text-lg leading-snug text-foreground">
                    {leader.position}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
