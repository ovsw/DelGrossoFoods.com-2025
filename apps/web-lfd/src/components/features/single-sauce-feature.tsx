"use client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import { getLineBadge, getTypeBadge } from "@/config/sauce-taxonomy";
import { buildHref } from "@/lib/list/href";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import type { SauceListItem } from "@/types";

type Props = {
  item: SauceListItem;
};

/**
 * Featured single-sauce layout for product detail pages.
 * - Left: large jar image + badges
 * - Right: heading, short description, and CTA
 */
export function SingleSauceFeature({ item }: Props) {
  const lineBadge = getLineBadge(item.line);
  const typeBadge = getTypeBadge(item.category);
  const href = buildHref("/sauces", item.slug);

  const name = stegaClean(item.name);
  const alt = stegaClean(item.mainImage?.alt || `${name} sauce`);
  const rawDescription = item.descriptionPlain ?? "";
  const cleanedDescription = stegaClean(rawDescription);
  const hasDescription =
    typeof cleanedDescription === "string" &&
    cleanedDescription.trim().length > 0;
  const descriptionAttribute = hasDescription
    ? createPresentationDataAttribute({
        documentId: item._id,
        documentType: item._type,
        path: "descriptionPlain",
      })
    : null;

  return (
    <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5 flex justify-center lg:justify-start">
        <div className="aspect-[33/40] relative overflow-hidden mx-auto w-full max-w-[360px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-none">
          {item.mainImage?.id ? (
            <SanityImage
              image={item.mainImage}
              respectSanityCrop
              width={800}
              height={968}
              alt={alt}
              className="absolute inset-0 h-full w-full object-contain"
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 40vw"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="text-start">
          <Eyebrow text="Sauce Info" />

          <h2 className="heading-section">{item.name}</h2>
          <div className="my-6 flex flex-wrap items-center gap-1.5">
            <Badge
              text={lineBadge.text}
              variant={lineBadge.variant}
              className="text-xs"
            />
            <Badge
              text={typeBadge.text}
              variant={typeBadge.variant}
              className="text-xs"
            />
          </div>
          <p className="mt-4" data-sanity={descriptionAttribute ?? undefined}>
            {hasDescription
              ? rawDescription
              : "Build your next meal with this family favorite from La Famiglia DelGrosso."}
          </p>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link href={href} aria-label={`View ${name} sauce`}>
                View sauce
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
