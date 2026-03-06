import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { SanityButtons } from "@workspace/ui/components/sanity-buttons";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { createDataAttribute, stegaClean } from "next-sanity";

import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { dataset, projectId, studioUrl } from "@/config";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

type CampaignHeroBlockProps = PageBuilderBlockProps<"campaignHero">;

/**
 * Campaign landing block for marketing pages with a hero image, supporting copy, and configurable CTA buttons.
 */
export function CampaignHeroBlock({
  _key,
  eyebrow,
  title,
  image,
  richText,
  buttons,
  spacing,
  isPageTop = false,
  sanityDocumentId,
  sanityDocumentType,
}: CampaignHeroBlockProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const HeadingTag = isPageTop ? "h1" : "h2";

  const imageDataAttribute =
    sanityDocumentId && sanityDocumentType && _key
      ? createDataAttribute({
          id: sanityDocumentId,
          type: sanityDocumentType,
          path: `pageBuilder[_key=="${_key}"].image`,
          baseUrl: studioUrl,
          projectId,
          dataset,
        }).toString()
      : undefined;

  return (
    <Section
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 text-center">
          {eyebrow ? (
            <Eyebrow
              text={eyebrow}
              className="justify-center text-brand-green max-sm:text-xs"
            />
          ) : null}
          <HeadingTag
            className={cn(
              "mx-auto max-w-4xl text-pretty font-semibold tracking-tight text-foreground",
              isPageTop
                ? "text-4xl sm:text-5xl lg:text-6xl"
                : "text-3xl sm:text-4xl lg:text-5xl",
            )}
          >
            {title}
          </HeadingTag>
        </div>

        {image ? (
          <div className="overflow-hidden rounded-3xl border border-brand-green/10 bg-muted shadow-sm">
            <SanityImage
              image={image}
              width={1600}
              height={900}
              alt={stegaClean(image.alt ?? title ?? "")}
              className="h-auto w-full object-cover"
              data-sanity={imageDataAttribute}
            />
          </div>
        ) : null}

        <div className="mx-auto grid max-w-4xl gap-6 text-center">
          {richText?.length ? (
            <RichText richText={richText} className="prose-lg max-w-none" />
          ) : null}
          {buttons?.length ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <SanityButtons buttons={buttons} />
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
