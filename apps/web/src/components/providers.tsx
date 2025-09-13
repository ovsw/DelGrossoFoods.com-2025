"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function Providers({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: "light" | "dark";
}) {
  return (
    <NextThemesProvider
      attribute="class"
<NextThemesProvider
  attribute="class"
  defaultTheme={initialTheme}
  enableSystem={false}
  themes={["light", "dark"]}
  disableTransitionOnChange
  enableColorScheme
>
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}
