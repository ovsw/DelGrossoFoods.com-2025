import { Section } from "@workspace/ui/components/section";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

import { ContactForm } from "@/components/features/contact/contact-form";
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
    title: cleanTitle
      ? `${cleanTitle} - DelGrosso Foods`
      : "Contact Us - DelGrosso Foods",
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
      {/* Hero Section */}
      <Section spacingTop="default" spacingBottom="default">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl text-center">
            <h1 className="text-3xl font-bold sm:text-5xl text-brand-green">
              {heading}
            </h1>
            <p className="mt-4 text-xl leading-8 text-muted-foreground">
              {intro}
            </p>
          </div>
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section spacingTop="default" spacingBottom="default">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="bg-white/50 rounded-lg border border-input p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Send us a message
            </h2>
            <ContactForm />
          </div>
        </div>
      </Section>

      {/* Additional Content Sections (if any) */}
      {/* This will be populated by the pageBuilder field when content is added in Sanity */}
    </main>
  );
}
