import { Section } from "@workspace/ui/components/section";

interface CollectionHeroSectionProps {
  readonly eyebrow?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly backgroundImageUrl?: string | null;
}

const DEFAULT_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=screen";

export function CollectionHeroSection({
  eyebrow,
  title,
  description,
  backgroundImageUrl,
}: CollectionHeroSectionProps) {
  const heroTitle = title ?? "";
  const heroDescription = description ?? "";
  const heroEyebrow = eyebrow ?? null;
  const imageUrl = backgroundImageUrl ?? DEFAULT_BACKGROUND_IMAGE;

  if (!heroTitle && !heroDescription && !heroEyebrow) {
    return null;
  }

  return (
    <Section
      spacingTop="none"
      spacingBottom="none"
      fullBleed
      className="relative isolate overflow-hidden"
    >
      <div className="relative isolate bg-background py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={imageUrl}
            loading="lazy"
            className="h-full w-full object-cover opacity-10"
          />
        </div>

        <div
          aria-hidden="true"
          className="hidden sm:absolute sm:-top-24 sm:right-1/3 sm:-z-10 sm:block sm:blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="h-72 w-[36rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute -top-64 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-72 sm:translate-x-0"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="h-72 w-[36rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-10"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl text-start">
            {heroEyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
                {heroEyebrow}
              </p>
            ) : null}
            {heroTitle ? (
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {heroTitle}
              </h1>
            ) : null}
            {heroDescription ? (
              <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl">
                {heroDescription}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
