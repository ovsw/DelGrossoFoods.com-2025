"use client";

import type {
  QueryGlobalSeoSettingsResult,
  QueryNavbarDataResult,
} from "@workspace/sanity-config/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import LogoSvg from "@/components/elements/logo";
import { SanityButtons } from "@/components/elements/sanity-buttons";
import { SanityIcon } from "@/components/elements/sanity-icon";

interface MenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

function normalizeHref(href?: string | null): string {
  if (!href) return "/";
  return href.startsWith("/") ? href : `/${href}`;
}

function isActiveRoute(currentPath: string, href?: string | null): boolean {
  const path = currentPath || "/";
  const target = normalizeHref(href);
  if (target === "/") return path === "/";
  return path === target || path.startsWith(`${target}/`);
}

function MenuItemLink({
  item,
  setIsOpen,
  active,
}: {
  item: MenuItem;
  setIsOpen?: (isOpen: boolean) => void;
  active?: boolean;
}) {
  return (
    <Link
      className={cn(
        "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors items-center",
        active
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      )}
      aria-label={`Link to ${item.title ?? item.href}`}
      aria-current={active ? "page" : undefined}
      onClick={() => setIsOpen?.(false)}
      href={item.href ?? "/"}
    >
      {item.icon}
      <div className="">
        <div className="text-sm font-semibold">{item.title}</div>
        <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

function MobileNavbarAccordionColumn({
  column,
  setIsOpen,
  currentPath,
}: {
  column: NonNullable<NonNullable<QueryNavbarDataResult>["columns"]>[number];
  setIsOpen: (isOpen: boolean) => void;
  currentPath: string;
}) {
  if (column.type !== "column") return null;
  return (
    <AccordionItem value={column.title ?? column._key} className="border-b-0">
      <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline hover:bg-accent hover:text-accent-foreground pr-2 rounded-md">
        <div
          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
        >
          {column.title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {column.links?.map((item) => (
          <MenuItemLink
            key={item._key}
            setIsOpen={setIsOpen}
            active={isActiveRoute(currentPath, item.href)}
            item={{
              description: item.description ?? "",
              href: item.href ?? "",
              icon: <SanityIcon icon={item.icon} className="size-5 shrink-0" />,
              title: item.name ?? "",
            }}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function MobileNavbar({
  navbarData,
  settingsData,
}: {
  navbarData: QueryNavbarDataResult;
  settingsData: QueryGlobalSeoSettingsResult;
}) {
  const { siteTitle } = settingsData ?? {};
  const { columns, buttons } = navbarData ?? {};
  const [isOpen, setIsOpen] = useState(false);

  const rawPath = usePathname();
  const currentPath = rawPath ?? "/";

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
  useEffect(() => {
    setIsOpen(false);
  }, [rawPath]);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-end">
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <div className="max-w-[130px]">
              <LogoSvg className="h-7" aria-label={siteTitle ?? "Logo"} />
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="mb-8 mt-8 flex flex-col gap-4">
          {columns?.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  key={`column-link-${item.name}-${item._key}`}
                  href={item.href ?? ""}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start",
                    isActiveRoute(currentPath, item.href)
                      ? "bg-accent text-accent-foreground"
                      : undefined,
                  )}
                  aria-current={
                    isActiveRoute(currentPath, item.href) ? "page" : undefined
                  }
                >
                  {item.name}
                </Link>
              );
            }
            return (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                key={item._key}
              >
                <MobileNavbarAccordionColumn
                  column={item}
                  setIsOpen={setIsOpen}
                  currentPath={currentPath}
                />
              </Accordion>
            );
          })}
        </div>

        <div className="border-t pt-4">
          <SanityButtons
            buttons={buttons ?? []}
            buttonClassName="w-full"
            className="flex mt-2 flex-col gap-3"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NavbarColumnLink({
  column,
}: {
  column: Extract<
    NonNullable<NonNullable<QueryNavbarDataResult>["columns"]>[number],
    { type: "link" }
  >;
}) {
  const rawPath = usePathname();
  const active = isActiveRoute(rawPath ?? "/", column.href);
  return (
    <Link
      aria-label={`Link to ${column.name ?? column.href}`}
      href={column.href ?? ""}
      // legacyBehavior
      className={cn(
        navigationMenuTriggerStyle(),
        active ? "text-foreground font-semibold" : "text-muted-foreground",
      )}
      // passHref
      aria-current={active ? "page" : undefined}
    >
      {/* <NavigationMenuLink
        > */}
      {column.name}
      {/* </NavigationMenuLink> */}
    </Link>
  );
}

function getColumnLayoutClass(itemCount: number) {
  if (itemCount <= 4) return "w-80";
  if (itemCount <= 8) return "grid grid-cols-2 gap-2 w-[500px]";
  return "grid grid-cols-3 gap-2 w-[700px]";
}

export function NavbarColumn({
  column,
}: {
  column: Extract<
    NonNullable<NonNullable<QueryNavbarDataResult>["columns"]>[number],
    { type: "column" }
  >;
}) {
  const rawPath = usePathname();
  const path = rawPath ?? "/";
  const isColumnActive = useMemo(() => {
    return column.links?.some((l) => isActiveRoute(path, l.href)) ?? false;
  }, [column.links, path]);
  const layoutClass = useMemo(
    () => getColumnLayoutClass(column.links?.length ?? 0),
    [column.links?.length],
  );

  return (
    <NavigationMenuList>
      <NavigationMenuItem className="text-muted-foreground">
        <NavigationMenuTrigger
          className={cn(isColumnActive ? "text-foreground font-semibold" : "")}
        >
          {column.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={cn("p-3", layoutClass)}>
            {column.links?.map((item) => (
              <li key={item._key}>
                <MenuItemLink
                  item={{
                    title: item.name ?? "",
                    description: item.description ?? "",
                    href: item.href ?? "",
                    icon: (
                      <SanityIcon
                        icon={item.icon}
                        className="size-5 shrink-0"
                      />
                    ),
                  }}
                  active={isActiveRoute(path, item.href)}
                />
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}

export function DesktopNavbar({
  navbarData,
}: {
  navbarData: QueryNavbarDataResult;
}) {
  const { columns, buttons } = navbarData ?? {};

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-8">
      <NavigationMenu className="">
        {columns?.map((column) =>
          column.type === "column" ? (
            <NavbarColumn key={`nav-${column._key}`} column={column} />
          ) : (
            <NavbarColumnLink key={`nav-${column._key}`} column={column} />
          ),
        )}
      </NavigationMenu>

      <div className="justify-self-end flex items-center gap-4">
        <SanityButtons
          buttons={buttons ?? []}
          className="flex items-center gap-4"
          buttonClassName="rounded-[10px]"
        />
      </div>
    </div>
  );
}

export function NavbarClient({
  navbarData,
  settingsData,
}: {
  navbarData: QueryNavbarDataResult;
  settingsData: QueryGlobalSeoSettingsResult;
}) {
  return (
    <nav aria-label="Primary">
      <div className="md:hidden">
        <MobileNavbar navbarData={navbarData} settingsData={settingsData} />
      </div>
      <div className="hidden md:block">
        <DesktopNavbar navbarData={navbarData} />
      </div>
    </nav>
  );
}

function SkeletonMobileNavbar() {
  return (
    <div className="md:hidden">
      <div className="flex justify-end">
        <div className="h-12 w-12 rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonDesktopNavbar() {
  return (
    <div className="hidden md:grid grid-cols-[1fr_auto] items-center gap-8 w-full">
      <div className="justify-center flex max-w-max flex-1 items-center gap-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`nav-item-skeleton-${index.toString()}`}
            className="h-12 w-32 rounded bg-muted animate-pulse"
          />
        ))}
      </div>

      <div className="justify-self-end">
        <div className="flex items-center gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`nav-button-skeleton-${index.toString()}`}
              className="h-12 w-32 rounded-[10px] bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function NavbarSkeletonResponsive() {
  return (
    <>
      <SkeletonMobileNavbar />
      <SkeletonDesktopNavbar />
    </>
  );
}
