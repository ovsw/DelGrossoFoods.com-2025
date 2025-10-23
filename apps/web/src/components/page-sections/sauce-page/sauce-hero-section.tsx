import { BookOpen, ShoppingCart } from "lucide-react";
import { stegaClean } from "next-sanity";
import type { ReactNode } from "react";
import type { JSX } from "react";

import { BackLink } from "@/components/elements/back-link";
import { RichText } from "@/components/elements/rich-text";
import { SanityButtons } from "@/components/elements/sanity-buttons";
import { HeroLayout } from "@/components/layouts/hero-layout";
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

  return (
    <>
      <HeroLayout
        prelude={
          <BackLink
            href="/sauces"
            label="All Sauces"
            className="!text-foreground hover:!text-foreground focus-visible:!ring-th-dark-900/40"
          />
        }
        title={sauceName}
        eyebrow={lineSourceLabel}
        image={
          sauce.mainImage
            ? {
                id: sauce.mainImage.id,
                preview: sauce.mainImage.preview,
                hotspot: sauce.mainImage.hotspot,
                crop: sauce.mainImage.crop,
                alt: sauce.mainImage.alt || `${cleanedName} sauce jar`,
              }
            : null
        }
        backgroundImage="/images/bg/counter-wall-5-no-bottom-border-ultrawide-p-2600-taller.jpg"
        fullBleed
        titleStyle={hasValidHeroColor ? { color: cleanedColorHex } : undefined}
        className="mt-6 [&_.hero-description]:mt-4 lg:[&_.hero-description]:mt-6"
      >
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
      </HeroLayout>
    </>
  );
}
