import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import { ProductCard } from "@/components/products/product-card";
import { SauceCard } from "@/components/sauce-card";
import { getLineBadge, getTypeBadge } from "@/config/sauce-taxonomy";
import { buildHref } from "@/lib/list/href";
import type {
  ProductListItem,
  SauceListItem,
  SauceProductListItem,
} from "@/types";

// Union type for items that can be displayed in related items layout
// Use the actual types from the generated Sanity types
// Note: These types have mainImage as potentially null, but we filter them out in page sections
export type RelatedItem = SauceProductListItem | SauceListItem;

export interface RelatedItemsLayoutProps {
  readonly items: RelatedItem[];
  readonly type: "product" | "sauce";
  readonly variant?: "default" | "single-item-prominent";
  readonly title?: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly showHeader?: boolean;
  readonly primaryCta?: {
    readonly text: string;
    readonly href: string;
    readonly variant?: "default" | "secondary" | "outline" | "link";
  };
}

export function RelatedItemsLayout({
  items,
  type,
  variant = "default",
  title,
  eyebrow,
  description,
  showHeader = true,
  primaryCta,
}: RelatedItemsLayoutProps) {
  if (items.length === 0) return null;

  const count = items.length;

  return (
    <Section id={`related-${type}s`} spacingTop="large" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6 lg:max-w-6xl xl:max-w-5xl">
        {showHeader && (title || eyebrow || description || primaryCta) && (
          <div className="flex flex-col items-center text-center">
            {eyebrow && <Eyebrow text={eyebrow} />}
            {title && (
              <h2 className="mt-4 text-3xl font-semibold text-balance md:text-5xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
                {description}
              </p>
            )}
            {primaryCta && (
              <Button
                asChild
                variant={primaryCta.variant || "outline"}
                className="mt-6"
              >
                <Link href={primaryCta.href}>{primaryCta.text}</Link>
              </Button>
            )}
          </div>
        )}

        {count === 1 && variant === "single-item-prominent" ? (
          <SingleItemProminentView item={items[0]!} type={type} />
        ) : (
          <GridView items={items} type={type} />
        )}
      </div>
    </Section>
  );
}

function SingleItemProminentView({
  item,
  type,
}: {
  item: RelatedItem;
  type: "product" | "sauce";
}) {
  if (type === "product") {
    return (
      <div className="mt-16 grid items-center gap-8">
        <div className="mx-auto w-full max-w-xl">
          <ProductCard item={item as ProductListItem} />
        </div>
      </div>
    );
  }

  // Sauce single item view
  const sauce = item as SauceListItem;
  return (
    <div className="mt-16">
      <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <div className="aspect-[33/40] relative overflow-hidden mx-auto w-full max-w-[360px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-none">
            {sauce.mainImage?.id ? (
              <SanityImage
                image={sauce.mainImage}
                respectSanityCrop
                width={800}
                height={968}
                alt={stegaClean(
                  sauce.mainImage.alt || `${stegaClean(sauce.name)} sauce`,
                )}
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
              {sauce.name}
            </h3>

            <div className="my-6 flex flex-wrap items-center gap-1.5">
              <Badge
                text={getLineBadge(sauce.line).text}
                variant={getLineBadge(sauce.line).variant}
                className="text-xs"
              />
              <Badge
                text={getTypeBadge(sauce.category).text}
                variant={getTypeBadge(sauce.category).variant}
                className="text-xs"
              />
            </div>

            <p className="mt-4">
              {stegaClean(sauce.descriptionPlain) &&
              stegaClean(sauce.descriptionPlain).trim().length > 0
                ? sauce.descriptionPlain
                : "Build your next meal with this family favorite from La Famiglia DelGrosso."}
            </p>

            <div className="mt-6">
              <Button asChild variant="outline">
                <Link
                  href={buildHref("/sauces", sauce.slug)}
                  aria-label={`View ${stegaClean(sauce.name)} sauce`}
                >
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

function GridView({
  items,
  type,
}: {
  items: RelatedItem[];
  type: "product" | "sauce";
}) {
  const count = items.length;

  if (type === "product") {
    return (
      <div
        className={cn(
          "mt-16 grid gap-6",
          count === 2 && "sm:grid-cols-2",
          count === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          count !== 2 && count !== 3 && "sm:grid-cols-2 xl:grid-cols-4",
        )}
      >
        {items.map((product) => (
          <ProductCard key={product._id} item={product as ProductListItem} />
        ))}
      </div>
    );
  }

  // Sauce grid view
  return (
    <div
      className={cn(
        "mt-16 grid gap-6",
        count === 2 && "grid-cols-1 sm:grid-cols-2 sm:max-w-2xl mx-auto",
        count === 3 &&
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-4xl mx-auto",
        count !== 2 &&
          count !== 3 &&
          "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:max-w-6xl mx-auto",
      )}
    >
      {items.map((sauce) => (
        <div key={sauce._id} className="max-w-sm mx-auto w-full">
          <SauceCard item={sauce as SauceListItem} />
        </div>
      ))}
    </div>
  );
}
