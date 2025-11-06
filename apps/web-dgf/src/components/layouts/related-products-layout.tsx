import { Button } from "@workspace/ui/components/button";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import { ProductCard } from "@/components/elements/product-card";
import type { ProductListItem } from "@/types";

export interface RelatedProductsLayoutProps {
  readonly items: ProductListItem[];
  readonly title?: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly primaryCta?: {
    readonly text: string;
    readonly href: string;
    readonly variant?: "default" | "secondary" | "outline" | "link";
  };
}

export function RelatedProductsLayout({
  items,
  title,
  eyebrow,
  description,
  primaryCta,
}: RelatedProductsLayoutProps) {
  if (!items || items.length === 0) return null;
  const count = items.length;

  return (
    <Section id="related-products" spacingTop="large" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6 lg:max-w-6xl xl:max-w-5xl">
        {(title || eyebrow || description || primaryCta) && (
          <div className="flex flex-col items-center text-center">
            {eyebrow ? <Eyebrow text={eyebrow} /> : null}
            {title ? (
              <h2 className="mt-4 text-3xl font-semibold text-balance md:text-5xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
                {description}
              </p>
            ) : null}
            {primaryCta ? (
              <Button asChild className="mt-6">
                <Link href={primaryCta.href}>{primaryCta.text}</Link>
              </Button>
            ) : null}
          </div>
        )}

        <div
          className={cn(
            "mt-16 grid gap-6",
            count === 2 && "sm:grid-cols-2",
            count === 3 && "sm:grid-cols-2 lg:grid-cols-3",
            count !== 2 && count !== 3 && "sm:grid-cols-2 xl:grid-cols-4",
          )}
        >
          {items.map((product) => (
            <ProductCard key={product._id} item={product} />
          ))}
        </div>
      </div>
    </Section>
  );
}
