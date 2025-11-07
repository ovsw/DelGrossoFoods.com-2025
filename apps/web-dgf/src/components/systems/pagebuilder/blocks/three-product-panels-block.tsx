import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { cn } from "@workspace/ui/lib/utils";
import { createDataAttribute, stegaClean } from "next-sanity";
import type { CSSProperties } from "react";

import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";
import { SurfaceShineOverlay } from "@/components/elements/surface-shine-overlay";
import { FeatureCardGridLayout } from "@/components/layouts/pagebuilder/feature-card-grid-layout";
import { dataset, projectId, studioUrl } from "@/config";
import type { SanityButtonProps } from "@/types";

import type { PageBuilderBlockProps } from "../types";

export type ThreeProductPanelsProps =
  PageBuilderBlockProps<"threeProductPanels"> & {
    sanityDocumentId?: string;
    sanityDocumentType?: string;
  };

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

type CTAButton = SanityButtonProps & {
  _key?: string | null;
  href?: string | null;
};

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

/**
 * Individual product panel card component
 */
interface ProductPanelCardProps {
  panel: ThreeProductPanelsProps["panels"][0];
  accentColor: string;
  parentKey: string;
  sanityDocumentId?: string;
  sanityDocumentType?: string;
}

const ProductPanelCard = ({
  panel,
  accentColor,
  parentKey,
  sanityDocumentId,
  sanityDocumentType,
}: ProductPanelCardProps) => {
  const cardBg = getCardBackground(accentColor);
  const accentValue = getAccentVar(accentColor);
  const accentCssVars = {
    "--card-bg-color": accentValue,
    "--overlay-accent": accentValue,
    "--card-scale": 1,
  } as CSSProperties;
  const rawCtaButton = panel.ctaButton as CTAButton | null;
  const ctaButton = rawCtaButton
    ? {
        ...rawCtaButton,
        _key: rawCtaButton._key ?? `${panel._key}-cta`,
        href: normalizeHref(rawCtaButton.href),
      }
    : null;

  // Create data attribute for click-to-edit functionality
  const imageDataAttribute =
    sanityDocumentId && sanityDocumentType && parentKey
      ? createDataAttribute({
          id: sanityDocumentId,
          type: sanityDocumentType,
          path: `pageBuilder[_key=="${parentKey}"].panels[_key=="${panel._key}"].image`,
          baseUrl: studioUrl,
          projectId,
          dataset,
        }).toString()
      : undefined;

  return (
    <div
      className="group relative rounded-2xl p-6 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-4 md:p-5 md:pl-8 md:pr-0 md:min-h-[22rem] lg:block lg:p-6 lg:min-h-0 group-hover:[--card-scale:1.02] group-focus-within:[--card-scale:1.02]"
      role="article"
      aria-label={`${stegaClean(panel.title)} product panel`}
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
        <div className="relative mb-6 md:order-2 md:mb-0 md:justify-self-end lg:order-none lg:mb-6 lg:justify-self-auto">
          <SanityImage
            image={panel.image}
            width={800}
            height={600}
            alt={stegaClean(panel.title || "Product image")}
            className="mx-auto block w-full max-w-[28rem] pl-6 object-contain md:mx-0 md:max-w-[22rem] md:pl-0 lg:mx-auto lg:max-w-[28rem] lg:pl-6"
            data-sanity={imageDataAttribute}
          />
        </div>
      )}

      <div className="relative space-y-5 md:order-1 md:max-w-prose md:space-y-4 md:pr-3 lg:order-none lg:max-w-none lg:space-y-5 lg:pr-0">
        <div className="space-y-2">
          {/* Panel Title */}
          <h3 className="text-lg font-bold text-white md:text-xl">
            {panel.title}
          </h3>

          {/* Short Description */}
          <p className="text-sm leading-relaxed text-white/90 text-pretty">
            {panel.shortDescription}
          </p>
        </div>

        {(panel.expandedDescription || ctaButton?.href) && (
          <div className="space-y-3">
            {panel.expandedDescription && (
              <p className="text-sm leading-relaxed text-th-light-100/90 text-pretty">
                {panel.expandedDescription}
              </p>
            )}

            {/* CTA Button */}
            {ctaButton?.href && (
              <SanityButtons
                buttons={[ctaButton as SanityButtonProps]}
                className="items-start"
                buttonClassName="justify-start"
                buttonVariants={["link"]}
                surface={"onDark"}
                size={"slim"}
              />
            )}
          </div>
        )}
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
  sanityDocumentId,
  sanityDocumentType,
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
          <h2 className="text-3xl max-w-2xl font-bold text-brand-green lg:text-5xl">
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
      // gridClassName="mx-auto mt-20 grid gap-6 gap-8 lg:grid-cols-3 lg:grid-cols-3 lg:gap-8"
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
            parentKey={_key}
            sanityDocumentId={sanityDocumentId}
            sanityDocumentType={sanityDocumentType}
          />
        );
      })}
    />
  );
}
