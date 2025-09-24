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

function buildSearchHref(basePath: string, query: string): string {
  const cleaned = stegaClean(query);
  const name = typeof cleaned === "string" ? cleaned : String(query);
  if (!name) return basePath;
  const encoded = encodeURIComponent(name);
  return `${basePath}?search=${encoded}`;
}

export function SauceHero({ sauce }: SauceHeroProps) {
  const rawName = sauce.name ?? "";
  const cleanedName = stegaClean(rawName);
  const sauceNameRaw =
    typeof cleanedName === "string" ? cleanedName : String(rawName ?? "");
  const sauceName = sauceNameRaw.trim();

  const rawLine = sauce.line ?? "";
  const cleanedLine = stegaClean(rawLine);
  const cleanLineRaw =
    typeof cleanedLine === "string" ? cleanedLine : String(rawLine ?? "");
  const cleanLine = cleanLineRaw.trim();
  const isPremiumLine = cleanLine === "Ultra-Premium";
  const badgeLabel = isPremiumLine ? "La Famiglia DelGrosso" : cleanLine;

  const authorName = sauce.authorName
    ? (() => {
        const cleanedAuthor = stegaClean(sauce.authorName);
        const author =
          typeof cleanedAuthor === "string"
            ? cleanedAuthor
            : String(sauce.authorName);
        return author.trim();
      })()
    : null;

  const buttons: (SanityButtonProps & { icon?: ReactNode })[] = [
    {
      _key: "order-online",
      _type: "button" as const,
      text: "Order Online",
      variant: "default" as const,
      href: buildSearchHref("/store", sauceName),
      openInNewTab: false,
      icon: <ShoppingCart className="size-4" aria-hidden="true" />,
    },
    {
      _key: "see-recipes",
      _type: "button" as const,
      text: "See Recipes",
      variant: "secondary" as const,
      href: buildSearchHref("/recipes", sauceName),
      openInNewTab: false,
      icon: <BookOpen className="size-4" aria-hidden="true" />,
    },
  ];

  const authorImage = sauce.authorImage;
  const showAuthor = isPremiumLine && authorName && authorImage?.id;

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
                        authorName
                          ? `${authorName} portrait`
                          : "Author portrait"
                      }
                      className="w-30 aspect-[137/160]"
                    />
                  </div>
                ) : null}

                {isPremiumLine && showAuthor ? (
                  <h1 className="flex flex-col gap-y-2 text-left text-4xl leading-tight font-semibold text-balance lg:justify-end ">
                    <Eyebrow
                      text={badgeLabel}
                      className="border-brand-green text-th-dark-900/70"
                    />
                    <span className="lg:text-6xl text-[#128f8b] ">
                      {authorName}
                    </span>
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
                className="text-sm italic text-brand-green/90 md:text-lg"
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
                alt={sauceName ? `${sauceName} sauce jar` : "Sauce jar"}
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
