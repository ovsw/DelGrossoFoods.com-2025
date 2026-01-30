import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { RichText } from "@/components/elements/rich-text";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

type FaqAccordionProps = PageBuilderBlockProps<"faqAccordion">;

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function FaqAccordionBlock({
  _key,
  eyebrow,
  title,
  subtitle,
  faqs,
  link,
  spacing,
  isPageTop = false,
}: FaqAccordionProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);
  const sectionId = _key ? `faq-${_key}` : "faq";

  return (
    <Section
      id={sectionId}
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      {/* <FaqJsonLd faqs={stegaClean(faqs)} /> */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Eyebrow text={eyebrow ?? ""} />
            <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
            <h3 className="text-lg font-normal text-[#374151] text-balance">
              {subtitle}
            </h3>
          </div>
        </div>
        <div className="mt-16 max-w-xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs?.map((faq, index) => {
              const itemId = faq?._id ?? `faq-${index}`;

              return (
                <AccordionItem
                  value={itemId}
                  key={`AccordionItem-${itemId}`}
                  className="py-2"
                >
                  <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline group">
                    {faq?.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 text-muted-foreground">
                    <RichText
                      richText={faq?.richText ?? []}
                      className="text-sm md:text-base"
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {link?.url?.href && (
            <div className="w-full py-6">
              <p className="mb-1 text-xs">{link?.title}</p>
              <Link
                href={link.url?.href ?? "#"}
                target={link.url?.openInNewTab ? "_blank" : "_self"}
                rel={link.url?.openInNewTab ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2"
              >
                <p className="text-[15px] font-[500] leading-6">
                  {link?.description}
                </p>
                <span className="rounded-full border p-1">
                  <ArrowUpRight size={16} className="text-[#374151]" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
