"use client";

import type { GetSauceBySlugQueryResult } from "@workspace/sanity-config/types";
import { BackLink } from "@workspace/ui/components/back-link";
import { InfoLabel } from "@workspace/ui/components/info-label";
import { SectionShell } from "@workspace/ui/components/section-shell";
import { stegaClean } from "next-sanity";

import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { ProductPurchasePanel } from "@/components/features/cart/product-purchase-panel";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import type { ProductDetailData } from "@/types";

type PremiumSauceAuthor = Pick<
  NonNullable<GetSauceBySlugQueryResult>,
  "_id" | "_type" | "authorName" | "authorImage"
>;

interface ProductSummarySectionProps {
  readonly product: ProductDetailData;
  readonly packagingLabel: string | null;
  readonly priceText: string | null;
  readonly weightText: string | null;
  readonly shippingText: string | null;
  readonly premiumSauceAuthor?: PremiumSauceAuthor | null;
}

export function ProductSummarySection({
  product,
  packagingLabel,
  priceText,
  weightText,
  shippingText,
  premiumSauceAuthor,
}: ProductSummarySectionProps) {
  const authorName = premiumSauceAuthor?.authorName ?? "";
  const cleanedAuthorName = stegaClean(authorName).trim();
  const showAuthorName = cleanedAuthorName.length > 0;
  const authorImage = premiumSauceAuthor?.authorImage;
  const showAuthorImage = Boolean(authorImage?.id);
  const showPremiumAuthor = showAuthorName || showAuthorImage;

  const authorNameAttribute =
    showPremiumAuthor && premiumSauceAuthor
      ? createPresentationDataAttribute({
          documentId: premiumSauceAuthor._id,
          documentType: premiumSauceAuthor._type,
          path: "authorName",
        })
      : null;
  const authorImageAttribute =
    showAuthorImage && premiumSauceAuthor
      ? createPresentationDataAttribute({
          documentId: premiumSauceAuthor._id,
          documentType: premiumSauceAuthor._type,
          path: "authorImage",
        })
      : null;

  const authorAltText = authorImage?.alt || cleanedAuthorName || "Sauce author";

  const productNameClassName =
    "text-4xl font-semibold text-brand-green text-balance lg:text-5xl";
  const packSizeAttribute = createPresentationDataAttribute({
    documentId: product._id,
    documentType: product._type,
    path: "category",
  });
  const shippingCategoryAttribute = createPresentationDataAttribute({
    documentId: product._id,
    documentType: product._type,
    path: "shippingCategory",
  });
  const weightAttribute = createPresentationDataAttribute({
    documentId: product._id,
    documentType: product._type,
    path: "weight",
  });

  return (
    <SectionShell
      spacingTop="large"
      spacingBottom="default"
      background="transparent"
      innerClassName="max-w-6xl"
    >
      <div className="mb-6 flex justify-center md:justify-start">
        <BackLink href="/store" label="All Products" />
      </div>

      <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-6 text-center md:text-left">
          {showPremiumAuthor ? (
            <div className="flex min-w-0 flex-nowrap items-center justify-center gap-4 md:justify-start">
              {authorImage?.id ? (
                <SanityImage
                  image={authorImage}
                  alt={authorAltText}
                  width={240}
                  height={240}
                  data-sanity={authorImageAttribute ?? undefined}
                  className="h-auto w-auto max-h-24 max-w-24 shrink-0 object-contain sm:max-h-28 sm:max-w-28"
                />
              ) : null}
              <div className="min-w-0 text-center md:text-left">
                {showAuthorName ? (
                  <p
                    className="text-2xl font-semibold text-brand-green/90 text-balance md:text-3xl"
                    data-sanity={authorNameAttribute ?? undefined}
                  >
                    {authorName}
                  </p>
                ) : null}
                <h1 className={productNameClassName}>{product.name}</h1>
              </div>
            </div>
          ) : (
            <h1 className={productNameClassName}>{product.name}</h1>
          )}
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
                  <dd
                    className="mt-1 text-lg leading-6"
                    data-sanity={packSizeAttribute ?? undefined}
                  >
                    {packagingLabel}
                  </dd>
                </div>
              ) : null}

              {weightText ? (
                <div>
                  <InfoLabel asChild>
                    <dt>Weight</dt>
                  </InfoLabel>
                  <dd
                    className="mt-1 text-lg leading-6"
                    data-sanity={weightAttribute ?? undefined}
                  >
                    {weightText}
                  </dd>
                </div>
              ) : null}

              {shippingText ? (
                <div>
                  <InfoLabel asChild>
                    <dt>Shipping category</dt>
                  </InfoLabel>
                  <dd
                    className="mt-1 text-lg leading-6"
                    data-sanity={shippingCategoryAttribute ?? undefined}
                  >
                    {shippingText}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        <ProductPurchasePanel product={product} priceText={priceText} />
      </div>
    </SectionShell>
  );
}
