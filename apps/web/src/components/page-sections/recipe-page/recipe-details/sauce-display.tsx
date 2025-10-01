import Link from "next/link";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import type { RecipeDetailData } from "@/types";

import { normalizeSauceHref } from "./utils";

type RecipeSauce = NonNullable<
  NonNullable<RecipeDetailData["dgfSauces"]>[number]
>;

export type SauceDisplayItem = {
  id: string;
  name: string;
  href: string | null;
  image: SanityImageProps | null;
  alt: string;
};

type SanityImageProps = {
  id: string | null;
  preview: string | null;
  hotspot: { x: number; y: number } | null;
  crop: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } | null;
};

function toSanityImageData(
  image: RecipeSauce["mainImage"],
): SanityImageProps | null {
  if (!image || typeof image !== "object") return null;

  // Handle new imageFields structure
  const assetRef = image.id;
  if (!assetRef || typeof assetRef !== "string") return null;

  const hotspot = image.hotspot || null;
  const crop = image.crop || null;

  return {
    id: assetRef,
    preview: image.preview || null,
    hotspot,
    crop,
  };
}

export function mapSaucesToDisplay(
  sauces: RecipeDetailData["dgfSauces"],
): SauceDisplayItem[] {
  return (sauces ?? [])
    .map((sauce) => {
      if (!sauce) return null;

      const name = sauce.name ?? "Sauce";
      const cleanedName = stegaClean(name);
      const accessibleName =
        typeof cleanedName === "string" && cleanedName.trim().length > 0
          ? cleanedName.trim()
          : name;
      const rawAlt = sauce.mainImage?.alt;
      const cleanedAlt = rawAlt ? stegaClean(rawAlt) : accessibleName;
      const altText =
        typeof cleanedAlt === "string" && cleanedAlt.trim().length > 0
          ? cleanedAlt.trim()
          : accessibleName;

      const rawSlug = sauce.slug ?? null;
      const slugValue =
        typeof rawSlug === "string" && rawSlug.length > 0
          ? (stegaClean(rawSlug) ?? rawSlug)
          : rawSlug;
      const slugString =
        typeof slugValue === "string" && slugValue.length > 0
          ? slugValue
          : null;

      return {
        id: sauce._id,
        name,
        href: normalizeSauceHref(slugString),
        image: toSanityImageData(sauce.mainImage ?? null),
        alt: altText,
      } satisfies SauceDisplayItem;
    })
    .filter(Boolean) as SauceDisplayItem[];
}

export function SauceList({
  title,
  items,
}: {
  title: string;
  items: SauceDisplayItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div data-html="c-sauce-list">
      <div className="text-xs text-th-dark-600" data-html="c-sauce-list-title">
        {title}
      </div>
      <ul className="mt-2 space-y-3" data-html="c-sauce-list-items">
        {items.map((item) => (
          <li key={item.id}>
            <SauceLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SauceLink({ item }: { item: SauceDisplayItem }) {
  const fallbackInitial = item.alt.charAt(0)?.toUpperCase() || "S";

  const content = (
    <>
      {item.image ? (
        <SanityImage
          image={item.image}
          alt={item.alt}
          width={100}
          height={120}
          className="h-20 w-16 rounded-sm object-contain"
          sizes="64px"
          loading="lazy"
          data-html="c-sauce-image"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-20 w-16 items-center justify-center rounded-sm bg-th-light-200 text-sm font-semibold text-th-dark-600"
          data-html="c-sauce-fallback"
        >
          {fallbackInitial}
        </div>
      )}
      <span
        className="text-sm font-medium text-th-dark-900"
        data-html="c-sauce-name"
      >
        {item.name}
      </span>
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-label={`View sauce ${item.alt}`}
        className="group inline-flex w-full items-center gap-3 rounded-md border border-brand-green/20 bg-th-light-100 px-3 py-2 transition-colors hover:bg-brand-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-th-light-100"
        data-html="c-sauce-link"
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className="inline-flex w-full items-center gap-3 rounded-md border border-muted-foreground/20 bg-th-light-100 px-3 py-2"
      data-html="c-sauce-no-link"
    >
      {content}
    </div>
  );
}
