import { Section } from "@workspace/ui/components/section";
import { stegaClean } from "next-sanity";

import { SanityImage } from "@/components/elements/sanity-image";
import type { ProductDetailData } from "@/types";

type ProductHeroSectionProps = {
  readonly product: ProductDetailData;
};

function toCleanString(value: unknown): string {
  if (!value) return "";
  const rawValue = typeof value === "string" ? value : String(value);
  const cleaned = stegaClean(rawValue);
  if (typeof cleaned === "string") {
    return cleaned.trim();
  }
  return rawValue.trim();
}

export function ProductHeroSection({ product }: ProductHeroSectionProps) {
  const image = product.mainImage;
  if (!image?.id) return null;

  const productName = toCleanString(product.name);
  const altText = productName || "Product Image";

  return (
    <Section
      spacingTop="page-top"
      spacingBottom="default"
      className="relative isolate overflow-hidden bg-[url('/images/bg/counter-wall-5-no-bottom-border-ultrawide-p-2600.jpg')] bg-cover bg-bottom"
    >
      <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
      <div className="container relative mx-auto max-w-6xl px-4 md:px-0">
        <div className="flex min-h-[360px] items-center justify-center">
          <SanityImage
            image={image}
            alt={altText}
            respectSanityCrop={false}
            className=" w-full object-contain"
          />
        </div>
      </div>
    </Section>
  );
}
