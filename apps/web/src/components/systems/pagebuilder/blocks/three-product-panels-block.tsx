import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { cn } from "@workspace/ui/lib/utils";
import { stegaClean } from "next-sanity";

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

// Shared styles for all cards - smooth, consistent timing
const SHARED_CARD_STYLES = cn(
  "group cursor-pointer transition-all duration-900 ease-out",
  "hover:scale-[1.02] hover:shadow-2xl",
  "border-2 border-white/20 rounded-2xl overflow-hidden text-white",
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
      {/* Panel Content */}
      <div className="p-6 md:p-8">
        {/* Panel Image */}
        {panel.image && (
          <div className="mb-6 aspect-[4/3] overflow-hidden rounded-lg">
            <SanityImage
              image={panel.image}
              width={400}
              height={300}
              alt={panel.title || "Product image"}
              className="h-full w-full object-contain"
            />
          </div>
        )}

        {/* Panel Title */}
        <h3 className="mb-4 text-2xl font-bold text-white">{panel.title}</h3>

        {/* Short Description */}
        <div className="mb-4">
          <p className="text-sm leading-relaxed text-white/90">
            {panel.shortDescription}
          </p>
        </div>

        {/* Expanded Content - CSS-only hover reveal */}
        <div className="transition-all duration-300 ease-out overflow-hidden group-hover:max-h-96 group-hover:opacity-100 opacity-0 max-h-0">
          <div className="mb-4">
            <p className="text-sm leading-relaxed text-white/90">
              {panel.expandedDescription}
            </p>
          </div>

          {/* CTA Button */}
          {ctaButton?.href && (
            <div className="mt-4">
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

      {/* Subtle gradient overlay on hover - CSS only */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-30 transition-opacity duration-400 ease-out pointer-events-none" />
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
          <Eyebrow text={eyebrow} className={cn("text-brand-green")} />
        ) : undefined
      }
      title={
        title ? (
          <h2 className={cn("text-3xl font-bold text-brand-green lg:text-5xl")}>
            {title}
          </h2>
        ) : undefined
      }
      description={
        subtitle ? (
          <p className={cn("mx-auto max-w-2xl text-lg text-th-dark-700")}>
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
