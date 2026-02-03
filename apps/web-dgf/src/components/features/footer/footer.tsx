import { sanityFetch } from "@workspace/sanity-config/live";
import { getSiteParams } from "@workspace/sanity-config/site";
import type {
  DgfFooterQueryResult,
  DgfGlobalSeoSettingsQueryResult,
} from "@workspace/sanity-config/types";
import { FooterShell } from "@workspace/ui/components/footer-shell";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "@workspace/ui/components/social-icons";
import type { RootProps } from "@workspace/ui/lib/data-attributes";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import LogoSvg from "@/components/elements/logo";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import {
  dgfFooterQuery,
  dgfGlobalSeoSettingsQuery,
} from "@/lib/sanity/queries";

interface SocialLinksProps {
  data: NonNullable<DgfGlobalSeoSettingsQueryResult>["socialLinks"];
  getDataAttribute: PresentationAttributeGetter;
}

type SettingsDataWithContact = NonNullable<DgfGlobalSeoSettingsQueryResult> & {
  addressLines?: string[] | null;
  contactEmail?: string | null;
  tollFreePhone?: string | null;
  officePhone?: string | null;
};

const FOOTER_GRADIENT_CLASSES = cn(
  "[--footer-bg-color:var(--color-brand-green)]",
  "[--footer-bg-shade:color-mix(in_oklab,var(--footer-bg-color)_85%,black_15%)]",
  "[--footer-bg-tint:color-mix(in_oklab,var(--footer-bg-color)_85%,white_15%)]",
  "bg-[image:linear-gradient(to_top_right,var(--footer-bg-shade),var(--footer-bg-tint))]",
  "bg-(--footer-bg-color)",
);

interface FooterProps {
  data: NonNullable<DgfFooterQueryResult>;
  settingsData: SettingsDataWithContact;
}

type PresentationAttributeGetter = (path?: string | null) => string | null;

