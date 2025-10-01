import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";

import { RichText } from "@/components/elements/rich-text";
import { SanityIcon } from "@/components/elements/sanity-icon";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

type FeatureCardsWithIconProps = PageBuilderBlockProps<"featureCardsIcon">;

type FeatureCardProps = {
  card: NonNullable<FeatureCardsWithIconProps["cards"]>[number];
};

function FeatureCard({ card }: FeatureCardProps) {
  const { icon, title, richText } = card ?? {};
  return (
    <div className="rounded-3xl bg-accent p-8 md:min-h-[300px] md:p-8">
      <span className="mb-9 flex w-fit p-3 items-center justify-center rounded-full bg-background drop-shadow-xl">
        <SanityIcon icon={icon} />
      </span>

      <div>
        <h3 className="text-lg font-medium md:text-2xl mb-2">{title}</h3>
        <RichText
          richText={richText}
          className="font-normal text-sm md:text-[16px] text-black/90 leading-7 text-balance"
        />
      </div>
    </div>
  );
}

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function FeatureCardsWithIconBlock({
  _key,
  eyebrow,
  title,
  richText,
  cards,
  spacing,
  isPageTop = false,
}: FeatureCardsWithIconProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const sectionId = _key ? `features-${_key}` : "features";

  return (
    <Section
      id={sectionId}
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Eyebrow text={eyebrow ?? ""} />
            <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
            <RichText
              richText={richText}
              className="text-base md:text-lg text-balance max-w-3xl"
            />
          </div>
        </div>
        <div className="mx-auto mt-20 grid gap-8 lg:grid-cols-3">
          {cards?.map((card, index) => (
            <FeatureCard
              key={`FeatureCard-${card?._key}-${index}`}
              card={card}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
