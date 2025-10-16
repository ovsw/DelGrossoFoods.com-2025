import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { cn } from "@workspace/ui/lib/utils";
import { stegaClean } from "next-sanity";
import type { CSSProperties } from "react";

import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";
import { SurfaceShineOverlay } from "@/components/elements/surface-shine-overlay";
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

// Shared animation parameters for synchronized hover effects
const SHARED_HOVER_ANIMATION_STYLES =
  "transition-[transform,box-shadow] duration-300 ease-out origin-top [transform:scale(var(--card-scale))] group-hover:shadow-2xl group-focus-within:shadow-2xl motion-reduce:duration-0 will-change-transform";

// Shared styles for card container and surface layers
const CARD_CONTAINER_STYLES = "";

/**
 * Individual product panel card component
 */
interface ProductPanelCardProps {
  panel: ThreeProductPanelsProps["panels"][0];
  accentColor: string;
}

const ProductPanelCard = ({ panel, accentColor }: ProductPanelCardProps) => {
  const cardBg = getCardBackground(accentColor);
  const accentValue = getAccentVar(accentColor);
  const accentCssVars = {
    "--card-bg-color": accentValue,
    "--overlay-accent": accentValue,
  } as CSSProperties;
  const ctaButton = panel.ctaButton
    ? {
        ...panel.ctaButton,
        _key: panel.ctaButton._key ?? `${panel._key}-cta`,
        href: normalizeHref(panel.ctaButton.href),
      }
    : null;

  return (
    <div
      className="group relative h-[24rem] md:h-[28rem] lg:h-[30rem] focus-within:outline-none [--card-scale:1] hover:[--card-scale:1.06] focus-within:[--card-scale:1.06] motion-reduce:hover:[--card-scale:1] motion-reduce:focus-within:[--card-scale:1]"
      role="article"
      aria-label={`${panel.title} product panel`}
      style={accentCssVars}
    >
      <SurfaceShineOverlay className={SHARED_HOVER_ANIMATION_STYLES} />
      <div
        className={cn(
          "absolute inset-0 rounded-2xl rounded-b-2xl text-white shadow-none",
          SHARED_HOVER_ANIMATION_STYLES,
          cardBg,
        )}
        aria-hidden="true"
      />

      {panel.image && (
        <div className="pointer-events-none absolute inset-x-0 -top-10 bottom-[6.5rem] md:bottom-[7.5rem] lg:bottom-[8.5rem] z-10 flex items-end justify-center px-8">
          <SanityImage
            image={panel.image}
            width={800}
            height={600}
            alt={panel.title || "Product image"}
            className="h-full w-full max-w-[82%] object-contain"
          />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-20 origin-top transition-transform duration-300 ease-out [transform:scale(var(--card-scale))] motion-reduce:duration-0 will-change-transform">
        <div className="relative">
          {/* <div
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out",
              "border-b-2 border-white/50 rounded-b-2xl",
              "bg-[linear-gradient(0deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0)_50%,color-mix(in_srgb,var(--overlay-accent)_0%,transparent)_100%)]",
            )}
            aria-hidden="true"
          /> */}

          <div className="relative rounded-t-2xl p-6 md:p-8">
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
                          variant: null,
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
