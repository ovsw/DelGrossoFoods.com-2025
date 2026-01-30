import "@workspace/ui/styles/globals.css";
import "@workspace/ui/styles/lfd-theme.css";
import "./background.css";

import { SanityLive } from "@workspace/sanity-config/live";
import {
  // Geist, Geist_Mono,
  Libre_Baskerville,
} from "next/font/google";
import { draftMode } from "next/headers";
import Script from "next/script";
import { VisualEditing } from "next-sanity/visual-editing";
import { Suspense } from "react";

import { AnnouncerGuard } from "@/components/elements/a11y/announcer-guard";
import { A11yLiveAnnouncer } from "@/components/elements/a11y/live-announcer";
import { CombinedJsonLd } from "@/components/elements/json-ld";
import { FoxycartProvider } from "@/components/features/cart/foxycart-provider";
import { FooterServer, FooterSkeleton } from "@/components/features/footer";
import { HeaderServer } from "@/components/features/header/header-server";
import { DevDomRemoveTolerance } from "@/components/systems/dev/dom-remove-tolerance";
import { PreviewBar } from "@/components/systems/preview/preview-bar";
import { Providers } from "@/components/systems/providers";
import { resolveFoxyConfig } from "@/lib/foxy/config";

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

  return (
    <html
      lang="en"
      className="light"
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80] focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Skip to main content
        </a>
        <Providers>
          <HeaderServer />
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
          {(await draftMode()).isEnabled && (
            <>
              <PreviewBar />
              <VisualEditing />
            </>
          )}
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
        <Suspense fallback={null}>
          <SanityLive />
        </Suspense>
      </body>
    </html>
  );
}
