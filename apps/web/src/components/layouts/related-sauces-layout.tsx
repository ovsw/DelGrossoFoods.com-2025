import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";

import { SauceCard } from "@/components/elements/sauce-card";
import type { SauceListItem } from "@/types";

export interface RelatedSaucesLayoutProps {
  readonly items: SauceListItem[];
  readonly title?: string;
  readonly eyebrow?: string;
  readonly description?: string;
}

export function RelatedSaucesLayout({
  items,
  title,
  eyebrow,
  description,
}: RelatedSaucesLayoutProps) {
  if (!items || items.length === 0) return null;
  const count = items.length;

  return (
    <Section id="related-sauces" spacingTop="large" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6">
        {(title || eyebrow || description) && (
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
          </div>
        )}

        <div
          className={cn(
            "mt-16 grid gap-6",
            count === 2 && "grid-cols-1 sm:grid-cols-2 sm:max-w-2xl mx-auto",
            count === 3 &&
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-4xl mx-auto",
            count !== 2 &&
              count !== 3 &&
              "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:max-w-6xl mx-auto",
          )}
        >
          {items.map((sauce) => (
            <div key={sauce._id} className="max-w-sm mx-auto w-full">
              <SauceCard item={sauce} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
