import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

import {
  resolveSectionSpacing,
  type SectionSpacingInput,
} from "../../systems/pagebuilder/utils/section-spacing";

type FeatureCardGridLayoutProps = {
  readonly _key?: string | null;
  readonly spacing?: SectionSpacingInput;
  readonly isPageTop?: boolean;
  readonly eyebrow?: ReactNode;
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly cards?: ReactNode;
  readonly containerClassName?: string;
  readonly gridClassName?: string;
};

export function FeatureCardGridLayout({
  _key,
  spacing,
  isPageTop = false,
  eyebrow,
  title,
  description,
  cards,
  containerClassName,
  gridClassName,
}: FeatureCardGridLayoutProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const sectionId = _key ? `features-${_key}` : "features";

  return (
    <Section
      id={sectionId}
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className={cn("container mx-auto px-4 md:px-6", containerClassName)}>
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            {eyebrow}
            {title}
            {description}
          </div>
        </div>
        <div
          className={cn(
            "mx-auto mt-12 lg:mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3",
            gridClassName,
          )}
        >
          {cards}
        </div>
      </div>
    </Section>
  );
}
