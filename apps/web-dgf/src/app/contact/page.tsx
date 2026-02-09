import { sanityFetch } from "@workspace/sanity-config/live";
import { getSiteParams } from "@workspace/sanity-config/site";
import type { DgfContactPageQueryResult } from "@workspace/sanity-config/types";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

import { ContactFormSection } from "@/components/page-sections/contact-page/contact-form-section";
import { PageBuilder } from "@/components/systems/pagebuilder/pagebuilder";
import { dgfContactPageQuery } from "@/lib/sanity/queries";
import { getSEOMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const contactData = await sanityFetch({
    query: dgfContactPageQuery,
    params: getSiteParams(),
  });

  const data = (contactData?.data ?? null) as DgfContactPageQueryResult | null;

  const rawTitle = data?.title ?? null;
  const rawDescription = data?.description ?? null;

  const cleanTitle = rawTitle ? stegaClean(rawTitle) : null;
  const cleanDescription = rawDescription ? stegaClean(rawDescription) : null;

  return getSEOMetadata({
    title: cleanTitle || "Contact Us",
    description:
      cleanDescription ||
      "Get in touch with DelGrosso Foods. Whether you have questions about our La Famiglia DelGrosso pasta sauces or need help finding our products, we're here to help.",
    slug: data?.slug || "/contact",
  });
}

export default async function ContactPage() {
  const contactData = await sanityFetch({
    query: dgfContactPageQuery,
    params: getSiteParams(),
  });

  const data = (contactData?.data ?? null) as DgfContactPageQueryResult | null;

  const heading = data?.title || "Contact Us";
  const intro =
    data?.description ||
    "Get in touch with us about our La Famiglia DelGrosso pasta sauces or DelGrosso Foods products. We're here to help with any questions you might have.";
  type ContactPageData = NonNullable<DgfContactPageQueryResult>;
  const siteSettings = data?.siteSettings ?? null;
  const contactInformation = siteSettings
    ? {
        addressLines: Array.isArray(siteSettings.addressLines)
          ? siteSettings.addressLines
          : null,
        phoneNumbers: (() => {
          const phones: Array<{ _key: string; display: string }> = [];
          if (siteSettings.officePhone) {
            phones.push({
              _key: "office",
              display: siteSettings.officePhone,
            });
          }
          if (siteSettings.tollFreePhone) {
            phones.push({
              _key: "tollFree",
              display: siteSettings.tollFreePhone,
            });
          }
          return phones.length > 0 ? phones : null;
        })(),
        email: siteSettings.contactEmail ?? null,
        websiteUrl: siteSettings.corporateWebsiteUrl ?? null,
      }
    : null;
  const maybePageBuilder = data?.pageBuilder;
  const pageBuilder: ContactPageData["pageBuilder"] = Array.isArray(
    maybePageBuilder,
  )
    ? maybePageBuilder
    : [];
  const hasPageBuilderContent = pageBuilder.length > 0;
  const documentId = data?._id ?? null;
  const documentType = data?._type ?? null;

  return (
    <>
      <ContactFormSection
        title={heading}
        description={intro}
        contactInformation={contactInformation}
        siteSettingsId={siteSettings?._id ?? null}
      />

      {documentId && documentType && hasPageBuilderContent ? (
        <PageBuilder
          pageBuilder={pageBuilder}
          id={documentId}
          type={documentType}
        />
      ) : null}
    </>
  );
}
