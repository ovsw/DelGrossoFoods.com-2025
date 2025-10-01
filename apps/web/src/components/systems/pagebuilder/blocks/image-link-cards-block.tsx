import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";

import { RichText } from "@/components/elements/rich-text";
import { SanityButtons } from "@/components/elements/sanity-buttons";
import { CTACard } from "@/components/image-link-card";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

export type ImageLinkCardsProps = PageBuilderBlockProps<"imageLinkCards">;

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function ImageLinkCardsBlock({
  richText,
  title,
  eyebrow,
  cards,
  buttons,
  spacing,
  isPageTop = false,
}: ImageLinkCardsProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);

  return (
    <Section
      id="image-link-cards"
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Eyebrow text={eyebrow ?? ""} />
            <h2 className="text-3xl font-semibold md:text-5xl text-balance">
              {title}
            </h2>
            <RichText richText={richText} className="text-balance" />
            {buttons?.length ? (
              <SanityButtons
                buttons={buttons}
                className="mt-2 flex flex-col items-center gap-3 sm:flex-row"
                buttonClassName="w-full sm:w-auto"
              />
            ) : null}
          </div>

          {Array.isArray(cards) && cards.length > 0 ? (
            <div className="mt-16 grid w-full grid-cols-1 gap-4 lg:gap-1 sm:grid-cols-2 lg:grid-cols-4">
              {cards?.map((card, idx) => (
                <CTACard
                  key={card._key}
                  card={card}
                  className={cn(
                    "bg-muted-foreground/10",
                    idx === 0 && "lg:rounded-l-3xl lg:rounded-r-none",
                    idx === cards.length - 1 &&
                      "lg:rounded-r-3xl lg:rounded-l-none",
                    idx !== 0 && idx !== cards.length - 1 && "lg:rounded-none",
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
