import { Section } from "@workspace/ui/components/section";
import { Building2, Globe, Mail, Phone } from "lucide-react";
import { createDataAttribute, stegaClean } from "next-sanity";

import { DecoratedSplitLayout } from "@/components/layouts/decorated-split-layout";
import { dataset, projectId, studioUrl } from "@/config";

import { ContactForm } from "./contact-form";

type PhoneNumber = {
  _key?: string;
  display?: string | null;
  dial?: string | null;
};

type ContactInformation = {
  responseTimeNotice?: string | null;
  companyName?: string | null;
  addressLines?: string[] | null;
  phoneNumbers?: PhoneNumber[] | null;
  email?: string | null;
  websiteLabel?: string | null;
  websiteUrl?: string | null;
} | null;

interface ContactFormSectionProps {
  title: string;
  description: string;
  contactInformation?: ContactInformation;
  siteSettingsId?: string | null;
}

const DEFAULT_RESPONSE_TIME_NOTICE = "We typically respond within 24-48 hours";
const DEFAULT_COMPANY_NAME = "DelGrosso Foods Inc.";
const DEFAULT_ADDRESS_LINES = [
  "632 Sauce Factory Drive",
  "P.O. Box 337",
  "Tipton, PA 16684",
] as const;
const DEFAULT_PHONE_NUMBERS: PhoneNumber[] = [
  {
    _key: "primary",
    display: "814-684-5880",
    dial: "814-684-5880",
  },
  {
    _key: "toll-free",
    display: "1-800-521-5880 (Toll Free)",
    dial: "1-800-521-5880",
  },
];
const DEFAULT_EMAIL = "info@delgrossosauce.com";
const DEFAULT_WEBSITE_LABEL = "www.delgrossos.com";
const DEFAULT_WEBSITE_URL = "https://www.delgrossos.com";

function hasValue(value: string | null | undefined): value is string {
  return typeof value === "string" && stegaClean(value).trim().length > 0;
}

function buildTelHref(
  display?: string | null,
  dial?: string | null,
): string | null {
  const source = dial ?? display;
  if (!source) {
    return null;
  }
  const sanitized = stegaClean(source).trim();
  if (!sanitized) {
    return null;
  }
  const normalized = sanitized.replace(/(?!^\+)[^\d]/g, "");
  if (!normalized) {
    return null;
  }
  return `tel:${normalized}`;
}

function buildMailHref(value?: string | null): string | null {
  if (!value) {
    return null;
  }
  const cleaned = stegaClean(value).trim();
  return cleaned ? `mailto:${cleaned}` : null;
}

function buildWebsiteHref(value?: string | null): string | null {
  if (!value) {
    return null;
  }
  const cleaned = stegaClean(value).trim();
  return cleaned || null;
}

export function ContactFormSection({
  title,
  description,
  contactInformation,
  siteSettingsId,
}: ContactFormSectionProps) {
  const info = contactInformation ?? null;

  const responseTimeNotice = hasValue(info?.responseTimeNotice)
    ? info?.responseTimeNotice
    : DEFAULT_RESPONSE_TIME_NOTICE;

  const companyName = hasValue(info?.companyName)
    ? info?.companyName
    : DEFAULT_COMPANY_NAME;

  const addressLines = Array.isArray(info?.addressLines)
    ? info.addressLines.filter((line): line is string => hasValue(line))
    : [];
  const displayAddressLines =
    addressLines.length > 0 ? addressLines : [...DEFAULT_ADDRESS_LINES];

  const phoneNumbers = Array.isArray(info?.phoneNumbers)
    ? info.phoneNumbers.filter((phone) => hasValue(phone?.display))
    : [];
  const phonesSource =
    phoneNumbers.length > 0 ? phoneNumbers : DEFAULT_PHONE_NUMBERS;
  const phonesToRender = phonesSource.reduce<
    Array<{ key: string; href: string; display: string }>
  >((entries, phone, index) => {
    if (!phone.display) {
      return entries;
    }
    const href = buildTelHref(phone.display, phone.dial);
    if (!href) {
      return entries;
    }
    entries.push({
      key: phone._key ?? `${index}-${href}`,
      href,
      display: phone.display,
    });
    return entries;
  }, []);

  const emailDisplay = hasValue(info?.email) ? info?.email : DEFAULT_EMAIL;
  const emailHref =
    buildMailHref(info?.email) ?? buildMailHref(DEFAULT_EMAIL) ?? undefined;

  const websiteHref =
    buildWebsiteHref(info?.websiteUrl) ??
    buildWebsiteHref(DEFAULT_WEBSITE_URL) ??
    DEFAULT_WEBSITE_URL;
  const websiteLabel = hasValue(info?.websiteLabel)
    ? info?.websiteLabel
    : hasValue(info?.websiteUrl)
      ? info?.websiteUrl
      : DEFAULT_WEBSITE_LABEL;
  const corporateWebsiteDataAttribute =
    siteSettingsId && siteSettingsId.length > 0
      ? createDataAttribute({
          id: siteSettingsId,
          type: "settings",
          path: "corporateWebsiteUrl",
          baseUrl: studioUrl,
          projectId,
          dataset,
        }).toString()
      : undefined;

  return (
    <Section spacingTop="page-top" spacingBottom="default">
      <DecoratedSplitLayout
        decoratedColumn="main"
        mainPosition="left"
        variant="italian-ingredients"
        showDecoration={false}
      >
        <DecoratedSplitLayout.Main>
          <h1 className="text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg/8 text-muted-foreground">{description}</p>

          {responseTimeNotice ? (
            <div className="mt-6 rounded-lg border border-brand-green/20 bg-brand-green/5 p-4">
              <p className="text-sm font-medium text-brand-green">
                {responseTimeNotice}
              </p>
            </div>
          ) : null}

          <dl className="mt-10 space-y-4 text-base/7 text-muted-foreground">
            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Address</span>
                <Building2
                  aria-hidden="true"
                  className="h-7 w-6 text-muted-foreground/60"
                />
              </dt>
              <dd>
                {companyName ? (
                  <strong className="text-foreground">{companyName}</strong>
                ) : null}
                {displayAddressLines.map((line, index) => (
                  <span key={`${line}-${index}`} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>

            {phonesToRender.length > 0 ? (
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <Phone
                    aria-hidden="true"
                    className="h-7 w-6 text-muted-foreground/60"
                  />
                </dt>
                <dd className="flex flex-col gap-2">
                  {phonesToRender.map((phone) => (
                    <a
                      key={phone.key}
                      href={phone.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {phone.display}
                    </a>
                  ))}
                </dd>
              </div>
            ) : null}

            {emailDisplay && emailHref ? (
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <Mail
                    aria-hidden="true"
                    className="h-7 w-6 text-muted-foreground/60"
                  />
                </dt>
                <dd>
                  <a
                    href={emailHref}
                    className="transition-colors hover:text-foreground"
                  >
                    {emailDisplay}
                  </a>
                </dd>
              </div>
            ) : null}

            {websiteLabel && websiteHref ? (
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Website</span>
                  <Globe
                    aria-hidden="true"
                    className="h-7 w-6 text-muted-foreground/60"
                  />
                </dt>
                <dd>
                  <a
                    href={websiteHref}
                    className="transition-colors hover:text-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-sanity={corporateWebsiteDataAttribute}
                  >
                    {websiteLabel}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </DecoratedSplitLayout.Main>

        <DecoratedSplitLayout.Secondary>
          <ContactForm />
        </DecoratedSplitLayout.Secondary>
      </DecoratedSplitLayout>
    </Section>
  );
}
