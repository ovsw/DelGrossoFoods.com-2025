"use client";

import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";
import { FeatureCardGridLayout } from "@/components/layouts/pagebuilder/feature-card-grid-layout";
import type { SanityButtonProps } from "@/types";

import type { PageBuilderBlockProps } from "../types";

export type ThreeProductPanelsProps =
  PageBuilderBlockProps<"threeProductPanels">;

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
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  if (!panels || panels.length !== 3) {
    return null;
  }

  const getAccentColors = (accentColor: string) => {
    switch (accentColor) {
      case "green":
        return {
          cardBg: "bg-th-green-600",
          border: "border-white/20",
          heading: "text-white",
          bodyText: "text-white/90",
          expandedBg: "bg-white/10",
          buttonBg: "bg-white",
          buttonText: "text-th-green-600",
          indicatorBg: "bg-white",
          overlay: "bg-black/10",
        };
      case "brown":
        return {
          cardBg: "bg-th-brown-600",
          border: "border-white/20",
          heading: "text-white",
          bodyText: "text-white/90",
          expandedBg: "bg-white/10",
          buttonBg: "bg-white",
          buttonText: "text-th-brown-600",
          indicatorBg: "bg-white",
          overlay: "bg-black/10",
        };
      case "red":
      default:
        return {
          cardBg: "bg-th-red-600",
          border: "border-white/20",
          heading: "text-white",
          bodyText: "text-white/90",
          expandedBg: "bg-white/10",
          buttonBg: "bg-white",
          buttonText: "text-th-red-600",
          indicatorBg: "bg-white",
          overlay: "bg-black/10",
        };
    }
  };

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
      cards={panels.map((panel, index) => {
        const colors = getAccentColors(panel.accentColor || "red");
        const isHovered = hoveredPanel === index;

        return (
          <motion.div
            key={panel._key}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-2xl border-2 text-white transition-all duration-300 ease-in-out",
              colors.border,
              colors.cardBg,
              isHovered ? "scale-105 shadow-2xl" : "shadow-lg",
            )}
            onMouseEnter={() => setHoveredPanel(index)}
            onMouseLeave={() => setHoveredPanel(null)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
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
              <h3 className={cn("mb-4 text-2xl font-bold", colors.heading)}>
                {panel.title}
              </h3>

              {/* Short Description */}
              <div className="mb-4">
                <p className={cn("text-sm leading-relaxed", colors.bodyText)}>
                  {panel.shortDescription}
                </p>
              </div>

              {/* Expanded Content - Hidden by default, shown on hover */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  height: isHovered ? "auto" : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className={cn("mb-4 rounded-lg p-4", colors.expandedBg)}>
                  <p className={cn("text-sm leading-relaxed", colors.bodyText)}>
                    {panel.expandedDescription}
                  </p>
                </div>

                {/* CTA Button */}
                {panel.ctaButton && (
                  <div className="mt-4">
                    <SanityButtons
                      buttons={[panel.ctaButton as SanityButtonProps]}
                      buttonClassName={cn(
                        "w-full hover:opacity-90",
                        colors.buttonBg,
                        colors.buttonText,
                      )}
                    />
                  </div>
                )}
              </motion.div>

              {/* Hover Indicator */}
              <div
                className={cn(
                  "absolute bottom-4 right-4 h-2 w-2 rounded-full transition-opacity duration-300",
                  colors.indicatorBg,
                  isHovered ? "opacity-100" : "opacity-0",
                )}
              />
            </div>

            {/* Subtle gradient overlay on hover */}
            <motion.div
              className={cn(
                "absolute inset-0 pointer-events-none",
                colors.overlay,
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.3 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        );
      })}
    />
  );
}
