import { Section } from "@workspace/ui/components/section";

interface ContactHeroSectionProps {
  title: string;
  description: string;
}

export function ContactHeroSection({
  title,
  description,
}: ContactHeroSectionProps) {
  return (
    <Section spacingTop="page-top" spacingBottom="default">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-5xl text-brand-green">
            {title}
          </h1>
          <p className="mt-4 text-xl leading-8 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Section>
  );
}
