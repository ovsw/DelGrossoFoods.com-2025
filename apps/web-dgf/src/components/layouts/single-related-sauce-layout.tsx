import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import type { ReactElement } from "react";

import { SanityImage } from "@/components/elements/sanity-image";
import { getLineBadge, getTypeBadge } from "@/config/sauce-taxonomy";
import { buildHref } from "@/lib/list/href";
import type { SauceListItem } from "@/types";

export interface SingleRelatedSauceLayoutProps {
  readonly item: SauceListItem;
}

export function SingleRelatedSauceLayout({
  item,
}: SingleRelatedSauceLayoutProps): ReactElement {
  const lineBadge = getLineBadge(item.line);
  const typeBadge = getTypeBadge(item.category);
  const href = buildHref("/sauces", item.slug);

  const name = stegaClean(item.name);
  const alt = stegaClean(item.mainImage?.alt || `${name} sauce`);
  const descriptionVisible = item.descriptionPlain || "";
  const cleanedDescription = stegaClean(descriptionVisible);

  return (
    <div className="mt-16">
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
            <Eyebrow text="Featured sauce" />

            <h3 className="mt-4 text-3xl font-semibold text-balance md:text-5xl">
              {item.name}
            </h3>

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

            <p className="mt-4">
              {cleanedDescription && cleanedDescription.trim().length > 0
                ? descriptionVisible
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
    </div>
  );
}
