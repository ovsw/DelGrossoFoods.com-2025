import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import type { JSX } from "react";

interface SharedImageHeroSectionProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly backgroundSrc: string;
  readonly overlayTone?: "dark" | "none";
}

export function SharedImageHeroSection({
  title,
  subtitle,
  backgroundSrc,
  overlayTone = "dark",
}: SharedImageHeroSectionProps): JSX.Element {
  return (
    <Section
      spacingTop="page-top"
      spacingBottom="default"
      fullBleed
      className={cn("relative isolate overflow-hidden")}
      style={{ backgroundImage: `url('${backgroundSrc}')` }}
    >
      <div className="absolute inset-0 bg-cover bg-center" aria-hidden="true" />
      {overlayTone === "dark" ? (
        <div className="absolute inset-0 bg-gradient-to-t from-th-dark-900/70 via-th-dark-900/30 to-transparent" />
      ) : null}

      <div className="container relative mx-auto max-w-6xl px-4 md:px-0">
        <div className="flex flex-col items-center gap-4 py-8 text-center lg:py-12">
          <h1 className="text-4xl font-bold md:text-6xl">{title}</h1>
          {subtitle ? (
            <p className="text-base text-foreground/80 md:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
