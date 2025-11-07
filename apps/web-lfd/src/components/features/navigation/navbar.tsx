import { sanityFetch } from "@workspace/sanity-config/live";
import { getSiteParams } from "@workspace/sanity-config/site";
import type {
  LfdGlobalSeoSettingsQueryResult,
  LfdNavbarQueryResult,
} from "@workspace/sanity-config/types";

import LogoSvg from "@/components/elements/logo";
import {
  lfdGlobalSeoSettingsQuery,
  lfdNavbarQuery,
} from "@/lib/sanity/queries";

import { NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";

export async function NavbarServer() {
  const [navbarData, settingsData] = await Promise.all([
    sanityFetch({ query: lfdNavbarQuery, params: getSiteParams() }),
    sanityFetch({ query: lfdGlobalSeoSettingsQuery, params: getSiteParams() }),
  ]);
  return (
    <Navbar navbarData={navbarData.data} settingsData={settingsData.data} />
  );
}

export function Navbar({
  navbarData,
  settingsData,
}: {
  navbarData: LfdNavbarQueryResult;
  settingsData: LfdGlobalSeoSettingsQueryResult;
}) {
  const { siteTitle: settingsSiteTitle } = settingsData ?? {};

  return (
    <header className="py-3 md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <LogoSvg className="h-7" aria-label={settingsSiteTitle ?? "Logo"} />
          <NavbarClient navbarData={navbarData} settingsData={settingsData} />
        </div>
      </div>
    </header>
  );
}

export function NavbarSkeleton() {
  return (
    <header className="h-[75px] py-4 md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="h-[40px] w-[170px] rounded animate-pulse bg-muted" />
          <NavbarSkeletonResponsive />
        </div>
      </div>
    </header>
  );
}