function escapeKey(value?: string | null) {
  if (!value) return "";
  return value.replace(/"/g, '\\"');
}

function createDataAttributeGetter(
  documentId?: string | null,
  documentType?: string | null,
): PresentationAttributeGetter {
  return (path) => {
    if (!documentId || !documentType || !path) return null;
    return createPresentationDataAttribute({
      documentId,
      documentType,
      path,
    });
  };
}

function toDataProps<T extends HTMLElement = HTMLElement>(
  attribute?: string | null,
) {
  return attribute ? ({ "data-sanity": attribute } as RootProps<T>) : undefined;
}

export async function FooterServer() {
  const [response, settingsResponse] = await Promise.all([
    sanityFetch({
      query: dgfFooterQuery,
      params: getSiteParams(),
    }),
    sanityFetch({
      query: dgfGlobalSeoSettingsQuery,
      params: getSiteParams(),
    }),
  ]);

  if (!response?.data || !settingsResponse?.data) return <FooterSkeleton />;
  return <Footer data={response.data} settingsData={settingsResponse.data} />;
}

function SocialLinks({ data, getDataAttribute }: SocialLinksProps) {
  if (!data) return null;

  const socialLinks = [
    {
      url: data.instagram,
      Icon: InstagramIcon,
      label: "Follow us on Instagram",
      path: "socialLinks.instagram",
    },
    {
      url: data.facebook,
      Icon: FacebookIcon,
      label: "Follow us on Facebook",
      path: "socialLinks.facebook",
    },
    {
      url: data.twitter,
      Icon: XIcon,
      label: "Follow us on Twitter",
      path: "socialLinks.twitter",
    },
    {
      url: data.linkedin,
      Icon: LinkedinIcon,
      label: "Follow us on LinkedIn",
      path: "socialLinks.linkedin",
    },
    {
      url: data.youtube,
      Icon: YoutubeIcon,
      label: "Subscribe to our YouTube channel",
      path: "socialLinks.youtube",
    },
  ].filter((link) => link.url);

  if (!socialLinks.length) return null;

  return (
    <ul className="flex flex-wrap items-center gap-4 text-brand-green-text sm:gap-6">
      {socialLinks.map(({ url, Icon, label, path }) => (
        <li key={label} className="font-medium hover:text-brand-yellow">
          <Link
            href={url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            {...toDataProps<HTMLAnchorElement>(getDataAttribute(path))}
          >
            <Icon className="fill-[color:var(--color-brand-green-text)] hover:fill-[color:var(--color-brand-yellow)]" />
            <span className="sr-only">{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="mt-16">
      <section className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-7xl rounded-lg bg-brand-green p-6">
          <div className="rounded-lg border border-[color:var(--color-brand-yellow)]">
            <div className="h-[500px] lg:h-auto">
              <div className="flex flex-col items-center justify-between gap-10 text-center text-brand-green-text lg:flex-row lg:text-left">
                <div className="flex w-full max-w-90 shrink flex-col items-center justify-between gap-6 lg:items-start">
                  <div>
                    <span className="flex items-center justify-center gap-4 lg:justify-start">
                      <div className="h-[40px] w-[80px] animate-pulse rounded bg-muted" />
                    </span>
                    <div className="mt-6 h-16 w-full animate-pulse rounded bg-muted" />
                  </div>
                  <div className="flex items-center space-x-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-6 w-6 animate-pulse rounded bg-muted"
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 lg:gap-20">
                  {[1, 2, 3].map((col) => (
                    <div key={col}>
                      <div className="mb-6 h-6 w-24 animate-pulse rounded bg-muted" />
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                          <div
                            key={item}
                            className="h-4 w-full animate-pulse rounded bg-muted"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center lg:flex-row lg:items-center lg:text-left">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="flex justify-center gap-4 lg:justify-start">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>
    </footer>
  );
}

export function Footer({ data, settingsData }: FooterProps) {
  const footerDataAttributeGetter = createDataAttributeGetter(
    data?._id,
    data?._type,
  );
  const settingsAttributeGetter = createDataAttributeGetter(
    settingsData?._id,
    settingsData?._type,
  );

  const { columns } = data;
  const {
    siteTitle,
    socialLinks,
    addressLines,
    contactEmail,
    tollFreePhone,
    officePhone,
  } = settingsData;
  const year = new Date().getFullYear();

  const navColumns =
    columns?.map((column, columnIndex) => {
      const columnKey = escapeKey(column?._key);
      const columnPath = columnKey
        ? `columns[_key == "${columnKey}"]`
        : undefined;
      const columnTitlePath = columnPath ? `${columnPath}.title` : undefined;
      return {
        id: column?._key ?? `footer-column-${columnIndex}`,
        title: column?.title ? (
          <span
            {...toDataProps(
              columnTitlePath
                ? footerDataAttributeGetter(columnTitlePath)
                : null,
            )}
          >
            {column.title}
          </span>
        ) : undefined,
        items:
          column?.links?.map((link, linkIndex) => {
            const linkKey = escapeKey(link?._key);
            const linkPath =
              columnPath && linkKey
                ? `${columnPath}.links[_key == "${linkKey}"]`
                : undefined;
            return {
              id:
                link?._key ?? `footer-column-${columnIndex}-link-${linkIndex}`,
              content: (
                <Link
                  href={link.href ?? "#"}
                  target={link.openInNewTab ? "_blank" : undefined}
                  rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                  {...toDataProps<HTMLAnchorElement>(
                    linkPath ? footerDataAttributeGetter(linkPath) : null,
                  )}
                >
                  {link.name}
                </Link>
              ),
            };
          }) ?? [],
        rootProps: toDataProps(
          columnPath ? footerDataAttributeGetter(columnPath) : null,
        ),
      };
    }) ?? [];

  const addressBlock = addressLines?.length ? (
    <div className="mt-4 space-y-1 text-sm">
      {addressLines.map((line, index) => (
        <div
          key={`address-line-${index}`}
          {...toDataProps(settingsAttributeGetter(`addressLines[${index}]`))}
        >
          {line}
        </div>
      ))}
    </div>
  ) : null;

  const contactEntries = [
    contactEmail && {
      label: contactEmail,
      href: `mailto:${contactEmail}`,
      path: "contactEmail",
    },
    tollFreePhone && {
      label: `${tollFreePhone} (Toll Free)`,
      href: `tel:${tollFreePhone}`,
      path: "tollFreePhone",
    },
    officePhone && {
      label: officePhone,
      href: `tel:${officePhone}`,
      path: "officePhone",
    },
  ].filter(Boolean) as { label: string; href: string; path: string }[];

  const contactBlock = contactEntries.length ? (
    <div className="text-sm">
      {contactEntries.map((entry) => (
        <div key={entry.path}>
          <a
            href={entry.href}
            className="hover:text-brand-yellow"
            {...toDataProps<HTMLAnchorElement>(
              settingsAttributeGetter(entry.path),
            )}
          >
            {entry.label}
          </a>
        </div>
      ))}
    </div>
  ) : null;

  const brandBlock = (
    <div className="space-y-4 text-left">
      <Link
        href="/"
        aria-label={siteTitle}
        className="block w-[180px] text-brand-yellow"
      >
        <LogoSvg className="h-auto w-full" />
      </Link>
      {addressBlock}
    </div>
  );

  const socialBlock = socialLinks ? (
    <SocialLinks
      data={socialLinks}
      getDataAttribute={settingsAttributeGetter}
    />
  ) : null;

  return (
    <FooterShell
      className={cn("mt-20", FOOTER_GRADIENT_CLASSES)}
      brandBlock={brandBlock}
      contactBlock={contactBlock}
      socialBlock={socialBlock}
      navColumns={navColumns}
      legalText={
        <p>
          © {year} {siteTitle}. All rights reserved.
        </p>
      }
      legalItems={[
        {
          id: "terms",
          content: (
            <Link href="/terms-and-conditions">Terms and Conditions</Link>
          ),
        },
        {
          id: "privacy",
          content: <Link href="/privacy-policy">Privacy Policy</Link>,
        },
        {
          id: "cookie",
          content: <Link href="/cookie-policy">Cookie Policy</Link>,
        },
      ]}
      rootProps={toDataProps(footerDataAttributeGetter("columns"))}
    />
  );
}
