import { Eyebrow } from "@workspace/ui/components/eyebrow";

import { RichText } from "@/components/elements/rich-text";
import { SanityIcon } from "@/components/elements/sanity-icon";
import { FeatureCardGridLayout } from "@/components/layouts/pagebuilder/feature-card-grid-layout";

import type { PageBuilderBlockProps } from "../types";

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
  return (
    <FeatureCardGridLayout
      _key={_key}
      spacing={spacing}
      isPageTop={isPageTop}
      eyebrow={<Eyebrow text={eyebrow ?? ""} />}
      title={<h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>}
      description={
        <RichText
          richText={richText}
          className="text-base md:text-lg text-balance max-w-3xl"
        />
      }
      cards={cards?.map((card, index) => (
        <FeatureCard key={`FeatureCard-${card?._key}-${index}`} card={card} />
      ))}
    />
  );
}
