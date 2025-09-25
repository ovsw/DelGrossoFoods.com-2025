import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { BookOpen, ShoppingCart } from "lucide-react";
import { stegaClean } from "next-sanity";
import type { ReactNode } from "react";

import { RichText } from "@/components/elements/rich-text";
import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";
import type { GetSauceBySlugQueryResult } from "@/lib/sanity/sanity.types";
import type { SanityButtonProps } from "@/types";

interface SauceHeroProps {
  readonly sauce: NonNullable<GetSauceBySlugQueryResult>;
}

export function SauceHero({ sauce }: SauceHeroProps) {
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

  // Author name: visible uses raw; alt/logic use cleaned
  const rawAuthorName = sauce.authorName ?? null;
  const cleanedAuthor = rawAuthorName ? stegaClean(rawAuthorName) : null;
  const authorName = rawAuthorName ? String(rawAuthorName).trim() : null;
  const authorNameForAlt = rawAuthorName
    ? typeof cleanedAuthor === "string"
      ? cleanedAuthor.trim()
      : String(rawAuthorName).trim()
    : null;

  const buttons: (SanityButtonProps & { icon?: ReactNode })[] = [
    {
      _key: "order-online",
      _type: "button" as const,
      text: "Order Online",
      variant: "default" as const,
      href: "#related-products",
      openInNewTab: false,
      icon: <ShoppingCart className="size-4" aria-hidden="true" />,
    },
    {
      _key: "see-recipes",
      _type: "button" as const,
      text: "See Recipes",
      variant: "secondary" as const,
      href: "#related-recipes",
      openInNewTab: false,
      icon: <BookOpen className="size-4" aria-hidden="true" />,
    },
  ];

  const authorImage = sauce.authorImage;
  const showAuthor = isPremiumLine && !!authorNameForAlt && authorImage?.id;

  return (
    <Section
      spacingTop="page-top"
      spacingBottom="default"
      className="relative isolate overflow-hidden bg-[url('/images/bg/counter-wall-5-no-bottom-border-ultrawide-p-2600.jpg')] bg-cover bg-bottom"
    >
      <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
      <div className="container relative mx-auto max-w-6xl px-4 md:px-0">
        <div className="grid items-center gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          <div className="flex flex-col justify-center gap-6 text-center lg:text-start">
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <div className="flex gap-4 lg:flex-row lg:items-stretch lg:justify-start">
                {showAuthor ? (
                  <div className="rounded-sm">
                    <SanityImage
                      image={authorImage}
                      alt={
                        authorNameForAlt
                          ? `${authorNameForAlt} portrait`
                          : "Author portrait"
                      }
                      className="w-24 lg:w-30 aspect-[137/160]"
                    />
                  </div>
                ) : null}

                {isPremiumLine && showAuthor ? (
                  <h1 className="flex flex-col text-left text-4xl leading-tight font-semibold text-balance lg:justify-end ">
                    <Eyebrow
                      text={badgeLabel}
                      className="border-brand-green text-th-dark-900/70 mb-4"
                    />
                    <span className="lg:text-6xl">{authorName}</span>
                    <span className="lg:text-start lg:text-4xl">
                      {sauceName}
                    </span>
                  </h1>
                ) : (
                  <h1 className="text-4xl leading-tight font-semibold text-balance lg:text-start lg:text-6xl">
                    {sauceName}
                  </h1>
                )}
              </div>
              <RichText
                richText={sauce.description}
                className="text-sm italic text-brand-green/90 md:text-lg max-w-2xl mx-auto lg:max-w-none"
              />
            </div>

            <div className="flex justify-center lg:justify-start">
              <SanityButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="grid w-full max-w-md gap-3 sm:w-fit sm:grid-flow-col"
              />
            </div>
          </div>

          {sauce.mainImage?.id ? (
            <div className="flex w-full justify-center ">
              <SanityImage
                image={sauce.mainImage}
                alt={
                  typeof cleanedName === "string" && cleanedName.trim()
                    ? `${cleanedName.trim()} sauce jar`
                    : "Sauce jar"
                }
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
