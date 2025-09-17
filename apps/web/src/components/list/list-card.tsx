"use client";
import { Badge, type BadgeVariant } from "@workspace/ui/components/badge";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import type { SanityImageProps as SanityImageData } from "@/types";

type BadgeSpec = { text: string; variant?: BadgeVariant };

type ListCardProps = {
  href: string;
  title: string;
  image?: SanityImageData | null;
  imageAlt?: string | null;
  ariaLabel?: string;
  subtitle?: string | null;
  badges?: BadgeSpec[]; // up to two typically
};

export function ListCard({
  href,
  title,
  image,
  ariaLabel,
  imageAlt,
  subtitle,
  badges = [],
}: ListCardProps) {
  const cleanTitle = stegaClean(title);
  const altText = stegaClean(imageAlt ?? cleanTitle);

  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? cleanTitle}
      className="group block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <div className="aspect-[33/40] flex items-center justify-center">
        {image?.id ? (
          <SanityImage
            image={image}
            respectSanityCrop={false}
            width={200}
            height={400}
            alt={altText}
            className="max-h-full max-w-full object-contain"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold leading-tight group-hover:underline text-center">
          {title}
        </h3>

        {subtitle ? (
          <p className="text-sm text-muted-foreground text-center mt-1">
            {subtitle}
          </p>
        ) : null}

        {badges.length > 0 ? (
          <div className="flex items-center justify-center gap-2 mt-2">
            {badges.map((b, i) => (
              <Badge
                key={`${b.text}-${i}`}
                text={b.text}
                variant={b.variant}
                className="text-xs"
              />
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
