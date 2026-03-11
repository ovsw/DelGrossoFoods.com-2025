"use client";

import { Button } from "@workspace/ui/components/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { stegaClean } from "next-sanity";
import * as React from "react";

import { resolveFoxyConfig } from "@/lib/foxy/config";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";
import type { ProductDetailData } from "@/types";

interface ProductPurchasePanelProps {
  readonly product: ProductDetailData;
  readonly priceText: string | null;
  readonly signedCart: {
    readonly action: string;
    readonly quantityInputName: string;
    readonly staticInputs: readonly {
      readonly name: string;
      readonly value: string;
    }[];
  } | null;
}

export function ProductPurchasePanel({
  product,
  priceText,
  signedCart,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = React.useState<number>(1);
  const unitPrice =
    typeof product.price === "number" && !Number.isNaN(product.price)
      ? product.price
      : null;
  const subtotal = unitPrice != null ? unitPrice * quantity : null;
  const quantityFieldId = React.useId();

  const foxyConfig = React.useMemo(
    () => resolveFoxyConfig(process.env.NEXT_PUBLIC_FOXY_STORE_URL),
    [],
  );

  React.useEffect(() => {
    if (!foxyConfig) {
      console.error(
        "Foxycart: NEXT_PUBLIC_FOXY_STORE_URL is not set; add-to-cart form disabled.",
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

  const isAddToCartDisabled =
    unitPrice == null || sku.length === 0 || !foxyConfig || !signedCart;
  const priceAttribute = createPresentationDataAttribute({
    documentId: product._id,
    documentType: product._type,
    path: "price",
  });

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
    <aside className="lg:pl-8 mx-auto">
      <div className="rounded-lg border border-brand-green/20 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-green/70">
          Add to Cart
        </h2>

        <form
          action={signedCart?.action}
          method="post"
          className="mt-4 grid gap-4 foxycart"
          onSubmit={(e) => {
            if (!signedCart) {
              e.preventDefault();
            }
          }}
        >
          {signedCart?.staticInputs.map((input) => (
            <input
              key={input.name}
              type="hidden"
              name={input.name}
              value={input.value}
            />
          ))}
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Price
              </p>
              <p
                className="mt-1 text-2xl font-semibold text-brand-green"
                data-sanity={priceAttribute ?? undefined}
              >
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

          <div>
            <label htmlFor={quantityFieldId} className="sr-only">
              Quantity
            </label>
            <div className="flex rounded-md border border-brand-green/20 bg-white/60">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={decrement}
                className="px-3 py-2 text-brand-green hover:bg-brand-green/10"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" aria-hidden="true" />
              </Button>
              <input
                id={quantityFieldId}
                name={signedCart?.quantityInputName}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantity}
                onChange={onQuantityInputChange}
                aria-label="Quantity"
                className="w-full flex-1 bg-transparent text-center text-base text-brand-green outline-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={increment}
                className="px-3 py-2 text-brand-green hover:bg-brand-green/10"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full cursor-pointer"
              aria-label={`Add ${quantity} to cart`}
              disabled={isAddToCartDisabled}
              data-sku={sku || undefined}
              data-product-id={product._id}
              data-quantity={quantity}
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              Add to cart
            </Button>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {`Preparing to add ${quantity} item${quantity > 1 ? "s" : ""} to cart.`}
            </span>
          </div>
        </form>
      </div>
    </aside>
  );
}
