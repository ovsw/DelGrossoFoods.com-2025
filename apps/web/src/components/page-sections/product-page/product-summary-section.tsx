"use client";

import { InfoLabel } from "@workspace/ui/components/info-label";
import { Section } from "@workspace/ui/components/section";

import { BackLink } from "@/components/elements/back-link";
import { RichText } from "@/components/elements/rich-text";
import { ProductPurchasePanel } from "@/components/features/cart/product-purchase-panel";
import type { ProductDetailData } from "@/types";

interface ProductSummarySectionProps {
  readonly product: ProductDetailData;
  readonly packagingLabel: string | null;
  readonly priceText: string | null;
  readonly weightText: string | null;
  readonly shippingText: string | null;
}

export function ProductSummarySection({
  product,
  packagingLabel,
  priceText,
  weightText,
  shippingText,
}: ProductSummarySectionProps) {
  return (
    <Section spacingTop="large" spacingBottom="default">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-6 flex justify-center md:justify-start">
          <BackLink href="/store" label="All Products" />
        </div>

        <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="grid gap-6 text-center md:text-left">
            <h1 className="text-4xl font-semibold text-brand-green text-balance lg:text-5xl">
              {product.name}
            </h1>
            {product.description?.length ? (
              <RichText
                richText={product.description}
                className="mx-auto max-w-2xl text-brand-green/90 md:mx-0"
              />
            ) : null}

            <div className="mx-auto mt-6 w-full max-w-md md:max-w-2xl border-t border-brand-green/15 pt-6 text-left lg:mx-0">
              <dl
                className="mt-2 space-y-4 grid lg:grid-cols-2"
                data-c="sauce_info"
              >
                {product.sku ? (
                  <div>
                    <InfoLabel asChild>
                      <dt>SKU</dt>
                    </InfoLabel>
                    <dd className="mt-1 text-lg leading-6">{product.sku}</dd>
                  </div>
                ) : null}

                {packagingLabel ? (
                  <div>
                    <InfoLabel asChild>
                      <dt>Pack size</dt>
                    </InfoLabel>
                    <dd className="mt-1 text-lg leading-6">{packagingLabel}</dd>
                  </div>
                ) : null}

                {weightText ? (
                  <div>
                    <InfoLabel asChild>
                      <dt>Weight</dt>
                    </InfoLabel>
                    <dd className="mt-1 text-lg leading-6">{weightText}</dd>
                  </div>
                ) : null}

                {shippingText ? (
                  <div>
                    <InfoLabel asChild>
                      <dt>Shipping category</dt>
                    </InfoLabel>
                    <dd className="mt-1 text-lg leading-6">{shippingText}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>

          <ProductPurchasePanel product={product} priceText={priceText} />
        </div>
      </div>
    </Section>
  );
}
