// import { PageBuilder } from "@/components/systems/pagebuilder/pagebuilder";
import { sanityFetch } from "@workspace/sanity-config/live";
import { getSiteParams } from "@workspace/sanity-config/site";
import type { Metadata } from "next";

import { PageBuilder } from "@/components/systems/pagebuilder/pagebuilder";
import { lfdHomePageQuery } from "@/lib/sanity/queries";
import { getSEOMetadata } from "@/lib/seo";

async function fetchHomePageData() {
  return await sanityFetch({
    query: lfdHomePageQuery,
    params: getSiteParams(),
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: homePageData } = await fetchHomePageData();
  return getSEOMetadata(
    homePageData
      ? {
          title: homePageData?.title ?? homePageData?.seoTitle ?? "",
          description:
            homePageData?.description ?? homePageData?.seoDescription ?? "",
          slug: homePageData?.slug,
          contentId: homePageData?._id,
          contentType: homePageData?._type,
        }
      : {},
  );
}

export default async function Page() {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  const { _id, _type, pageBuilder } = homePageData ?? {};

  return (
    <>
      <PageBuilder pageBuilder={pageBuilder ?? []} id={_id} type={_type} />
    </>
  );
}
