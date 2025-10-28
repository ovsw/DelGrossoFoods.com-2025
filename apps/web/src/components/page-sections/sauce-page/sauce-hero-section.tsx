import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { BookOpen, ShoppingCart } from "lucide-react";
import { stegaClean } from "next-sanity";
import type { ReactNode } from "react";
import type { JSX } from "react";

// import { BackLink } from "@/components/elements/back-link";
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
  const useSoftTextShadow =
    cleanedColorHex === "#0c8189" || cleanedColorHex === "#ffacee";

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
      className={cn("relative", backgroundImage && "bg-cover bg-bottom")}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="container  relative mx-auto max-w-6xl px-4 lg:pl-18">
        <div className="grid items-center gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          {/* Text stack: pure document flow with margins for grouping */}
          <div className="text-center lg:text-start max-w-prose mx-auto lg:mx-0">
            {/* Identity: eyebrow + title (tight proximity via margin) */}
            <Eyebrow
              text={lineSourceLabel}
              className="mb-1.5 sm:mb-5 border-brand-green text-th-dark-900/70"
            />
            <h1
              className={cn(
                "mx-auto max-w-[10ch] text-5xl leading-[1.1] font-bold text-balance lg:mx-0 lg:max-w-[13ch] lg:text-6xl lg:leading-[1]",
                useSoftTextShadow
                  ? "text-shadow-[1px_1px_1px_rgb(245_245_245_/_0.60),-1px_-1px_1px_rgb(245_245_245_/_0.60),-3px_-3px_20px_rgb(245_245_245_/_0.35),0px_1px_51px_rgb(245_245_245_/_0.25),0px_0px_101px_rgb(245_245_245_/_0.35),0px_0px_13px_rgb(245_245_245_/_0.15)]"
                  : "text-shadow-[1px_1px_1px_rgb(245_245_245_/_0.60),-1px_-1px_1px_rgb(245_245_245_/_0.60),-3px_-3px_20px_rgb(245_245_245_/_0.35),0px_1px_51px_rgb(245_245_245_/_0.75),0px_0px_101px_rgb(245_245_245_/_0.35),0px_0px_13px_rgb(245_245_245_/_0.15)]",
              )}
              style={hasValidHeroColor ? { color: cleanedColorHex } : undefined}
            >
              {sauceName}
            </h1>

            {/* Support: description (moderate from title) */}
            <RichText
              richText={sauce.description}
              className="mt-5 sm:mt-6 lg:mt-7  italic text-foreground/80 md:text-lg max-w-[50ch]"
            />

            {/* Actions: CTAs (largest from copy) */}
            <SanityButtons
              buttons={buttons}
              buttonClassName="w-full min-[350px]:w-auto"
              className="mt-7 justify-center lg:justify-start flex-wrap min-[350px]:flex-row"
              buttonVariants={["default", "secondary"]}
            />
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
