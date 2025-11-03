import "@workspace/ui/styles/globals.css";
import "./background.css";

import {
  // Geist, Geist_Mono,
  Libre_Baskerville,
} from "next/font/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import { Suspense } from "react";

import { AnnouncerGuard } from "@/components/elements/a11y/announcer-guard";
import { A11yLiveAnnouncer } from "@/components/elements/a11y/live-announcer";
import { CombinedJsonLd } from "@/components/elements/json-ld";
import { FoxycartProvider } from "@/components/features/cart/foxycart-provider";
import { FooterServer, FooterSkeleton } from "@/components/features/footer";
import { Header } from "@/components/features/header";
import { DevDomRemoveTolerance } from "@/components/systems/dev/dom-remove-tolerance";
import { PresentationVisualEditing } from "@/components/systems/preview/presentation-visual-editing";
import { PreviewBar } from "@/components/systems/preview/preview-bar";
import { Providers } from "@/components/systems/providers";
import { resolveFoxyConfig } from "@/lib/foxy/config";
import { SanityLive } from "@/lib/sanity/live";
import { getActiveSite } from "@/lib/site";

const fontSerif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

// const fontSans = Geist({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

// const fontMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const foxyConfig = resolveFoxyConfig(process.env.NEXT_PUBLIC_FOXY_DOMAIN);
  const { brand } = await getActiveSite();

  return (
    <html
      lang="en"
      className="light"
      data-brand={brand}
      data-scroll-behavior="smooth"
      style={{ colorScheme: "light" } as React.CSSProperties}
    >
      <body
        className={`${fontSerif.variable}
        font-serif antialiased`}
        // add ${fontSans.variable} ${fontMono.variable} if needed
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <Providers>
          <Header />
          <main id="main">{children}</main>

          <Suspense fallback={<FooterSkeleton />}>
            <FooterServer />
          </Suspense>
          {/* Keep Next's route announcer anchored under <body> */}
          <AnnouncerGuard />
          {/* App-level A11y live region for custom announcements (polite/assertive) */}
          <A11yLiveAnnouncer />
          {/* Dev-only: suppress removeChild NotFoundError noise from third-party reparenting */}
          {process.env.NODE_ENV === "development" && DevDomRemoveTolerance && (
            <DevDomRemoveTolerance />
          )}
          <CombinedJsonLd includeWebsite includeOrganization />
          {/* FoxyCart Sidecart global listener */}
          <FoxycartProvider />
          {(await draftMode()).isEnabled && <PreviewBar />}
          <PresentationVisualEditing />
        </Providers>
        {/* {process.env.NODE_ENV === "development" &&
          process.env.PINY_VISUAL_SELECT === "true" && (
            <Script src="/_piny/piny.phone.js" strategy="beforeInteractive" />
          )}{" "} */}
        {/* <-- conditionally include the Piny script */}
        {/* FoxyCart Sidecart loader: loads jQuery if needed and intercepts forms/links */}
        {foxyConfig ? (
          <Script
            src={`https://cdn.foxycart.com/${foxyConfig.loaderSlug}/loader.js`}
            strategy="beforeInteractive"
          />
        ) : null}
        <SanityLive />
      </body>
    </html>
  );
}
