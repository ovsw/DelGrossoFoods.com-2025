import { Section } from "@workspace/ui/components/section";

import { ContactForm } from "@/components/features/contact/contact-form";

export function ContactFormSection() {
  return (
    <Section spacingTop="default" spacingBottom="default">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-white/50 rounded-lg border border-input p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Send us a message
          </h2>
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
