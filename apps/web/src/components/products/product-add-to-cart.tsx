"use client";

import { Button } from "@workspace/ui/components/button";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import * as React from "react";

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
  const [quantity, setQuantity] = React.useState<number>(1);
  const unitPrice =
    typeof product.price === "number" && !Number.isNaN(product.price)
      ? product.price
      : null;
  const subtotal = unitPrice != null ? unitPrice * quantity : null;
  const quantityFieldId = React.useId();

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

  function handleAddToCart(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const detail = {
      id: product._id,
      sku: product.sku ?? null,
      name: product.name ?? "",
      quantity,
      unitPrice,
      packagingLabel,
      weightText,
    };
    // Fire a custom event so a cart integration can hook in centrally
    document.dispatchEvent(new CustomEvent("product:add-to-cart", { detail }));
  }

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

            {/* Product details moved to the left column */}
            <div className="mx-auto mt-6 w-full max-w-2xl border-t border-brand-green/15 pt-6 text-left lg:mx-0">
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

          <aside className="lg:pl-8">
            <div className="rounded-lg border border-brand-green/20 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-green/70">
                Add to Cart
              </h2>

              <form onSubmit={handleAddToCart} className="mt-4 grid gap-4">
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
                    disabled={unitPrice == null}
                    data-sku={product.sku ?? undefined}
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
