import { Badge } from "@workspace/ui/components/badge";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import { stegaClean } from "next-sanity";
import type { ReactNode } from "react";

import { SanityImage } from "@/components/elements/sanity-image";

export interface HeroLayoutProps {
  readonly title: string;
  readonly eyebrow?: string;
  readonly image?: {
    readonly id: string | null;
    readonly preview: string | null;
    readonly hotspot: { x: number; y: number } | null;
    readonly crop: {
      bottom: number;
      left: number;
      right: number;
      top: number;
    } | null;
    readonly alt?: string;
    readonly width?: number;
    readonly height?: number;
    readonly mode?: "cover" | "contain";
  } | null;
  readonly badges?: Array<{
    readonly text: string;
    readonly variant:
      | "outline"
      | "original"
      | "premium"
      | "neutral"
      | "organic"
      | "pasta"
      | "pizza"
      | "salsa"
      | "sandwich"
      | "low-carb"
      | "quick"
      | "vegetarian"
      | "gluten-free"
      | "meat"
      | "accent";
  }>;
  readonly variant?: "default" | "overlay";
  readonly backgroundImage?: string;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly fullBleed?: boolean;
}

export function HeroLayout({
  title,
  eyebrow,
  image,
  badges = [],
  variant = "default",
  backgroundImage,
  className,
  children,
  fullBleed = false,
}: HeroLayoutProps) {
  const cleanedTitle = stegaClean(title);

  if (variant === "overlay") {
    return (
      <div className={cn("relative", className)}>
        <div className="relative max-h-[85svh] min-h-[80vh] w-full overflow-hidden bg-muted">
          {image?.id ? (
            <SanityImage
              image={image}
              alt={image.alt || `${cleanedTitle} image`}
              width={image.width || 1920}
              height={image.height || 1200}
              className="absolute inset-0 h-full w-full object-cover"
              mode={image.mode || "cover"}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <div className="text-muted-foreground text-lg">
                {cleanedTitle || "Image"}
              </div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-th-dark-900/70 via-th-dark-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto lg:max-w-6xl">
            {eyebrow && (
              <div className="mb-4">
                <Eyebrow text={eyebrow} className="text-white/80" />
              </div>
            )}
            <h1 className="text-4xl font-bold md:text-6xl">{title}</h1>
            {badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge
                    key={`${badge.text}-${index}`}
                    text={badge.text}
                    variant={badge.variant}
                    className="text-sm"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant with background and grid layout
  return (
    <Section
      spacingTop="page-top"
      spacingBottom="default"
      fullBleed={fullBleed}
      className={cn(
        "relative isolate overflow-hidden",
        backgroundImage && `bg-cover bg-bottom`,
        className,
      )}
      style={
        backgroundImage
          ? { backgroundImage: `url('${backgroundImage}')` }
          : undefined
      }
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
      )}
      <div className="container relative mx-auto max-w-6xl px-4 md:px-0">
        <div className="grid items-center gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
          <div className="flex flex-col justify-center gap-6 text-center lg:text-start">
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <h1 className="text-4xl leading-tight font-semibold text-balance lg:text-6xl">
                {title}
              </h1>
              {eyebrow && (
                <Eyebrow
                  text={eyebrow}
                  className="border-brand-green text-th-dark-900/70"
                />
              )}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <Badge
                      key={`${badge.text}-${index}`}
                      text={badge.text}
                      variant={badge.variant}
                      className="text-sm"
                    />
                  ))}
                </div>
              )}
            </div>
            {children}
          </div>

          {image?.id ? (
            <div className="flex w-full justify-center">
              <SanityImage
                image={image}
                alt={image.alt || `${cleanedTitle} image`}
                width={image.width || 420}
                height={image.height || 560}
                respectSanityCrop={false}
                className="max-h-118 w-full object-contain"
              />
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
