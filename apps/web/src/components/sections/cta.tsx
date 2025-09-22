import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";

import type { PagebuilderType } from "@/types";

import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";
import { resolveSectionSpacing } from "./section-spacing";

export type CTABlockProps = PagebuilderType<"cta"> & {
  readonly isPageTop?: boolean;
};

export function CTABlock({
  richText,
  title,
  eyebrow,
  buttons,
  spacing,
  isPageTop = false,
}: CTABlockProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);

  return (
    <Section
      id="cta"
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-muted py-16 rounded-3xl px-4">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            {eyebrow && <Eyebrow text={eyebrow} />}
            <h2 className="text-3xl font-semibold md:text-5xl text-balance">
              {title}
            </h2>
            <div className="text-lg text-muted-foreground">
              <RichText richText={richText} className="text-balance" />
            </div>
            <div className="flex justify-center">
              <SanityButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-2 sm:grid-flow-col lg:justify-start mb-8"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
