import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { BookOpen, ShoppingCart } from "lucide-react";
import { stegaClean } from "next-sanity";
import type { ReactNode } from "react";
import type { JSX } from "react";

import { BackLink } from "@/components/elements/back-link";
import { RichText } from "@/components/elements/rich-text";
import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";
import { getLineDisplayName, toLineSlug } from "@/config/sauce-taxonomy";
import type { GetSauceBySlugQueryResult } from "@/lib/sanity/sanity.types";
import type { SanityButtonProps } from "@/types";

interface SauceHeroSectionProps {
  readonly sauce: NonNullable<GetSauceBySlugQueryResult>;
}

export function SauceHeroSection({
  sauce,
}: SauceHeroSectionProps): JSX.Element {
  // Name: visible uses raw; logic/alt use cleaned
  const rawName = sauce.name ?? "";
  const cleanedName = stegaClean(rawName);
  const sauceName = String(rawName).trim();

  const rawColorHex = sauce.colorHex ?? "";
  const cleanedColorHex = stegaClean(rawColorHex).trim();
  const hasValidHeroColor = /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(cleanedColorHex);

  const rawLine = sauce.line ?? "";
  const lineSlug = toLineSlug(rawLine);
  const lineSourceLabel =
    lineSlug === "original"
      ? "Del Grosso's Original"
      : lineSlug === "organic"
        ? "Del Grosso's Organic"
        : lineSlug === "premium"
          ? "La Famiglia Del Grosso's"
          : getLineDisplayName(rawLine);

  const buttons: (SanityButtonProps & { icon?: ReactNode })[] = [
    {
      _key: "order-online",
      _type: "button" as const,
      text: "Order Online",
      variant: null,
      href: "#related-products",
      openInNewTab: false,
      icon: <ShoppingCart className="size-4" aria-hidden="true" />,
    },
    {
      _key: "see-recipes",
      _type: "button" as const,
      text: "See Recipes",
      variant: null,
      href: "#related-recipes",
      openInNewTab: false,
      icon: <BookOpen className="size-4" aria-hidden="true" />,
    },
  ];

  const backgroundImage =
    "/images/bg/counter-wall-5-no-bottom-border-ultrawide-p-2600-taller.jpg";

  const image = sauce.mainImage
    ? {
        id: sauce.mainImage.id,
        preview: sauce.mainImage.preview,
        hotspot: sauce.mainImage.hotspot,
        crop: sauce.mainImage.crop,
        alt: sauce.mainImage.alt,
      }
    : null;

  const altText = image?.alt || `${cleanedName} sauce jar`;

  return (
    <Section
      spacingTop="page-top"
      spacingBottom="default"
      fullBleed
      className={cn(
        "relative isolate overflow-hidden mt-6 [&_.hero-description]:mt-4 lg:[&_.hero-description]:mt-6",
        backgroundImage && "bg-cover bg-bottom",
      )}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-white/10" aria-hidden="true" />

      <div className="container relative mx-auto max-w-6xl px-4 md:px-0">
        <div className="mb-6 flex justify-center lg:justify-start">
          <BackLink
            href="/sauces"
            label="All Sauces"
            className="!text-foreground hover:!text-foreground focus-visible:!ring-th-dark-900/40"
          />
        </div>

        <div className="grid items-center gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          <div className="flex flex-col justify-center gap-6 text-center lg:text-start">
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <Eyebrow
                text={lineSourceLabel}
                className="border-brand-green text-th-dark-900/70"
              />
              <h1
                className={cn(
                  "text-4xl leading-tight font-semibold text-balance lg:text-6xl",
                )}
                style={
                  hasValidHeroColor ? { color: cleanedColorHex } : undefined
                }
              >
                {sauceName}
              </h1>
            </div>

            <RichText
              richText={sauce.description}
              className="hero-description text-base italic text-foreground md:text-lg max-w-2xl lg:max-w-none"
            />

            <div className="flex justify-center lg:justify-start">
              <SanityButtons
                buttons={buttons}
                buttonClassName="w-full min-[340px]:w-auto"
                className="grid w-full max-w-md gap-3 min-[340px]:w-fit min-[340px]:grid-flow-col"
              />
            </div>
          </div>

          {image?.id ? (
            <div className="flex w-full justify-center">
              <SanityImage
                image={image}
                alt={altText}
                width={420}
                height={560}
                respectSanityCrop={false}
                className="max-h-118 w-full object-contain"
              />
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
