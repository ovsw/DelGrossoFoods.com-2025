import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { cn } from "@workspace/ui/lib/utils";
import { stegaClean } from "next-sanity";
import type { CSSProperties } from "react";

import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";
import { FeatureCardGridLayout } from "@/components/layouts/pagebuilder/feature-card-grid-layout";
import type { SanityButtonProps } from "@/types";

import type { PageBuilderBlockProps } from "../types";

export type ThreeProductPanelsProps =
  PageBuilderBlockProps<"threeProductPanels">;

// Simplified color mapping - only background colors differ
const ACCENT_COLOR_MAP = {
  green: "bg-th-green-600",
  black: "bg-th-dark-900",
  brown: "bg-th-dark-900",
  red: "bg-th-red-600",
} as const;

type AccentColor = keyof typeof ACCENT_COLOR_MAP;

const getCardBackground = (color: string): string =>
  ACCENT_COLOR_MAP[color as AccentColor] || ACCENT_COLOR_MAP.red;

// Map accent keys to their CSS variable values for dynamic gradients
const ACCENT_VAR_MAP: Record<AccentColor, string> = {
  green: "var(--color-th-green-600)",
  black: "var(--color-th-dark-900)",
  brown: "var(--color-th-dark-900)",
  red: "var(--color-th-red-600)",
};

const getAccentVar = (color: string): string =>
  ACCENT_VAR_MAP[(color as AccentColor) || "red"] || ACCENT_VAR_MAP.red;

const normalizeHref = (href?: string | null): string | undefined => {
  if (!href) {
    return undefined;
  }
  const cleaned = stegaClean(href);
  if (
    cleaned.startsWith("/") ||
    cleaned.startsWith("#") ||
    /^(?:https?:)?\/\//.test(cleaned)
  ) {
    return cleaned;
  }
  return `/${cleaned}`;
};

// Shared styles for all cards - smooth, consistent timing and fixed height to prevent layout shift
const SHARED_CARD_STYLES = cn(
  "group relative cursor-pointer transition-all duration-900 ease-out hover:scale-[1.02] hover:shadow-2xl h-[24rem] md:h-[28rem] lg:h-[30rem] border-2 border-white/20 rounded-2xl overflow-hidden text-white",
);

/**
 * Individual product panel card component
 */
interface ProductPanelCardProps {
  panel: ThreeProductPanelsProps["panels"][0];
  accentColor: string;
}

const ProductPanelCard = ({ panel, accentColor }: ProductPanelCardProps) => {
  const cardBg = getCardBackground(accentColor);
  const ctaButton = panel.ctaButton
    ? {
        ...panel.ctaButton,
        _key: panel.ctaButton._key ?? `${panel._key}-cta`,
        href: normalizeHref(panel.ctaButton.href),
      }
    : null;

  return (
    <div
      className={cn(SHARED_CARD_STYLES, cardBg)}
      role="article"
      aria-label={`${panel.title} product panel`}
    >
      {/* Background Image Layer */}
      {panel.image && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-end justify-center bottom-[6.5rem] md:bottom-[7.5rem] lg:bottom-[8.5rem] px-8 md:px-10">
          <SanityImage
            image={panel.image}
            width={800}
            height={600}
            alt={panel.title || "Product image"}
            className="h-full w-full max-w-[82%] object-contain"
          />
        </div>
      )}

      {/* Bottom Overlay Content */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="relative">
          <div
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out",
              "border-b-2 border-white/50 rounded-b-2xl",
              "bg-[linear-gradient(0deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0)_50%,color-mix(in_srgb,var(--overlay-accent)_0%,transparent)_100%)]",
            )}
            style={
              {
                "--overlay-accent": getAccentVar(accentColor),
              } as CSSProperties
            }
            aria-hidden="true"
          />

          <div className="relative rounded-t-2xl bg-[inherit] p-6 md:p-8">
            {/* Panel Title */}
            <h3 className="mb-1 text-2xl font-bold text-white line-clamp-1 md:line-clamp-none">
              {panel.title}
            </h3>

            {/* Short Description */}
            <p className="mb-3 text-sm leading-relaxed text-white/90 line-clamp-1 md:line-clamp-none">
              {panel.shortDescription}
            </p>

            {/* Expanded Content - grid-template-rows reveal (CSS-only overlay) */}
            {/**
             * Technique: Animate grid-template-rows from 0fr -> 1fr while the
             * inner clip wrapper has overflow-hidden. The card has a fixed height,
             * so reveal pushes upward inside the card without changing layout.
             */}
            <div className="grid [grid-template-rows:0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:[grid-template-rows:1fr] group-focus-within:[grid-template-rows:1fr] motion-reduce:transition-none motion-reduce:duration-0">
              <div className="overflow-hidden">
                {panel.expandedDescription && (
                  <p className="mb-3 text-sm leading-relaxed text-white/90 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100">
                    {panel.expandedDescription}
                  </p>
                )}

                {/* CTA Button */}
                {ctaButton?.href && (
                  <div className="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100">
                    <SanityButtons
                      buttons={[
                        {
                          ...(ctaButton as SanityButtonProps),
                          variant: "link",
                        },
                      ]}
                      className="gap-0"
                      buttonClassName="h-auto w-auto justify-start p-0 text-sm font-semibold text-white underline underline-offset-4 transition-opacity hover:opacity-80"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay on hover - CSS only */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-30 group-focus-within:opacity-30 transition-opacity duration-400 ease-out pointer-events-none" />
    </div>
  );
};

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function ThreeProductPanelsBlock({
  _key,
  eyebrow,
  title,
  subtitle,
  panels,
  spacing,
  isPageTop = false,
}: ThreeProductPanelsProps) {
  if (!panels || panels.length !== 3) {
    return null;
  }

  return (
    <FeatureCardGridLayout
      _key={_key}
      spacing={spacing}
      isPageTop={isPageTop}
      eyebrow={
        eyebrow ? (
          <Eyebrow text={eyebrow} className="text-brand-green" />
        ) : undefined
      }
      title={
        title ? (
          <h2 className="text-3xl font-bold text-brand-green lg:text-5xl">
            {title}
          </h2>
        ) : undefined
      }
      description={
        subtitle ? (
          <p className="mx-auto max-w-2xl text-lg text-th-dark-700">
            {subtitle}
          </p>
        ) : undefined
      }
      gridClassName="gap-6 md:grid-cols-3 lg:gap-8"
      cards={panels.map((panel) => {
        const cleanedAccent =
          typeof panel.accentColor === "string"
            ? stegaClean(panel.accentColor)
            : "red";

        return (
          <ProductPanelCard
            key={panel._key}
            panel={panel}
            accentColor={cleanedAccent || "red"}
          />
        );
      })}
    />
  );
}
