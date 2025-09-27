"use client";

import { Button } from "@workspace/ui/components/button";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { stegaClean } from "next-sanity";
import * as React from "react";

import { BackLink } from "@/components/elements/back-link";
import { RichText } from "@/components/elements/rich-text";
import { resolveFoxyConfig } from "@/lib/foxy/config";
import { urlFor } from "@/lib/sanity/client";
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
  const [quantity, setQuantity] = React.useState<number>(1);
  const unitPrice =
    typeof product.price === "number" && !Number.isNaN(product.price)
      ? product.price
      : null;
  const subtotal = unitPrice != null ? unitPrice * quantity : null;
  const quantityFieldId = React.useId();

  const foxyConfig = React.useMemo(
    () => resolveFoxyConfig(process.env.NEXT_PUBLIC_FOXY_DOMAIN),
    [],
  );

  React.useEffect(() => {
    if (!foxyConfig) {
      console.error(
        "Foxycart: NEXT_PUBLIC_FOXY_DOMAIN is not set; add-to-cart form disabled.",
      );
    }
  }, [foxyConfig]);

  const sku = React.useMemo(() => {
    const raw = product.sku ?? "";
    const cleaned = stegaClean(raw);
    if (typeof cleaned === "string" && cleaned.trim().length > 0) {
      return cleaned.trim();
    }
    return raw.trim();
  }, [product.sku]);

  const productNameForCart = React.useMemo(() => {
    const raw = product.name ?? "";
    const cleaned = stegaClean(raw);
    if (typeof cleaned === "string" && cleaned.trim().length > 0) {
      return cleaned.trim();
    }
    if (typeof raw === "string" && raw.trim().length > 0) {
      return raw.trim();
    }
    return "";
  }, [product.name]);

  const normalizedSlug = React.useMemo(() => {
    const rawSlug = product.slug ?? "";
    const cleaned = stegaClean(rawSlug);
    const slug =
      typeof cleaned === "string" && cleaned.trim().length > 0
        ? cleaned.trim()
        : rawSlug.trim();
    if (!slug) {
      return null;
    }
    const trimmed = slug.replace(/^\/+|\/+$/g, "");
    if (!trimmed) {
      return null;
    }
    return trimmed.startsWith("store/") ? trimmed : `store/${trimmed}`;
  }, [product.slug]);

  const [productUrl, setProductUrl] = React.useState<string | null>(() =>
    normalizedSlug ? `/${normalizedSlug}` : null,
  );

  React.useEffect(() => {
    if (!normalizedSlug) {
      setProductUrl(null);
      return;
    }
    try {
      setProductUrl(`${window.location.origin}/${normalizedSlug}`);
    } catch {
      setProductUrl(`/${normalizedSlug}`);
    }
  }, [normalizedSlug]);

  const priceValue = React.useMemo(() => {
    if (unitPrice == null) {
      return null;
    }
    return (Math.round(unitPrice * 100) / 100).toFixed(2);
  }, [unitPrice]);

  const weightValue = React.useMemo(() => {
    if (typeof product.weight !== "number" || Number.isNaN(product.weight)) {
      return null;
    }
    return String(product.weight);
  }, [product.weight]);

  const imageUrl = React.useMemo(() => {
    const assetId = product.mainImage?.id;
    if (!assetId) {
      return null;
    }
    try {
      const built = urlFor({ _ref: assetId })
        .width(600)
        .height(600)
        .dpr(2)
        .url();
      return typeof built === "string" ? built : null;
    } catch {
      return null;
    }
  }, [product.mainImage?.id]);

  const cartAction = React.useMemo(() => {
    if (!foxyConfig) {
      return undefined;
    }
    return `https://${foxyConfig.cartDomain}/cart`;
  }, [foxyConfig]);

  const isAddToCartDisabled =
    unitPrice == null || sku.length === 0 || !foxyConfig;

  function decrement() {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  }

  function increment() {
    setQuantity((q) => (q < 99 ? q + 1 : 99));
  }

  function onQuantityInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value.replace(/[^0-9]/g, ""));
    if (Number.isFinite(val)) {
      const clamped = Math.min(99, Math.max(1, val));
      setQuantity(clamped);
    }
  }

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

            {/* Product details moved to the left column */}
            <div className="mx-auto mt-6 w-full max-w-md md:max-w-2xl border-t border-brand-green/15 pt-6 text-left lg:mx-0">
              <dl
                className="mt-2 space-y-4 grid lg:grid-cols-2"
                data-c="sauce_info"
              >
                {product.sku ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-th-red-700/60">
                      SKU
                    </dt>
                    <dd className="mt-1 text-lg leading-6">{product.sku}</dd>
                  </div>
                ) : null}

                {packagingLabel ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-th-red-700/60">
                      Pack size
                    </dt>
                    <dd className="mt-1 text-lg leading-6">{packagingLabel}</dd>
                  </div>
                ) : null}

                {weightText ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-th-red-700/60">
                      Weight
                    </dt>
                    <dd className="mt-1 text-lg leading-6">{weightText}</dd>
                  </div>
                ) : null}

                {shippingText ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-th-red-700/60">
                      Shipping category
                    </dt>
                    <dd className="mt-1 text-lg leading-6">{shippingText}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>

          <aside className="lg:pl-8 mx-auto ">
            <div className="rounded-lg border border-brand-green/20 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-green/70">
                Add to Cart
              </h2>

              <form
                action={cartAction}
                method="post"
                className="mt-4 grid gap-4 foxycart"
              >
                <input
                  type="hidden"
                  name="name"
                  value={(productNameForCart || sku) ?? ""}
                />
                {priceValue != null ? (
                  <input type="hidden" name="price" value={priceValue} />
                ) : null}
                <input type="hidden" name="code" value={sku} />
                {productUrl ? (
                  <input type="hidden" name="url" value={productUrl} />
                ) : null}
                {imageUrl ? (
                  <input type="hidden" name="image" value={imageUrl} />
                ) : null}
                {weightValue != null ? (
                  <input type="hidden" name="weight" value={weightValue} />
                ) : null}

                {/* Pricing row */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Price
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-brand-green">
                      {priceText ?? "—"}
                    </p>
                  </div>
                  {subtotal != null && unitPrice != null ? (
                    <div className="text-end">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Total
                      </p>
                      <p
                        className="mt-1 text-lg font-semibold text-brand-green"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {subtotal.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits:
                            Math.round(unitPrice * 100) % 100 === 0 ? 0 : 2,
                          maximumFractionDigits:
                            Math.round(unitPrice * 100) % 100 === 0 ? 0 : 2,
                        })}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Quantity selector */}
                <div>
                  <label htmlFor={quantityFieldId} className="sr-only">
                    Quantity
                  </label>
                  <div className="flex rounded-md border border-brand-green/20 bg-white/60">
                    <button
                      type="button"
                      onClick={decrement}
                      className={cn(
                        "inline-flex items-center justify-center px-3 py-2",
                        "text-brand-green hover:bg-brand-green/10",
                        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring",
                      )}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" aria-hidden="true" />
                    </button>
                    <input
                      id={quantityFieldId}
                      name="quantity"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min={1}
                      max={99}
                      value={quantity}
                      onChange={onQuantityInputChange}
                      aria-label="Quantity"
                      className="w-full flex-1 bg-transparent text-center text-base text-brand-green outline-none"
                      aria-live="polite"
                    />
                    <button
                      type="button"
                      onClick={increment}
                      className={cn(
                        "inline-flex items-center justify-center px-3 py-2",
                        "text-brand-green hover:bg-brand-green/10",
                        "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring",
                      )}
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Add to cart button */}
                <div>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    aria-label={`Add ${quantity} to cart`}
                    disabled={isAddToCartDisabled}
                    data-sku={sku || undefined}
                    data-product-id={product._id}
                    data-quantity={quantity}
                  >
                    <ShoppingCart className="size-4" aria-hidden="true" />
                    Add to cart
                  </Button>
                  {/* Accessible announcement for successful add can be hooked externally */}
                  <span
                    className="sr-only"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {`Preparing to add ${quantity} item${quantity > 1 ? "s" : ""} to cart.`}
                  </span>
                </div>

                {/* Product details were moved to the left column */}
              </form>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
