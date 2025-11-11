import { sanityFetch } from "@workspace/sanity-config/live";
import { getSiteParams } from "@workspace/sanity-config/site";
import type {
  DgfGlobalSeoSettingsQueryResult,
  DgfNavbarQueryResult,
} from "@workspace/sanity-config/types";

import {
  dgfGlobalSeoSettingsQuery,
  dgfNavbarQuery,
} from "@/lib/sanity/queries";

import { NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";

export async function NavbarServer() {
  const [navbarData, settingsData] = await Promise.all([
    sanityFetch({ query: dgfNavbarQuery, params: getSiteParams() }),
    sanityFetch({ query: dgfGlobalSeoSettingsQuery, params: getSiteParams() }),
  ]);
  return (
    <Navbar navbarData={navbarData.data} settingsData={settingsData.data} />
  );
}

export function Navbar({
  navbarData,
  settingsData,
}: {
  navbarData: DgfNavbarQueryResult;
  settingsData: DgfGlobalSeoSettingsQueryResult;
}) {
  return (
    <NavbarClient
      navbarData={navbarData}
      settingsData={settingsData}
      navbarDocumentId={navbarData?._id}
      navbarDocumentType={navbarData?._type}
    />
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
