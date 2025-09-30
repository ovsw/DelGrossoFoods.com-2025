import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";
import { ProductCard } from "@/components/products/product-card";
import { SauceCard } from "@/components/sauce-card";
import { getLineBadge, getTypeBadge } from "@/config/sauce-taxonomy";
import { buildHref } from "@/lib/list/href";
import type {
  SanityButtonProps,
  SauceListItem,
  SauceProductListItem,
} from "@/types";

interface SauceRelatedProductsSectionProps {
  readonly products: SauceProductListItem[];
}

export function SauceRelatedProductsSection({
  products,
}: SauceRelatedProductsSectionProps) {
  if (products.length === 0) return null;

  const relatedCopy = "Pick a bundle and stock up straight from our store.";
  const primaryCta: SanityButtonProps = {
    _key: "order-online-cta",
    _type: "button",
    text: "Shop all products",
    variant: "default",
    href: "/store",
    openInNewTab: false,
  };

  const count = products.length;

  return (
    <Section id="related-products" spacingTop="large" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6 lg:max-w-6xl xl:max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow text="Order online" />
          <h2 className="mt-4 text-3xl font-semibold text-balance md:text-5xl">
            Bring DelGrosso sauces to your pantry
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
            {relatedCopy}
          </p>
          <SanityButtons
            buttons={[primaryCta]}
            className="mt-6"
            buttonClassName="w-full sm:w-auto"
          />
        </div>

        {count === 1 ? (
          <div className="mt-16 grid items-center gap-8 ">
            <div className="mx-auto w-full max-w-xl">
              <ProductCard item={products[0]!} />
            </div>
          </div>
        ) : (
          <div
            className={
              "mt-16 grid gap-6 " +
              (count === 2
                ? "sm:grid-cols-2"
                : count === 3
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid-cols-2 xl:grid-cols-4")
            }
          >
            {products.map((product) => (
              <ProductCard key={product._id} item={product} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

// New component for recipe-related sauces

interface RecipeRelatedSaucesSectionProps {
  readonly sauces: SauceListItem[];
}

export function RecipeRelatedSaucesSection({
  sauces,
}: RecipeRelatedSaucesSectionProps) {
  if (sauces.length === 0) return null;

  const relatedCopy = "These sauces pair perfectly with this recipe.";

  const count = sauces.length;

  return (
    <Section id="related-sauces" spacingTop="large" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6 lg:max-w-6xl xl:max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow text="Featured sauces" />
          <h2 className="mt-4 text-3xl font-semibold text-balance md:text-5xl">
            Sauces for this recipe
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
            {relatedCopy}
          </p>
        </div>

        {count === 1 ? (
          <div className="mt-16">
            <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5 flex justify-center lg:justify-start">
                <div className="aspect-[33/40] relative overflow-hidden mx-auto w-full max-w-[360px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-none">
                  {sauces[0]!.mainImage?.id ? (
                    <SanityImage
                      image={sauces[0]!.mainImage}
                      respectSanityCrop
                      width={800}
                      height={968}
                      alt={stegaClean(
                        sauces[0]!.mainImage.alt ||
                          `${stegaClean(sauces[0]!.name)} sauce`,
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
                    {stegaClean(sauces[0]!.name)}
                  </h3>

                  <div className="my-6 flex flex-wrap items-center gap-1.5">
                    <Badge
                      text={getLineBadge(sauces[0]!.line).text}
                      variant={getLineBadge(sauces[0]!.line).variant}
                      className="text-xs"
                    />
                    <Badge
                      text={getTypeBadge(sauces[0]!.category).text}
                      variant={getTypeBadge(sauces[0]!.category).variant}
                      className="text-xs"
                    />
                  </div>

                  <p className="mt-4">
                    {stegaClean(sauces[0]!.descriptionPlain) &&
                    stegaClean(sauces[0]!.descriptionPlain).trim().length > 0
                      ? stegaClean(sauces[0]!.descriptionPlain)
                      : "Build your next meal with this family favorite from La Famiglia DelGrosso."}
                  </p>

                  <div className="mt-6">
                    <Button asChild variant="outline">
                      <Link
                        href={buildHref("/sauces", sauces[0]!.slug)}
                        aria-label={`View ${stegaClean(sauces[0]!.name)} sauce`}
                      >
                        View sauce
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={
              "mt-16 grid gap-6 " +
              (count === 2
                ? "grid-cols-1 sm:grid-cols-2 sm:max-w-2xl mx-auto"
                : count === 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-4xl mx-auto"
                  : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:max-w-6xl mx-auto")
            }
          >
            {sauces.map((sauce) => (
              <div key={sauce._id} className="max-w-sm mx-auto w-full">
                <SauceCard item={sauce} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
