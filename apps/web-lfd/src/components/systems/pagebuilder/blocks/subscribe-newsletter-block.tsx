"use client";
import { Button } from "@workspace/ui/components/button";
import { Section } from "@workspace/ui/components/section";
import { SurfaceShineOverlay } from "@workspace/ui/components/surface-shine-overlay";
import { cn } from "@workspace/ui/lib/utils";
import { CheckCircle, ChevronRight, LoaderCircle } from "lucide-react";
import { type FormEvent, useId, useState } from "react";

import { RichText } from "@/components/elements/rich-text";
import { announce } from "@/lib/a11y/announce";
import type { NewsletterSubmissionResponse } from "@/lib/newsletter-submission";

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
type NewsletterFormState = "idle" | "submitting" | "success" | "error";

const NEWSLETTER_SUBMIT_ENDPOINT = "/api/newsletter-submit";
const GENERIC_ERROR_MESSAGE =
  "Sorry, there was an error subscribing. Please try again.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNewsletterSubmissionSuccess(
  result: unknown,
): result is Extract<NewsletterSubmissionResponse, { ok: true }> {
  return isRecord(result) && result.ok === true;
}

function isNewsletterSubmissionFailure(
  result: unknown,
): result is Extract<NewsletterSubmissionResponse, { ok: false }> {
  return (
    isRecord(result) &&
    result.ok === false &&
    typeof result.message === "string" &&
    result.message.trim().length > 0
  );
}

function getNewsletterFailureMessage(result: unknown): string | null {
  if (!isNewsletterSubmissionFailure(result)) {
    return null;
  }

  return result.message.trim();
}

const LFD_NEWSLETTER_BRAND_GREEN = "oklch(0.38 0.07 178)";

function SubscribeNewsletterButton({
  className,
  pending,
}: {
  className?: string;
  pending: boolean;
}) {
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
  const formId = useId();
  const emailId = `${formId}-email`;
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<NewsletterFormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = formState === "submitting";
  const isSuccess = formState === "success";
  const isError = formState === "error" && Boolean(errorMessage);
  const feedbackId = `${formId}-feedback`;
  const helperTextId = `${formId}-helper`;
  const hasFeedback = isSuccess || isError;
  const emailDescribedBy =
    helperText && hasFeedback
      ? `${helperTextId} ${feedbackId}`
      : helperText
        ? helperTextId
        : hasFeedback
          ? feedbackId
          : undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch(NEWSLETTER_SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const result: unknown = await response.json();

      if (response.ok && isNewsletterSubmissionSuccess(result)) {
        setEmail("");
        setFormState("success");
        announce(
          "Thank you for signing up for the DelGrosso newsletter.",
          "polite",
        );
        return;
      }

      const message =
        getNewsletterFailureMessage(result) ?? GENERIC_ERROR_MESSAGE;
      setFormState("error");
      setErrorMessage(message);
      announce(message, "assertive");
    } catch {
      setFormState("error");
      setErrorMessage(GENERIC_ERROR_MESSAGE);
      announce(GENERIC_ERROR_MESSAGE, "assertive");
    }
  };

  return (
    <Section
      id="subscribe"
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div
          className="relative isolate overflow-hidden rounded-3xl px-6 py-16 sm:px-10 sm:py-20 lg:px-16"
          style={{ backgroundColor: LFD_NEWSLETTER_BRAND_GREEN }}
        >
          <SurfaceShineOverlay className="rounded-3xl" />
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
            <form
              className="mx-auto grid w-full max-w-xl gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-0"
              onSubmit={handleSubmit}
            >
              <div className="grid">
                <label htmlFor={emailId} className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id={emailId}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (formState !== "idle") {
                      setFormState("idle");
                      setErrorMessage(null);
                    }
                  }}
                  required
                  aria-describedby={emailDescribedBy}
                  aria-invalid={isError || undefined}
                  aria-label="Email address"
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                  className="w-full rounded-full border border-brand-green-text/30 bg-th-light-100 px-5 py-3 text-base text-th-dark-900 placeholder:text-th-dark-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40 sm:rounded-r-none"
                />
              </div>
              <SubscribeNewsletterButton
                className="sm:rounded-l-none"
                pending={isSubmitting}
              />
            </form>
            {isSuccess ? (
              <div
                id={feedbackId}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="mx-auto flex max-w-xl items-center justify-center gap-2 rounded-md border border-th-light-100/35 bg-th-light-100/15 px-4 py-3 text-sm font-medium text-brand-green-text"
              >
                <CheckCircle className="h-5 w-5" aria-hidden="true" />
                <p>Thank you for signing up.</p>
              </div>
            ) : null}
            {isError && errorMessage ? (
              <div
                id={feedbackId}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="mx-auto max-w-xl rounded-md border border-brand-red/40 bg-th-light-100 px-4 py-3 text-sm font-medium text-brand-red"
              >
                <p>{errorMessage}</p>
              </div>
            ) : null}
            {helperText ? (
              <div id={helperTextId}>
                <RichText
                  richText={helperText}
                  invert
                  className="prose-sm text-balance opacity-80"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
