import "@workspace/ui/styles/globals.css";
import "./background.css";

import {
  // Geist, Geist_Mono,
  Libre_Baskerville,
} from "next/font/google";
import { cookies, draftMode, headers } from "next/headers";
import Script from "next/script";
import { VisualEditing } from "next-sanity";
import { Suspense } from "react";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { Header } from "@/components/header";
import { CombinedJsonLd } from "@/components/json-ld";
import { PreviewBar } from "@/components/preview-bar";
import { Providers } from "@/components/providers";
import { SanityLive } from "@/lib/sanity/live";

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
  // This is needed to support the color scheme client hint from cookies
  const themeCookie = (await cookies()).get("theme")?.value;
  const clientHints = await headers();
  const chPref = clientHints.get("Sec-CH-Prefers-Color-Scheme");
  const hintedTheme =
    chPref === "dark" || chPref === "light" ? chPref : undefined;
  const initialTheme =
    themeCookie === "dark" || themeCookie === "light"
      ? themeCookie
      : (hintedTheme ?? "light");
  return (
    <html
      lang="en"
      className={initialTheme}
      style={{ colorScheme: initialTheme } as React.CSSProperties}
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
        <Providers initialTheme={initialTheme as "light" | "dark"}>
          <Header />
          <main id="main">{children}</main>

          <Suspense fallback={<FooterSkeleton />}>
            <FooterServer />
          </Suspense>
          <SanityLive />
          <CombinedJsonLd includeWebsite includeOrganization />
          {(await draftMode()).isEnabled && (
            <>
              <PreviewBar />
              <VisualEditing />
            </>
          )}
        </Providers>
        {process.env.NODE_ENV === "development" &&
          process.env.PINY_VISUAL_SELECT === "true" && (
            <Script src="/_piny/piny.phone.js" strategy="beforeInteractive" />
          )}{" "}
        {/* <-- conditionally include the Piny script */}
      </body>
    </html>
  );
}
