import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";

import { RichText } from "@/components/elements/rich-text";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

type LongFormBlockProps = PageBuilderBlockProps<"longForm">;

/**
 * Long-form content block for legal pages and articles.
 * Render via PageBuilder; do not import directly into route components.
 */
export function LongFormBlock({
  eyebrow,
  title,
  intro,
  body,
  spacing,
  isPageTop = false,
}: LongFormBlockProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const HeadingTag = isPageTop ? "h1" : "h2";

  return (
    <Section
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {eyebrow ? (
          <Eyebrow text={eyebrow} className="text-brand-green" />
        ) : null}
        {title ? (
          <HeadingTag className="heading-section">{title}</HeadingTag>
        ) : null}
        {intro?.length ? (
          <RichText richText={intro} className="mt-6 prose-lg" />
        ) : null}
        {body?.length ? (
          <RichText richText={body} className="mt-10 prose-lg" />
        ) : null}
      </div>
    </Section>
  );
}
