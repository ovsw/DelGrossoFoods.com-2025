import { BookOpen, ShoppingCart } from "lucide-react";
import { stegaClean } from "next-sanity";
import type { ReactNode } from "react";
import type { JSX } from "react";

import { BackLink } from "@/components/elements/back-link";
import { RichText } from "@/components/elements/rich-text";
import { SanityButtons } from "@/components/elements/sanity-buttons";
import { HeroLayout } from "@/components/layouts/hero-layout";
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

  // Line/badge: visible uses raw; logic uses cleaned
  const rawLine = sauce.line ?? "";
  const cleanedLine = stegaClean(rawLine);
  const cleanedLineStr =
    typeof cleanedLine === "string"
      ? cleanedLine.trim()
      : String(rawLine).trim();
  const isPremiumLine = cleanedLineStr === "Ultra-Premium";
  const badgeLabel = isPremiumLine
    ? "La Famiglia DelGrosso"
    : String(rawLine).trim();

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
      <BackLink href="/sauces" label="All Sauces" />
      <HeroLayout
        title={sauceName}
        eyebrow={badgeLabel}
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
        className="mt-6"
      >
        <RichText
          richText={sauce.description}
          className="text-sm italic text-brand-green/90 md:text-lg max-w-2xl lg:max-w-none"
        />
        <div className="flex justify-center lg:justify-start">
          <SanityButtons
            buttons={buttons}
            buttonClassName="w-full sm:w-auto"
            className="grid w-full max-w-md gap-3 sm:w-fit sm:grid-flow-col"
          />
        </div>
      </HeroLayout>
    </>
  );
}
