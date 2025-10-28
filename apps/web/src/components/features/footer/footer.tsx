import Link from "next/link";

import LogoSvg from "@/components/elements/logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/elements/social-icons";
import { sanityFetch } from "@/lib/sanity/live";
import { queryFooterData, queryGlobalSeoSettings } from "@/lib/sanity/query";
import type {
  QueryFooterDataResult,
  QueryGlobalSeoSettingsResult,
} from "@/lib/sanity/sanity.types";

interface SocialLinksProps {
  data: NonNullable<QueryGlobalSeoSettingsResult>["socialLinks"];
}

type SettingsDataWithContact = NonNullable<QueryGlobalSeoSettingsResult> & {
  addressLines?: string[] | null;
  contactEmail?: string | null;
  tollFreePhone?: string | null;
  officePhone?: string | null;
};

interface FooterProps {
  data: NonNullable<QueryFooterDataResult>;
  settingsData: SettingsDataWithContact;
}

export async function FooterServer() {
  const [response, settingsResponse] = await Promise.all([
    sanityFetch({
      query: queryFooterData,
    }),
    sanityFetch({
      query: queryGlobalSeoSettings,
    }),
  ]);

  if (!response?.data || !settingsResponse?.data) return <FooterSkeleton />;
  return <Footer data={response.data} settingsData={settingsResponse.data} />;
}

function SocialLinks({ data }: SocialLinksProps) {
  if (!data) return null;

  const { facebook, twitter, instagram, youtube, linkedin } = data;

  const socialLinks = [
    {
      url: instagram,
      Icon: InstagramIcon,
      label: "Follow us on Instagram",
    },
    {
      url: facebook,
      Icon: FacebookIcon,
      label: "Follow us on Facebook",
    },
    { url: twitter, Icon: XIcon, label: "Follow us on Twitter" },
    {
      url: linkedin,
      Icon: LinkedinIcon,
      label: "Follow us on LinkedIn",
    },
    {
      url: youtube,
      Icon: YoutubeIcon,
      label: "Subscribe to our YouTube channel",
    },
  ].filter((link) => link.url);

  return (
    <ul className="flex flex-wrap items-center gap-4 sm:gap-6 text-brand-green-text">
      {socialLinks.map(({ url, Icon, label }, index) => (
        <li
          key={`social-link-${url}-${index.toString()}`}
          className="font-medium hover:text-brand-yellow"
        >
          <Link
            href={url ?? "#"}
            target="_blank"
            prefetch={false}
            rel="noopener noreferrer"
            aria-label={label}
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
                      <div className="h-[40px] w-[80px] bg-muted rounded animate-pulse" />
                    </span>
                    <div className="mt-6 h-16 w-full bg-muted rounded animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-6 w-6 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 lg:gap-20">
                  {[1, 2, 3].map((col) => (
                    <div key={col}>
                      <div className="mb-6 h-6 w-24 bg-muted rounded animate-pulse" />
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                          <div
                            key={item}
                            className="h-4 w-full bg-muted rounded animate-pulse"
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
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          <div className="flex justify-center gap-4 lg:justify-start">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </section>
    </footer>
  );
}

function Footer({ data, settingsData }: FooterProps) {
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

  return (
    <footer className="mt-20">
      <section className="container mx-auto">
        <div className="mx-auto max-w-7xl rounded-none bg-brand-green px-4 py-5 md:rounded-lg md:py-4">
          <div className="rounded-lg border border-brand-yellow">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 p-6 text-center text-brand-green-text md:text-left lg:flex-row">
              <div className="flex w-full shrink-0 flex-col items-start justify-between gap-6 md:grid md:grid-cols-12 md:items-end md:gap-x-6 md:gap-y-4 md:text-left lg:flex lg:flex-col lg:items-start lg:flex-none lg:w-[240px] xl:w-[300px] 2xl:w-[340px]">
                {/* Logo + address (left) */}
                <div className="md:col-span-4">
                  <span className="flex items-center justify-start gap-4">
                    <Link
                      href="/"
                      aria-label={siteTitle}
                      className="block w-[180px] text-[color:var(--color-brand-yellow)]"
                    >
                      <LogoSvg className="w-full h-auto" />
                    </Link>
                  </span>
                  {addressLines?.length ? (
                    <div
                      data-c="footer_address"
                      className="mt-6 text-sm md:mt-4"
                    >
                      {addressLines.map((line, idx) => (
                        <div key={`addr-${idx}`}>{line}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
                {/* Address + contact */}
                {(contactEmail || tollFreePhone || officePhone) && (
                  <div className="md:col-span-4">
                    <div
                      data-c="footer_contact"
                      className="text-sm flex-grow align-items-stretch md:mt-0"
                    >
                      {contactEmail && (
                        <div>
                          {/* Email:{" "} */}
                          <a
                            href={`mailto:${contactEmail}`}
                            className="hover:text-brand-yellow"
                          >
                            {contactEmail}
                          </a>
                        </div>
                      )}
                      {tollFreePhone && (
                        <div>
                          {/* Toll Free:{" "} */}
                          <a
                            href={`tel:${tollFreePhone}`}
                            className="hover:text-brand-yellow"
                          >
                            {tollFreePhone} (Toll Free)
                          </a>
                        </div>
                      )}
                      {officePhone && (
                        <div>
                          {/* Office:{" "} */}
                          <a
                            href={`tel:${officePhone}`}
                            className="hover:text-brand-yellow"
                          >
                            {officePhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Socials */}
                {socialLinks && (
                  <div className="md:col-span-4 md:self-end lg:self-start">
                    <SocialLinks data={socialLinks} />
                  </div>
                )}
              </div>
              {Array.isArray(columns) && columns?.length > 0 && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-y-8 gap-x-6 lg:gap-x-10 xl:gap-x-16 2xl:gap-x-24 text-left justify-items-start">
                  {columns.map((column, index) => (
                    <div key={`column-${column?._key}-${index}`}>
                      <h3 className="mb-6 font-semibold text-brand-yellow text-lg text-left">
                        {column?.title}
                      </h3>
                      {column?.links && column?.links?.length > 0 && (
                        <ul className="space-y-4 text-sm text-left">
                          {column?.links?.map((link, index) => (
                            <li
                              key={`${link?._key}-${index}-column-${column?._key}`}
                              className="font-medium hover:text-brand-yellow text-left"
                            >
                              <Link
                                href={link.href ?? "#"}
                                target={
                                  link.openInNewTab ? "_blank" : undefined
                                }
                                rel={
                                  link.openInNewTab
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                              >
                                {link.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-0 border-0 py-4 md:mt-14 md:border-t md:border-th-dark-900 md:py-8">
          <div className="mx-auto flex max-w-7xl flex-col  justify-between gap-4 px-4 text-center text-sm font-normal text-th-dark-750/80 md:px-6 lg:flex-row lg:items-center lg:text-left">
            <p>
              © {year} {siteTitle}. All rights reserved.
            </p>
            <ul className="flex justify-center gap-4 lg:justify-start">
              <li className="hover:text-th-dark-900 hover:underline">
                <Link href="/terms-and-conditions">Terms and Conditions</Link>
              </li>
              <li className="hover:text-th-dark-900 hover:underline">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="hover:text-th-dark-900 hover:underline">
                <Link href="/cookie-policy">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </footer>
  );
}
