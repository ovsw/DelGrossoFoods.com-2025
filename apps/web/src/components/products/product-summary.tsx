import { Section } from "@workspace/ui/components/section";

import { BackLink } from "@/components/elements/back-link";
import { RichText } from "@/components/elements/rich-text";
import type { ProductDetailData } from "@/types";

interface ProductSummaryProps {
  readonly product: ProductDetailData;
  readonly packagingLabel: string | null;
  readonly priceText: string | null;
  readonly weightText: string | null;
  readonly shippingText: string | null;
}

export function ProductSummary({
  product,
  packagingLabel,
  priceText,
  weightText,
  shippingText,
}: ProductSummaryProps) {
  return (
    <Section spacingTop="large" spacingBottom="large">
      <div className="container mx-auto max-w-6xl px-4 md:px-0">
        <div className="mb-6 flex justify-center lg:justify-start">
          <BackLink href="/store" label="All Products" />
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="grid gap-6 text-center lg:text-left">
            <h1 className="text-4xl font-semibold text-brand-green text-balance lg:text-5xl">
              {product.name}
            </h1>
            {product.description?.length ? (
              <RichText
                richText={product.description}
                className="mx-auto max-w-2xl text-brand-green/90 lg:mx-0"
              />
            ) : null}
          </div>

          <aside className="lg:pl-8">
            <div className="rounded-lg border border-brand-green/20 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-green/70">
                Product details
              </h2>

              <dl className="mt-4 grid gap-4">
                {product.sku ? (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      SKU
                    </dt>
                    <dd className="mt-1 text-base font-medium text-brand-green">
                      {product.sku}
                    </dd>
                  </div>
                ) : null}

                {packagingLabel ? (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Pack size
                    </dt>
                    <dd className="mt-1 text-base font-medium text-brand-green">
                      {packagingLabel}
                    </dd>
                  </div>
                ) : null}

                {priceText ? (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Price
                    </dt>
                    <dd className="mt-1 text-base font-medium text-brand-green">
                      {priceText}
                    </dd>
                  </div>
                ) : null}

                {weightText ? (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Weight
                    </dt>
                    <dd className="mt-1 text-base font-medium text-brand-green">
                      {weightText}
                    </dd>
                  </div>
                ) : null}

                {shippingText ? (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      Shipping category
                    </dt>
                    <dd className="mt-1 text-base font-medium text-brand-green">
                      {shippingText}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
