import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";

import { SanityButtons } from "@/components/elements/sanity-buttons";
import { ProductCard } from "@/components/products/product-card";
import type { SanityButtonProps, SauceProductListItem } from "@/types";

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
import { SauceCard } from "@/components/sauce-card";
import type { SauceListItem } from "@/types";

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
          <div className="mt-16 grid items-center gap-8">
            <div className="mx-auto w-full max-w-xl">
              <SauceCard item={sauces[0]!} />
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
