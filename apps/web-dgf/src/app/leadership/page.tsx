import { sanityFetch } from "@workspace/sanity-config/live";
import { getAllLeadersForIndexQuery } from "@workspace/sanity-config/query";
import type {
  DgfLeadershipIndexPageQueryResult,
  GetAllLeadersForIndexQueryResult,
} from "@workspace/sanity-config/types";
import { SanityButtons } from "@workspace/ui/components/sanity-buttons";
import { Section } from "@workspace/ui/components/section";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SanityImage } from "@/components/elements/sanity-image";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import { dgfLeadershipIndexPageQuery } from "@/lib/sanity/queries";
import { getSEOMetadata } from "@/lib/seo";

function getLeaderImageAlt(
  leaderName: string | null | undefined,
  imageAlt: string | null | undefined,
): string {
  const normalizedAlt = imageAlt?.trim() ?? "";
  if (!normalizedAlt) {
    return "";
  }

  const normalizedLeaderName = leaderName?.trim().toLowerCase() ?? "";
  if (normalizedAlt.toLowerCase() === normalizedLeaderName) {
    return "";
  }

  return normalizedAlt;
}

export async function generateMetadata(): Promise<Metadata> {
  const indexData = await sanityFetch({
    query: dgfLeadershipIndexPageQuery,
  });
  const data = (indexData?.data ?? null) as DgfLeadershipIndexPageQueryResult;

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
  const [indexRes, allLeadersRes] = await Promise.all([
    sanityFetch({
      query: dgfLeadershipIndexPageQuery,
    }),
    sanityFetch({
      query: getAllLeadersForIndexQuery,
    }),
  ]);

  const indexData = (indexRes?.data ??
    null) as DgfLeadershipIndexPageQueryResult;
  const allLeaders = (allLeadersRes?.data ??
    []) as GetAllLeadersForIndexQueryResult;

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
  const leadersAttribute = createPresentationDataAttribute({
    documentId: indexData._id,
    documentType: indexData._type,
    path: "leaders",
  });
  const orderedLeaders = (indexData.leaders ?? []).filter(
    (leaderItem): leaderItem is NonNullable<typeof leaderItem> =>
      Boolean(leaderItem?.leader),
  );
  const leadersToRender =
    orderedLeaders.length > 0
      ? orderedLeaders
      : allLeaders.map((leader) => ({
          _key: null,
          leader,
        }));

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

          <div
            className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2"
            data-sanity={leadersAttribute ?? undefined}
          >
            {leadersToRender.map((leaderItem) => {
              const leader = leaderItem?.leader;
              const itemPath = leaderItem?._key
                ? `leaders[_key == "${leaderItem._key.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"]`
                : null;
              const itemAttribute = createPresentationDataAttribute({
                documentId: indexData._id,
                documentType: indexData._type,
                path: itemPath,
              });

              if (!leader) {
                return null;
              }

              return (
                <article
                  key={leaderItem?._key ?? leader._id}
                  className="space-y-4"
                  data-sanity={itemAttribute ?? undefined}
                >
                  <div className="overflow-hidden rounded-lg bg-muted aspect-[4/5]">
                    {leader.image ? (
                      <SanityImage
                        image={leader.image}
                        width={640}
                        height={800}
                        alt={getLeaderImageAlt(leader.name, leader.image.alt)}
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
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
