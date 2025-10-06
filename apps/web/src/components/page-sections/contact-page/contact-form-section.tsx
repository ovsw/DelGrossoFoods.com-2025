import { Section } from "@workspace/ui/components/section";
import { Building2, Globe, Mail, Phone } from "lucide-react";

import { DecoratedSplitLayout } from "@/components/layouts/decorated-split-layout";

import { ContactForm } from "./contact-form";

interface ContactFormSectionProps {
  title: string;
  description: string;
}

export function ContactFormSection({
  title,
  description,
}: ContactFormSectionProps) {
  return (
    <Section spacingTop="page-top" spacingBottom="default">
      <DecoratedSplitLayout decoratedColumn="secondary" mainPosition="left">
        <DecoratedSplitLayout.Main>
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-lg/8 text-muted-foreground">{description}</p>

          {/* Response Time */}
          <div className="mt-6 p-4 bg-brand-green/5 border border-brand-green/20 rounded-lg">
            <p className="text-sm text-brand-green font-medium">
              We typically respond within 24-48 hours
            </p>
          </div>

          <dl className="mt-10 space-y-4 text-base/7 text-muted-foreground">
            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Address</span>
                <Building2
                  aria-hidden="true"
                  className="h-7 w-6 text-muted-foreground/60"
                />
              </dt>
              <dd>
                <strong className="text-foreground">
                  DelGrosso Foods Inc.
                </strong>
                <br />
                632 Sauce Factory Drive
                <br />
                P.O. Box 337
                <br />
                Tipton, PA 16684
              </dd>
            </div>

            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Telephone</span>
                <Phone
                  aria-hidden="true"
                  className="h-7 w-6 text-muted-foreground/60"
                />
              </dt>
              <dd>
                <a
                  href="tel:814-684-5880"
                  className="hover:text-foreground transition-colors"
                >
                  814-684-5880
                </a>
                <br />
                <a
                  href="tel:1-800-521-5880"
                  className="hover:text-foreground transition-colors"
                >
                  1-800-521-5880 (Toll Free)
                </a>
              </dd>
            </div>

            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Email</span>
                <Mail
                  aria-hidden="true"
                  className="h-7 w-6 text-muted-foreground/60"
                />
              </dt>
              <dd>
                <a
                  href="mailto:info@delgrossosauce.com"
                  className="hover:text-foreground transition-colors"
                >
                  info@delgrossosauce.com
                </a>
              </dd>
            </div>

            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Website</span>
                <Globe
                  aria-hidden="true"
                  className="h-7 w-6 text-muted-foreground/60"
                />
              </dt>
              <dd>
                <a
                  href="https://www.delgrossos.com"
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.delgrossos.com
                </a>
              </dd>
            </div>
          </dl>
        </DecoratedSplitLayout.Main>

        <DecoratedSplitLayout.Secondary>
          <ContactForm />
        </DecoratedSplitLayout.Secondary>
      </DecoratedSplitLayout>
    </Section>
  );
}
