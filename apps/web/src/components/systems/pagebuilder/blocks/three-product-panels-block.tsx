"use client";

import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityImage } from "@/components/elements/sanity-image";
import type { SanityButtonProps } from "@/types";

import type { PageBuilderBlockProps } from "../types";
import { resolveSectionSpacing } from "../utils/section-spacing";

export type ThreeProductPanelsProps =
  PageBuilderBlockProps<"threeProductPanels">;

/**
 * Sanity page builder block. Render via PageBuilder; do not import directly into route components.
 */
export function ThreeProductPanelsBlock({
  eyebrow,
  title,
  subtitle,
  panels,
  spacing,
  isPageTop = false,
}: ThreeProductPanelsProps) {
  const { spacingTop, spacingBottom } = resolveSectionSpacing(spacing as any);
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  if (!panels || panels.length !== 3) {
    return null;
  }

  const getAccentColors = (accentColor: string) => {
    switch (accentColor) {
      case "green":
        return {
          bg: "bg-th-green-600",
          text: "text-th-green-600",
          border: "border-th-green-600",
          hoverBg: "hover:bg-th-green-600/10",
          lightBg: "bg-th-green-600/5",
        };
      case "brown":
        return {
          bg: "bg-th-brown-600",
          text: "text-th-brown-600",
          border: "border-th-brown-600",
          hoverBg: "hover:bg-th-brown-600/10",
          lightBg: "bg-th-brown-600/5",
        };
      case "red":
      default:
        return {
          bg: "bg-th-red-600",
          text: "text-th-red-600",
          border: "border-th-red-600",
          hoverBg: "hover:bg-th-red-600/10",
          lightBg: "bg-th-red-600/5",
        };
    }
  };

  return (
    <Section
      spacingTop={spacingTop}
      spacingBottom={spacingBottom}
      isPageTop={isPageTop}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          {eyebrow && <Eyebrow text={eyebrow} className="text-brand-green" />}
          {title && (
            <h2 className="mb-4 text-3xl font-bold text-brand-green lg:text-5xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-th-dark-700">
              {subtitle}
            </p>
          )}
        </div>

        {/* Three Panels Grid */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {panels.map((panel, index) => {
            const colors = getAccentColors(panel.accentColor || "red");
            const isHovered = hoveredPanel === index;

            return (
              <motion.div
                key={panel._key}
                className={cn(
                  "relative cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-300 ease-in-out",
                  colors.border,
                  colors.hoverBg,
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
                  <h3 className={cn("mb-4 text-2xl font-bold", colors.text)}>
                    {panel.title}
                  </h3>

                  {/* Short Description */}
                  <div className="mb-4 text-th-dark-700">
                    <p className="text-sm leading-relaxed">
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
                    <div className={cn("mb-4 rounded-lg p-4", colors.lightBg)}>
                      <p className="text-sm leading-relaxed text-th-dark-700">
                        {panel.expandedDescription}
                      </p>
                    </div>

                    {/* CTA Button */}
                    {panel.ctaButton && (
                      <div className="mt-4">
                        <SanityButtons
                          buttons={[panel.ctaButton as SanityButtonProps]}
                          buttonClassName={cn(
                            "w-full",
                            colors.bg,
                            "text-white hover:opacity-90",
                          )}
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* Hover Indicator */}
                  <div
                    className={cn(
                      "absolute bottom-4 right-4 h-2 w-2 rounded-full transition-opacity duration-300",
                      colors.bg,
                      isHovered ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>

                {/* Subtle gradient overlay on hover */}
                <motion.div
                  className={cn(
                    "absolute inset-0 pointer-events-none",
                    colors.lightBg,
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 0.3 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
