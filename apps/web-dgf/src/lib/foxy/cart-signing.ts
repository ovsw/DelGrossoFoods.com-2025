import "server-only";

import { createHmac } from "node:crypto";

import { stegaClean } from "next-sanity";

import type { ProductDetailData } from "@/types";

type SignedCartInput = {
  readonly name: string;
  readonly value: string;
};

type SignedCartConfig = {
  readonly action: string;
  readonly quantityInputName: string;
  readonly staticInputs: readonly SignedCartInput[];
};

function sanitizeText(value: unknown): string {
  if (typeof value !== "string") {
    if (value == null) return "";
    return String(value).trim();
  }

  const cleaned = stegaClean(value);
  if (typeof cleaned === "string" && cleaned.trim().length > 0) {
    return cleaned.trim();
  }

  return value.trim();
}

function escapeForSignature(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatPriceUSD(value: unknown): string | null {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;
  return (Math.round(parsed * 100) / 100).toFixed(2);
}

function signFieldName(
  fieldName: string,
  fieldValue: string,
  productCode: string,
  secret: string,
): string {
  const signaturePayload = escapeForSignature(
    `${productCode}${fieldName}${fieldValue}`,
  );
  const signature = createHmac("sha256", secret)
    .update(signaturePayload)
    .digest("hex");

  return fieldValue === "--OPEN--"
    ? `${fieldName}||${signature}||open`
    : `${fieldName}||${signature}`;
}

export function createSignedCartConfig(
  product: ProductDetailData,
  storeUrl: string | undefined,
  signingKey: string | undefined,
): SignedCartConfig | null {
  const cartDomain = sanitizeText(storeUrl)
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "");
  const secret = sanitizeText(signingKey);
  const code = sanitizeText(product.sku);
  const name = sanitizeText(product.name) || code;
  const shippingType = sanitizeText(product.shippingType);
  const price = formatPriceUSD(product.price);
  const weight =
    typeof product.weight === "number" && !Number.isNaN(product.weight)
      ? String(product.weight)
      : null;

  if (
    !cartDomain ||
    !secret ||
    !code ||
    !name ||
    !shippingType ||
    !price ||
    !weight
  ) {
    return null;
  }

  return {
    action: `https://${cartDomain}/cart`,
    quantityInputName: signFieldName("quantity", "--OPEN--", code, secret),
    staticInputs: [
      {
        name: signFieldName("code", code, code, secret),
        value: code,
      },
      {
        name: signFieldName("name", name, code, secret),
        value: name,
      },
      {
        name: signFieldName("weight", weight, code, secret),
        value: weight,
      },
      {
        name: signFieldName("shipping_type", shippingType, code, secret),
        value: shippingType,
      },
      {
        name: signFieldName("price", price, code, secret),
        value: price,
      },
    ],
  };
}
