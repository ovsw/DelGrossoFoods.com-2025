import { client } from "@workspace/sanity-config/client";
import { getSiteParams } from "@workspace/sanity-config/site";
import type { LfdSettingsQueryResult } from "@workspace/sanity-config/types";
import { stegaClean } from "next-sanity";
import type {
  Answer,
  ContactPoint,
  FAQPage,
  ImageObject,
  Organization,
  Question,
  WebSite,
  WithContext,
} from "schema-dts";

import { lfdSettingsQuery } from "@/lib/sanity/queries";
import { getBaseUrl, handleErrors } from "@/utils";

interface RichTextChild {
  _type: string;
  text?: string;
  marks?: string[];
  _key: string;
}

interface RichTextBlock {
  _type: string;
  children?: RichTextChild[];
  style?: string;
  _key: string;
}

// Flexible FAQ type that can accept different rich text structures
interface FlexibleFaq {
  _id: string;
  title: string;
  richText?: RichTextBlock[] | null;
}

// Utility function to safely extract plain text from rich text blocks
function extractPlainTextFromRichText(
  richText: RichTextBlock[] | null | undefined,
): string {
  if (!Array.isArray(richText)) return "";

  return richText
    .filter((block) => block._type === "block" && Array.isArray(block.children))
    .map(
      (block) =>
        block.children
          ?.filter((child) => child._type === "span" && Boolean(child.text))
          .map((child) => child.text)
          .join("") ?? "",
    )
    .join(" ")
    .trim();
}

// Utility function to safely render JSON-LD
export function JsonLdScript<T>({ data, id }: { data: T; id: string }) {
  return (
    <script type="application/ld+json" id={id}>
      {JSON.stringify(data, null, 0)}
    </script>
  );
}

// FAQ JSON-LD Component
interface FaqJsonLdProps {
  faqs: FlexibleFaq[];
}

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  if (!faqs?.length) return null;

  const validFaqs = faqs.filter((faq) => faq?.title && faq?.richText);

  if (!validFaqs.length) return null;

  const faqJsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs.map(
      (faq): Question => ({
        "@type": "Question",
        name: faq.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: extractPlainTextFromRichText(faq.richText),
        } as Answer,
      }),
    ),
  };

  return <JsonLdScript data={faqJsonLd} id="faq-json-ld" />;
}

// Article JSON-LD Component

// Organization JSON-LD Component
interface OrganizationJsonLdProps {
  settings: LfdSettingsQueryResult;
}

export function OrganizationJsonLd({ settings }: OrganizationJsonLdProps) {
  if (!settings) return null;

  const baseUrl = getBaseUrl();

  const socialLinks = settings.socialLinks
    ? (Object.values(settings.socialLinks).filter(Boolean) as string[])
    : undefined;

  const organizationJsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteTitle,
    description: settings.siteDescription || undefined,
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/api/logo?w=400&h=120&color=%23ffffff&bg=transparent`,
    } as ImageObject,
    contactPoint: settings.contactEmail
      ? ({
          "@type": "ContactPoint",
          email: settings.contactEmail,
          contactType: "customer service",
        } as ContactPoint)
      : undefined,
    sameAs: socialLinks?.length ? socialLinks : undefined,
  };

  return <JsonLdScript data={organizationJsonLd} id="organization-json-ld" />;
}

// Website JSON-LD Component
interface WebSiteJsonLdProps {
  settings: LfdSettingsQueryResult;
}

export function WebSiteJsonLd({ settings }: WebSiteJsonLdProps) {
  if (!settings) return null;

  const baseUrl = getBaseUrl();

  const websiteJsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteTitle,
    description: settings.siteDescription || undefined,
    url: baseUrl,
    publisher: {
      "@type": "Organization",
      name: settings.siteTitle,
    } as Organization,
  };

  return <JsonLdScript data={websiteJsonLd} id="website-json-ld" />;
}

// Combined JSON-LD Component for pages with multiple structured data
interface CombinedJsonLdProps {
  settings?: LfdSettingsQueryResult;
  faqs?: FlexibleFaq[];
  includeWebsite?: boolean;
  includeOrganization?: boolean;
}

export async function CombinedJsonLd({
  includeWebsite = false,
  includeOrganization = false,
}: CombinedJsonLdProps) {
  const [res] = await handleErrors(
    client.fetch(lfdSettingsQuery, getSiteParams()),
  );

  const cleanSettings = stegaClean(res);
  return (
    <>
      {includeWebsite && cleanSettings && (
        <WebSiteJsonLd settings={cleanSettings} />
      )}
      {includeOrganization && cleanSettings && (
        <OrganizationJsonLd settings={cleanSettings} />
      )}
    </>
  );
}
