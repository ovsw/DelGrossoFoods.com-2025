import { Section } from "@workspace/ui/components/section";
import { Building2, Globe, Mail, Phone } from "lucide-react";

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
      <div className="relative isolate">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          {/* Contact Information Section */}
          <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              {/* Decorative background */}
              <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-muted/30 lg:w-1/2 rounded-tr-2xl rounded-br-2xl ">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-muted-foreground/90"
                >
                  <defs>
                    <pattern
                      x="100%"
                      y={-1}
                      id="contact-pattern"
                      width={200}
                      height={200}
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M130 200V.5M.5 .5H200" fill="none" />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    strokeWidth={0}
                    className="fill-background"
                  />
                  <svg
                    x="100%"
                    y={-1}
                    className="overflow-visible fill-muted/20"
                  >
                    <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                  </svg>
                  <rect
                    fill="url(#contact-pattern)"
                    width="100%"
                    height="100%"
                    strokeWidth={0}
                  />
                </svg>
                <div
                  aria-hidden="true"
                  className="absolute top-[calc(100%-13rem)] -left-56 hidden transform-gpu blur-3xl lg:top-[calc(50%-7rem)] lg:left-[max(-14rem,calc(100%-59rem))]"
                >
                  <div
                    style={{
                      clipPath:
                        "polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)",
                    }}
                    className="aspect-1155/678 w-288.75 bg-gradient-to-br from-brand-green/10 to-brand-green/5 opacity-20"
                  />
                </div>
              </div>

              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl">
                {title}
              </h2>
              <p className="mt-6 text-lg/8 text-muted-foreground">
                {description}
              </p>

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
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// Import this inside the component to avoid circular dependencies
import { ContactForm } from "./contact-form";
