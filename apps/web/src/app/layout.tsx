import "@workspace/ui/styles/globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { cookies, draftMode, headers } from "next/headers";
import { VisualEditing } from "next-sanity";
import { Suspense } from "react";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { CombinedJsonLd } from "@/components/json-ld";
import { NavbarServer, NavbarSkeleton } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { Providers } from "@/components/providers";
import { SanityLive } from "@/lib/sanity/live";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
      : hintedTheme;
  return (
    <html
      lang="en"
      className={initialTheme}
      style={
        initialTheme
          ? ({ colorScheme: initialTheme } as React.CSSProperties)
          : undefined
      }
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <Providers initialTheme={initialTheme as "light" | "dark" | undefined}>
          <Suspense fallback={<NavbarSkeleton />}>
            <NavbarServer />
          </Suspense>
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
      </body>
    </html>
  );
}
