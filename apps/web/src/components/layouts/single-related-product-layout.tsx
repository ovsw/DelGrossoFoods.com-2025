import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";

import { ProductCard } from "@/components/elements/product-card";
import type { ProductListItem } from "@/types";

export interface SingleRelatedProductLayoutProps {
  readonly item: ProductListItem;
  readonly title?: string;
  readonly eyebrow?: string;
  readonly description?: string;
}

export function SingleRelatedProductLayout({
  item,
  title,
  eyebrow,
  description,
}: SingleRelatedProductLayoutProps) {
  return (
    <Section id="related-products" spacingTop="large" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6 lg:max-w-6xl xl:max-w-5xl">
        {(title || eyebrow || description) && (
          <div className="flex flex-col items-center text-center">
            {eyebrow ? <Eyebrow text={eyebrow} /> : null}
            {title ? (
              <h2 className="mt-4 text-3xl text-brand-green font-semibold text-balance md:text-5xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        )}

        <div className="mt-16 grid items-center gap-8">
          <div className="mx-auto w-full max-w-xl">
            <ProductCard item={item} />
          </div>
        </div>
      </div>
    </Section>
  );
}
