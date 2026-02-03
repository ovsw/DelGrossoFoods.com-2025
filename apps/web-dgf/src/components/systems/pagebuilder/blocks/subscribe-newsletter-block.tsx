"use client";
import { Button } from "@workspace/ui/components/button";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronRight, LoaderCircle } from "lucide-react";
import Form from "next/form";
import { useFormStatus } from "react-dom";

// import { newsletterSubmission } from "@/action/newsletter-submission";
import { RichText } from "@/components/elements/rich-text";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

// const InteractiveGridPattern = dynamic(
//   () =>
//     import("@workspace/ui/components/interactive-grid-pattern").then(
//       (mod) => mod.InteractiveGridPattern,
//     ),
//   {
//     ssr: false,
//   },
// );

type SubscribeNewsletterProps = PageBuilderBlockProps<"subscribeNewsletter">;

const SUBSCRIBE_GRADIENT_CLASSES = cn(
  "[--subscribe-bg-color:var(--color-brand-green)]",
  "[--subscribe-bg-shade:color-mix(in_oklab,var(--subscribe-bg-color)_85%,black_15%)]",
  "[--subscribe-bg-tint:color-mix(in_oklab,var(--subscribe-bg-color)_85%,white_15%)]",
  "bg-[image:linear-gradient(to_top_right,var(--subscribe-bg-shade),var(--subscribe-bg-tint))]",
  "bg-(--subscribe-bg-color)",
);

function SubscribeNewsletterButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      variant="default"
      surface="onDark"
      className={cn(
        "group relative flex h-full w-full items-center justify-center",
        "rounded-full px-5 py-3 font-semibold text-brand-green",
        "bg-th-light-100 shadow-md shadow-black/15 transition duration-150",
        "sm:w-auto sm:justify-self-end sm:rounded-l-none sm:rounded-r-full",
        "hover:bg-th-light-100/95 hover:shadow-lg",
        "focus-visible:ring-4 focus-visible:ring-brand-red/60",
        className,
      )}
      aria-label={pending ? "Subscribing..." : "Subscribe to newsletter"}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <LoaderCircle
            className="animate-spin text-brand-green"
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="sr-only">Submitting</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <span className="sr-only">Subscribe</span>
          <ChevronRight
            size={18}
            strokeWidth={2}
            aria-hidden="true"
            className="text-brand-green transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1"
          />
        </span>
      )}
    </Button>
  );
}

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function SubscribeNewsletterBlock({
  title,
  subTitle,
  helperText,
  spacing,
  isPageTop = false,
}: SubscribeNewsletterProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing);

  return (
    <Section
      id="subscribe"
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div
          className={cn(
            "relative isolate overflow-hidden rounded-3xl bg-brand-green px-6 py-16 sm:px-10 sm:py-20 lg:px-16",
            SUBSCRIBE_GRADIENT_CLASSES,
          )}
        >
          {/* <SurfaceShineOverlay className="rounded-3xl" /> */}
          <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-center">
            <h2 className="text-3xl font-semibold text-brand-green-text text-balance sm:text-4xl md:text-5xl">
              {title}
            </h2>
            {subTitle ? (
              <RichText
                richText={subTitle}
                invert
                className="prose-base text-balance"
              />
            ) : null}
            <Form
              className="mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-0"
              // action={newsletterSubmission}
              action={() => {}}
            >
              <div className="grid">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="newsletter-email"
                  required
                  aria-label="Email address"
                  placeholder="Enter your email address"
                  className="w-full rounded-full border border-brand-green-text/30 bg-th-light-100 px-5 py-3 text-base text-th-dark-900 placeholder:text-th-dark-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 sm:rounded-r-none"
                />
              </div>
              <SubscribeNewsletterButton className="sm:rounded-l-none" />
            </Form>
            {helperText ? (
              <RichText
                richText={helperText}
                invert
                className="prose-sm text-balance opacity-80"
              />
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
