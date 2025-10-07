import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

import { ContactFormSection } from "@/components/page-sections/contact-page/contact-form-section";
import { sanityFetch } from "@/lib/sanity/live";
import { getContactPageQuery } from "@/lib/sanity/query";
import type { GetContactPageQueryResult } from "@/lib/sanity/sanity.types";
import { getSEOMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const contactData = await sanityFetch({
    query: getContactPageQuery,
  });

  const data = (contactData?.data ?? null) as GetContactPageQueryResult | null;

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
    query: getContactPageQuery,
  });

  const data = (contactData?.data ?? null) as GetContactPageQueryResult | null;

  const heading = data?.title || "Contact Us";
  const intro =
    data?.description ||
    "Get in touch with us about our La Famiglia DelGrosso pasta sauces or DelGrosso Foods products. We're here to help with any questions you might have.";

  return (
    <main>
      <ContactFormSection title={heading} description={intro} />

      {/* Additional Content Sections (if any) */}
      {/* This will be populated by the pageBuilder field when content is added in Sanity */}
    </main>
  );
}
